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
import { Item } from '../../types/indexer/Item'
import { Location } from '../../types/indexer/Location'
import { HashData } from '../../types/indexer/HashData'
import { TransactionEntry } from '../../components-indexer/indexer/Transaction'
import PageHeader from '../../components/page/PageHeader'
import Footer from '../../components-indexer/nav/Footer'
import Entry from '../../components/spacing/Entry'
import Loader from '../../components/popups/Loader'
import Field from '../../components/spacing/Field'
import Link from '../../components-indexer/nav/Link'

import './ItemView.scss'

type Selection = 'details' | 'txns'

const ItemView = () => {
  const { metadata, scry } = useIndexerStore()
  const location = useLocation()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [item, setItem] = useState<Item | undefined>(undefined)
  const [display, setDisplay] = useState<Selection>('details')
  const [itemIsData, setItemIsData] = useState(false)
  const [loading, setLoading] = useState(true)
  const tokenMetadata = Object.values(metadata).find(({ data }) => data.salt === item?.salt)

  const splitPath = location.pathname.split('/')
  const itemId = addHexDots(splitPath[splitPath.length - 1])

  useEffect(() => {
    const getData = async () => {
      try {
        const [rawData, itemInfo] = await Promise.all([
          scry<HashData>(`/hash/${itemId}`),
          //  scry<any>(`/item-txns/${itemId}`),
          scry<{ item: { [key: string]: { item: Item; location: Location, timestamp: number }[] } }>(`/item/${itemId}`)
        ])

        console.log(itemInfo)

        try {
          const itemIsData = Boolean(
            Object.values(itemInfo?.item || {})[0][0]?.item?.['is-data']
          )
          setItemIsData(itemIsData)
          setItem(Object.values(itemInfo?.item || {})[0][0]?.item)
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
      // setItem(mockHolderItems[0])
      return setTransactions(mockTransactions)
    }

    getData()
  }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

  console.log('ITEM:', item)

  return (
    <Container className='item-view'>
      <PageHeader title={'Item'}>
        <Text mono oneLine style={{ fontSize: 18 }}>
          {addHexDots(itemId)}
        </Text>
        <CopyIcon text={addHexDots(itemId)} />
      </PageHeader>
      <Entry>
        <Card>
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
                  item && (
                    <Entry divide className='indexer-item' key={item.id}>
                      {Boolean(tokenMetadata) && (
                        <Field name='Token:'>
                          <Text mono oneLine>{tokenMetadata?.data?.symbol}</Text>
                          <CopyIcon text={tokenMetadata?.data?.symbol!}></CopyIcon>
                        </Field>
                      )}
                      <Field name='Source:'>
                        <Link href={`/address/${addHexDots(item.source)}`}>
                          <Text mono oneLine>{addHexDots(item.source)}</Text>
                        </Link>
                        <CopyIcon text={addHexDots(item.source)}></CopyIcon>
                      </Field>
                      <Field name='Holder:'>
                        <Link href={`/address/${addHexDots(item.holder)}`}>
                          <Text mono oneLine>{addHexDots(item.holder)}</Text>
                        </Link>
                        <CopyIcon text={addHexDots(item.holder)}></CopyIcon>
                      </Field>
                      <Field name='Is Data:'>
                        <Text mono oneLine>{String(itemIsData)}</Text>
                      </Field>
                      {itemIsData ? <>
                        <Field name='Label:'>
                          <Text mono oneLine>{item.label}</Text>
                        </Field>
                        <Field name='Salt:'>
                          <Text mono oneLine>{item.salt}</Text>
                          <CopyIcon text={String(item.salt)}></CopyIcon>
                        </Field>
                        <Field name='Noun:'>
                          <Text mono>{JSON.stringify(item.noun)}</Text>
                          <CopyIcon text={JSON.stringify(item.noun)}></CopyIcon>
                        </Field>
                      </> : <>
                        <Field name='Mold:'>
                          <Text mono>{JSON.stringify(item.interface)}</Text>
                          <CopyIcon text={JSON.stringify(item.interface)}></CopyIcon>
                        </Field>
                      </>}
                      <Field name='Town:'>
                        <Text mono oneLine>{item.town}</Text>
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

export default ItemView
