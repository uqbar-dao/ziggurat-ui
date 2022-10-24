import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Card from '../../components-indexer/card/Card'
import Col from '../../components/spacing/Col'
import Container from '../../components/spacing/Container'
import Text from '../../components/text/Text'
import CopyIcon from '../../components/text/CopyIcon'
import useIndexerStore from '../../stores/indexerStore'
import { Transaction } from '../../types/indexer/Transaction'
import { mockData } from '../../utils/constants'
import { addHexDots } from '../../utils/format'
import { mockTransactions } from '../../mocks/indexer-mocks'
import { Grain } from '../../types/indexer/Grain'
import { Location } from '../../types/indexer/Location'
import { HashData } from '../../types/indexer/HashData'
import { TransactionEntry } from '../../components-indexer/indexer/Transaction'
import PageHeader from '../../components/page/PageHeader'
import Footer from '../../components-indexer/nav/Footer'
import Entry from '../../components/spacing/Entry'
import Loader from '../../components/popups/Loader'
import Field from '../../components/spacing/Field'
import Link from '../../components-indexer/nav/Link'

import './GrainView.scss'

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
        const [rawData, grainTxns, grainInfo] = await Promise.all([
          scry<HashData>(`/hash/${grainId}`),
          scry<any>(`/grain-txns/${grainId}`),
          scry<{ grain: { [key: string]: { grain: Grain; location: Location, timestamp: number }[] } }>(`/grain/${grainId}`)
        ])

        // console.log('SCRY: ', rawData, grainInfo)
        console.log(grainTxns)

        try {
          const grainIsRice = Boolean(
            Object.values(grainInfo?.grain || {})[0][0]?.grain?.['is-rice']
          )
          setGrainIsRice(grainIsRice)
          setGrain(Object.values(grainInfo?.grain || {})[0][0]?.grain)
        } catch (err) {}

        if (rawData) {
          const { hash }: HashData = rawData
          const txns = Object.keys(hash.txns).map(txnHash => ({ ...hash.txns[txnHash], hash: txnHash }))
          setTransactions(txns)
        }

        setLoading(false)
      } catch (err) {}
    }

    if (mockData) {
      // setGrain(mockHolderGrains[0])
      return setTransactions(mockTransactions)
    }

    getData()
  }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container className='grain-view'>
      <PageHeader title={'Grain'}>
        <Text mono oneLine style={{ fontSize: 18 }}>
          {addHexDots(grainId)}
        </Text>
        <CopyIcon text={addHexDots(grainId)} />
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
                        <Link href={`/address/${addHexDots(grain.lord)}`}>
                          <Text mono oneLine>{addHexDots(grain.lord)}</Text>
                        </Link>
                        <CopyIcon text={addHexDots(grain.lord)}></CopyIcon>
                      </Field>
                      <Field name='Holder:'>
                        <Link href={`/address/${addHexDots(grain.holder)}`}>
                          <Text mono oneLine>{addHexDots(grain.holder)}</Text>
                        </Link>
                        <CopyIcon text={addHexDots(grain.holder)}></CopyIcon>
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
                        <Text mono>{JSON.stringify(grain.data)}</Text>
                        <CopyIcon text={JSON.stringify(grain.data)}></CopyIcon>
                      </Field>
                      <Field name='Town:'>
                        <Text mono oneLine>{grain['town-id']}</Text>
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
