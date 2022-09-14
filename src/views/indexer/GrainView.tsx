import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Card from '../../components-indexer/card/Card'
import Col from '../../components/spacing/Col'
import Container from '../../components/spacing/Container'
import Row from '../../components/spacing/Row'
import Text from '../../components/text/Text'
import CopyIcon from '../../components/text/CopyIcon'
import useIndexerStore from '../../stores/indexerStore'
import { Transaction } from '../../types/indexer/Transaction'
import { mockData } from '../../utils/constants'
import { removeDots } from '../../utils/format'
import { addHexDots } from '../../utils/number'
import { processRawData } from '../../utils/object'
import { mockHolderGrains, mockTransactions } from '../../mocks/indexer-mocks'
import { RawGrain, Grain } from '../../types/indexer/Grain'
import { RawLocation } from '../../types/indexer/Location'
import { HashData, RawHashData } from '../../types/indexer/HashData'
import { TransactionEntry } from '../../components-indexer/indexer/Transaction'
import PageHeader from '../../components/page/PageHeader'
import Footer from '../../components-indexer/nav/Footer'
import CardHeader from '../../components-indexer/card/CardHeader'
import Entry from '../../components/spacing/Entry'
import Loader from '../../components/popups/Loader'

import './GrainView.scss'
import Field from '../../components/spacing/Field'
import Link from '../../components-indexer/nav/Link'

type Selection = 'details' | 'txns'

const GrainView = () => {
  const { metadata, scry } = useIndexerStore()
  const location = useLocation()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [grain, setGrain] = useState<Grain | undefined>(undefined)
  const [display, setDisplay] = useState<Selection>('details')
  const [grainIsRice, setGrainIsRice] = useState(false)
  const [loading, setLoading] = useState(true)
  const tokenMetadata = Object.values(metadata).find(({ data }) => data.salt === grain?.salt)

  const splitPath = location.pathname.split('/')
  const grainId = addHexDots(splitPath[splitPath.length - 1])

  useEffect(() => {
    const getData = async () => {
      try {
        const [rawData, grainEggs, grainInfo] = await Promise.all([
          scry<RawHashData>(`/hash/${grainId}`),
          scry<any>(`/grain-eggs/${grainId}`),
          scry<{ grain: { [key: string]: { grain: RawGrain; location: RawLocation, timestamp: number }[] } }>(`/grain/${grainId}`)
        ])

        // console.log('SCRY: ', rawData, grainInfo)
        console.log(grainEggs)
        
        try {
          const grainIsRice = Boolean(
            Object.values(grainInfo?.grain || {})[0][0]?.grain?.['is-rice']
          )
          setGrainIsRice(grainIsRice)
          setGrain(processRawData(Object.values(grainInfo?.grain || {})[0][0]?.grain))
        } catch (err) {}

        if (rawData) {
          const { hash }: HashData = processRawData(rawData)
          const txns = Object.keys(hash.eggs).map(txnHash => ({ ...hash.eggs[txnHash], hash: txnHash }))
          setTransactions(txns)
        }

        setLoading(false)
      } catch (err) {}
    }

    if (mockData) {
      setGrain(mockHolderGrains[0])
      return setTransactions(mockTransactions)
    }

    getData()
  }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container className='grain-view'>
      <PageHeader title={'Grain'}>
        <Text mono oneLine style={{ fontSize: 18 }}>
          {removeDots(grainId)}
        </Text>
        <CopyIcon text={removeDots(grainId)} />
      </PageHeader>
      <Entry>
        <Card>
          {/* <CardHeader style={{ padding: '0 1em 0 0' }}> 
            <Row fullWidth between>
              <Row>
                <Text onClick={() => setDisplay('details')} className={`selector ${display === 'details' && 'selected'}`}>
                  Details
                </Text>
                <Text onClick={() => setDisplay('txns')} className={`selector ${display === 'txns' && 'selected'}`}>
                  Transactions
                </Text>
              </Row>
            </Row>
          </CardHeader> */}
          <Col>
            {display === 'txns' ? (
              transactions.length > 0 ? (
                transactions.map((tx, i, arr) => (
                  <TransactionEntry tx={tx} displayIndex={arr.length - i} key={tx.hash || i} />
                ))
              ) : transactions.length > 0 ? (
                <Text style={{ marginTop: 16 }}>No transactions under this town</Text>
              ) : (
                loading ? (
                  <Loader dark style={{ marginTop: 16 }}/>
                ) : (
                  <Text style={{ marginTop: 16 }}>No transactions</Text>
                )
              )
            ) : (
              <>
                {loading ? (
                  <Loader dark style={{ marginTop: 16 }}/>
                ) : (
                  grain && (
                    <Entry divide className='indexer-grain' key={grain.id}>
                      {Boolean(tokenMetadata) && (
                        <Field name='Token:'>
                          <Text mono oneLine>{tokenMetadata?.data?.symbol}</Text>
                          <CopyIcon text={tokenMetadata?.data?.symbol!}></CopyIcon>
                        </Field>
                      )}
                      <Field name='Lord:'>
                        <Link href={`/address/${removeDots(grain.lord)}`}>
                          <Text mono oneLine>{removeDots(grain.lord)}</Text>
                        </Link>
                        <CopyIcon text={removeDots(grain.lord)}></CopyIcon>
                      </Field>
                      <Field name='Holder:'>
                        <Link href={`/address/${removeDots(grain.holder)}`}>
                          <Text mono oneLine>{removeDots(grain.holder)}</Text>
                        </Link>
                        <CopyIcon text={removeDots(grain.holder)}></CopyIcon>
                      </Field>
                      <Field name='Label:'>
                        <Text mono oneLine>{grain.label}</Text>
                      </Field>
                      <Field name='Is Rice:'>
                        <Text mono oneLine>{String(grainIsRice)}</Text>
                      </Field>
                      <Field name='Salt:'>
                        <Text mono oneLine>{grain.salt}</Text>
                        <CopyIcon text={String(grain.salt)}></CopyIcon>
                      </Field>
                      <Field name='Data:'>
                        <Text mono oneLine>{grain.data}</Text>
                        <CopyIcon text={grain.data}></CopyIcon>
                      </Field>
                      <Field name='Town:'>
                        <Text mono oneLine>{grain.townId}</Text>
                        {/* <CopyIcon text={`${grain.townId}`}></CopyIcon> */}
                      </Field>
                    </Entry>
                  )
                )}
              </>
            )}
          </Col>
        </Card>
      </Entry>
      <Footer/>
    </Container>
  )
}

export default GrainView
