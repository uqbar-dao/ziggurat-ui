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

import './AddressView.scss'
import { Grain, RawGrain } from '../../types/indexer/Grain'
import { RawLocation } from '../../types/indexer/Location'
import { HashData, RawHashData } from '../../types/indexer/HashData'
import { ADDRESS_REGEX, ETH_ADDRESS_REGEX } from '../../utils/regex'
import { TransactionEntry } from '../../components-indexer/indexer/Transaction'
import { GrainEntry } from '../../components-indexer/indexer/Grain'
import PageHeader from '../../components/page/PageHeader'
import Footer from '../../components-indexer/nav/Footer'
import CardHeader from '../../components-indexer/card/CardHeader'
import Entry from '../../components/spacing/Entry'

type Selection = 'txns' | 'grains'

const AddressView = () => {
  const { scry } = useIndexerStore()
  const location = useLocation()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [grains, setGrains] = useState<Grain[]>([])
  const [display, setDisplay] = useState<Selection>('txns')
  const [grainIsRice, setGrainIsRice] = useState(false)
  const [town, setTown] = useState(-1)

  const splitPath = location.pathname.split('/')
  const address = addHexDots(splitPath[splitPath.length - 1])
  const isWalletAddress = ADDRESS_REGEX.test(removeDots(address)) || ETH_ADDRESS_REGEX.test(removeDots(address))

  useEffect(() => {
    const getData = async () => {
      try {
        const [rawData, rawGrains, grainInfo] = await Promise.all([
          scry<RawHashData>(`/hash/${address}`),
          scry<{ grain: { [key: string]: { grain: RawGrain; location: RawLocation } } }>(`/holder/${address}`),
          scry<{ grain: { [key: string]: { grain: RawGrain; location: RawLocation } } }>(`/grain/${address}`)
        ])

        console.log('SCRY: ', rawData, rawGrains, grainInfo)
        
        const grainIsRice = Boolean(
          Object.values(grainInfo?.grain || {}).length === 1 &&
          Object.values(grainInfo?.grain || {})[0]?.grain?.germ?.['is-rice']
        )
        setGrainIsRice(grainIsRice)
        if (grainIsRice && !isWalletAddress) {
          setDisplay('grains')
        }

        const preprocessedGrains = Object.values(rawGrains?.grain || grainInfo?.grain || {})
        const newGrains = preprocessedGrains.map(v => processRawData(v))
        .flat()
        .map(g => g.grain)
        
        setGrains(newGrains)

        if (rawData) {
          const { hash }: HashData = processRawData(rawData)
          const txns = Object.keys(hash.eggs).map(txnHash => ({ ...hash.eggs[txnHash], hash: txnHash }))
          setTransactions(txns)
        }
      } catch (err) {}
    }

    if (mockData) {
      setGrains(mockHolderGrains)
      return setTransactions(mockTransactions)
    }

    getData()
  }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

  const isRice = !isWalletAddress && grainIsRice

  const towns: number[] = (display === 'txns' ? transactions.reduce((acc: number[], cur: Grain | Transaction) => {
    if ('townId' in cur) {
      if (!acc.includes(cur.townId)) {
        acc.push(cur.townId)
      }
    } else {
      if (!acc.includes(cur.location.townId)) {
        acc.push(cur.location.townId)
      }
    }
    return acc
  }, []) : grains.reduce((acc: number[], cur: Grain | Transaction) => {
    if ('townId' in cur) {
      if (!acc.includes(cur.townId)) {
        acc.push(cur.townId)
      }
    } else {
      if (!acc.includes(cur.location.townId)) {
        acc.push(cur.location.townId)
      }
    }
    return acc
  }, []))

  const displayTransactions = town < 0 ? transactions : transactions.filter(tx => tx.location.townId === town)
  const displayGrains = town < 0 ? grains : grains.filter(gr => gr.townId === town)

  return (
    <Container className='address-view'>
      <PageHeader title={isWalletAddress ? 'Address' : grainIsRice ? 'Asset' : 'Contract'}>
        <Text mono oneLine style={{ fontSize: 18 }}>
          {removeDots(address)}
        </Text>
        <CopyIcon text={removeDots(address)} />
      </PageHeader>
      <Entry>
        <Card>
          {!isRice && (
            <CardHeader style={{ padding: '0 1em 0 0' }}> 
              <Row fullWidth between>
                <Row>
                  <Text onClick={() => setDisplay('txns')} className={`selector ${display === 'txns' && 'selected'}`}>
                    Transactions
                  </Text>
                  <Text onClick={() => setDisplay('grains')} className={`selector ${display === 'grains' && 'selected'}`}>
                    Assets
                  </Text>
                </Row>
                <Row>
                  <Text mr1>Town:</Text>
                  <select value={town} className='small text' style={{paddingRight: '1em'}} onChange={(e) => setTown(Number(e.target.value))}>
                    <option value={-1} key={-1}>All</option>
                    {towns.map(t => <option value={t} key={t}>{t}</option>)}
                  </select>
                </Row>
              </Row>
            </CardHeader>
          )}
          <Col>
            {display === 'txns' ? (
              displayTransactions.length > 0 ? (
                displayTransactions.map((tx, i, arr) => (
                  <TransactionEntry tx={tx} isWalletAddress={isWalletAddress} displayIndex={arr.length - i} key={tx.hash || i} />
                ))
              ) : transactions.length > 0 ? (
                <Text>No transactions under this town</Text>
              ) : (
                <Text>No transactions</Text>
              )
            ) : (
              displayGrains.length > 0 ? (
                displayGrains.map((grain, i) => (
                  <GrainEntry grain={grain} isRiceView={isRice} isWalletAddress={isWalletAddress} key={i} />
                ))
              ) :  grains.length > 0 ? (
                <Text style={{ padding: 16 }}>No assets under this town</Text>
              ) : (
                <Text>No assets</Text>
              )
            )}
          </Col>
        </Card>
      </Entry>
      <Footer/>
    </Container>
  )
}

export default AddressView
