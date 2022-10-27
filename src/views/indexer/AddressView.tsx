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
import { mockHolderItems, mockTransactions } from '../../mocks/indexer-mocks'
import { Item } from '../../types/indexer/Item'
import { Location } from '../../types/indexer/Location'
import { HashData } from '../../types/indexer/HashData'
import { ADDRESS_REGEX, ETH_ADDRESS_REGEX } from '../../utils/regex'
import { TransactionEntry } from '../../components-indexer/indexer/Transaction'
import { ItemEntry } from '../../components-indexer/indexer/Item'
import PageHeader from '../../components/page/PageHeader'
import Footer from '../../components-indexer/nav/Footer'
import CardHeader from '../../components-indexer/card/CardHeader'
import Entry from '../../components/spacing/Entry'
import HexNum from '../../components/text/HexNum'
import Loader from '../../components/popups/Loader'

import './AddressView.scss'

type Selection = 'txns' | 'items'

const AddressView = () => {
  const { scry } = useIndexerStore()
  const location = useLocation()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [display, setDisplay] = useState<Selection>('txns')
  const [town, setTown] = useState<string>('')
  const [loading, setLoading] = useState(true)

  const splitPath = location.pathname.split('/')
  const address = addHexDots(splitPath[splitPath.length - 1])
  const isWalletAddress = ADDRESS_REGEX.test(removeDots(address)) || ETH_ADDRESS_REGEX.test(removeDots(address))

  useEffect(() => {
    const getData = async () => {
      try {
        const [rawData, itemInfo] = await Promise.all([
          scry<HashData>(`/hash/${address}`),
          scry<{ item: { [key: string]: { item: Item; location: Location } } }>(`/json/item/${address}`)
        ])

        console.log('SCRY: ', rawData, itemInfo)

        const newItems = Object.keys(rawData?.hash?.items || {}).reduce((acc, cur) =>
          acc.concat([{ ...rawData?.hash?.items[cur][0].item, id: cur } as any]), [] as Item[])

        setItems(newItems)

        if (rawData) {
          const { hash }: HashData = rawData
          const txns = Object.keys(hash.txns).map(txnHash => ({ ...hash.txns[txnHash], hash: txnHash }))
          setTransactions(txns)
        }

        setLoading(false)
      } catch (err) {}
    }

    if (mockData) {
      setItems(mockHolderItems)
      return setTransactions(mockTransactions)
    }

    getData()
  }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

  const towns: string[] = (display === 'txns' ? transactions.reduce((acc: string[], cur: Transaction) => {
    if (!acc.includes(cur.location['town-id'])) {
      acc.push(cur.location['town-id'])
    }
    return acc
  }, []) : items.reduce((acc: string[], cur: Item) => {
    if (!acc.includes(cur.town)) {
      acc.push(cur.town)
    }
    return acc
  }, []))

  const displayTransactions = town === '' ? transactions : transactions.filter(tx => tx.location['town-id'] === town)
  const displayItems = town === '' ? items : items.filter(gr => gr.town === town)

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
                <Text onClick={() => setDisplay('items')} className={`selector ${display === 'items' && 'selected'}`}>
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
              displayItems.length > 0 ? (
                displayItems.map((item, i) => (
                  <ItemEntry item={item} isWalletAddress={isWalletAddress} key={i} />
                ))
              ) :  items.length > 0 ? (
                <Text style={{ marginTop: 16 }}>No assets under this town</Text>
              ) : (
                <Text style={{ marginTop: 16 }}>No assets</Text>
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
