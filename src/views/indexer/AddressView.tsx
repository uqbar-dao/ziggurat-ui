import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Card from '../../components-indexer/card/Card'
import Col from '../../components/spacing/Col'
import Container from '../../components/spacing/Container'
import Row from '../../components/spacing/Row'
import Text from '../../components/text/Text'
import useIndexerStore from '../../stores/indexerStore'
import { Transaction } from '../../types/indexer/Transaction'
import { mockData } from '../../utils/constants'
import { removeDots, addHexDots } from '../../utils/format'
import { mockHolderGrains, mockTransactions } from '../../mocks/indexer-mocks'
import { Grain } from '../../types/indexer/Grain'
import { Location } from '../../types/indexer/Location'
import { HashData } from '../../types/indexer/HashData'
import { ADDRESS_REGEX, ETH_ADDRESS_REGEX } from '../../utils/regex'
import { TransactionEntry } from '../../components-indexer/indexer/Transaction'
import { GrainEntry } from '../../components-indexer/indexer/Grain'
import PageHeader from '../../components/page/PageHeader'
import Footer from '../../components-indexer/nav/Footer'
import CardHeader from '../../components-indexer/card/CardHeader'
import Entry from '../../components/spacing/Entry'
import HexNum from '../../components/text/HexNum'
import Loader from '../../components/popups/Loader'

import './AddressView.scss'

type Selection = 'txns' | 'grains'

const AddressView = () => {
  const { scry } = useIndexerStore()
  const location = useLocation()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [grains, setGrains] = useState<Grain[]>([])
  const [display, setDisplay] = useState<Selection>('txns')
  const [town, setTown] = useState<string>('')
  const [loading, setLoading] = useState(true)

  const splitPath = location.pathname.split('/')
  const address = addHexDots(splitPath[splitPath.length - 1])
  const isWalletAddress = ADDRESS_REGEX.test(removeDots(address)) || ETH_ADDRESS_REGEX.test(removeDots(address))

  useEffect(() => {
    const getData = async () => {
      try {
        const [rawData, grainInfo] = await Promise.all([
          scry<HashData>(`/hash/${address}`),
          scry<{ grain: { [key: string]: { grain: Grain; location: Location } } }>(`/json/grain/${address}`)
        ])

        console.log('SCRY: ', rawData, grainInfo)
        
        const newGrains = Object.keys(rawData?.hash?.grains || {}).reduce((acc, cur) =>
          acc.concat([{ ...rawData?.hash?.grains[cur][0].grain, id: cur } as any]), [] as Grain[])
        
        setGrains(newGrains)

        if (rawData) {
          const { hash }: HashData = rawData
          const txns = Object.keys(hash.eggs).map(txnHash => ({ ...hash.eggs[txnHash], hash: txnHash }))
          setTransactions(txns)
        }

        setLoading(false)
      } catch (err) {}
    }

    if (mockData) {
      setGrains(mockHolderGrains)
      return setTransactions(mockTransactions)
    }

    getData()
  }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

  const towns: string[] = (display === 'txns' ? transactions.reduce((acc: string[], cur: Grain | Transaction) => {
    if ('town-id' in cur) {
      if (!acc.includes(cur['town-id'])) {
        acc.push(cur['town-id'])
      }
    } else {
      if (!acc.includes(cur.location['town-id'])) {
        acc.push(cur.location['town-id'])
      }
    }
    return acc
  }, []) : grains.reduce((acc: string[], cur: Grain | Transaction) => {
    if ('town-id' in cur) {
      if (!acc.includes(cur['town-id'])) {
        acc.push(cur['town-id'])
      }
    } else {
      if (!acc.includes(cur.location['town-id'])) {
        acc.push(cur.location['town-id'])
      }
    }
    return acc
  }, []))

  const displayTransactions = town === '' ? transactions : transactions.filter(tx => tx.location['town-id'] === town)
  const displayGrains = town === '' ? grains : grains.filter(gr => gr['town-id'] === town)

  return (
    <Container className='address-view'>
      <PageHeader title={isWalletAddress ? 'Address' : 'Contract'}>
        <HexNum mono copy style={{ fontSize: 18 }} num={addHexDots(address)} />
      </PageHeader>
      <Entry>
        <Card>
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
                <select value={town} className='small text' style={{paddingRight: '1em'}} onChange={(e) => setTown(e.target.value)}>
                  <option value={''} key={''}>All</option>
                  {towns.map(t => <option value={t} key={t}>{t}</option>)}
                </select>
              </Row>
            </Row>
          </CardHeader>
          <Col>
            {display === 'txns' ? (
              displayTransactions.length > 0 ? (
                displayTransactions.map((tx, i, arr) => (
                  <TransactionEntry tx={tx} isWalletAddress={isWalletAddress} displayIndex={arr.length - i} key={tx.hash || i} />
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
              displayGrains.length > 0 ? (
                displayGrains.map((grain, i) => (
                  <GrainEntry grain={grain} isWalletAddress={isWalletAddress} key={i} />
                ))
              ) :  grains.length > 0 ? (
                <Text style={{ paddingTop: 16 }}>No assets under this town</Text>
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
