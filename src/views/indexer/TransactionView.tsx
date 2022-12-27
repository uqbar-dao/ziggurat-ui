import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Link from '../../components-indexer/nav/Link'
import Card from '../../components-indexer/card/Card'
import Container from '../../components/spacing/Container'
import Text from '../../components/text/Text'
import CopyIcon from '../../components/text/CopyIcon'
import useIndexerStore from '../../stores/indexerStore'
import { Transaction } from '../../types/indexer/Transaction'
import { getRawStatus, mockData } from '../../utils/constants'
import { addDecimalDots, addHexDots } from '../../utils/format'
import Entry from '../../components/spacing/Entry'
import Field from '../../components/spacing/Field'
// import { mockTransaction } from '../../mocks/indexer-mocks'
import PageHeader from '../../components/page/PageHeader'
import Footer from '../../components-indexer/nav/Footer'
import HexNum from '../../components/text/HexNum'
import Loader from '../../components/popups/Loader'
import Json from '../../components/text/Json'
import { Item } from '../../types/indexer/Item'

import './TransactionView.scss'
import Row from '../../components/spacing/Row'
import useDocumentTitle from '../../hooks/useDocumentTitle'

const TransactionView = () => {
  const { scry, indexerTitleBase } = useIndexerStore()
  const location = useLocation()
  const [transaction, setTransaction] = useState<Transaction | undefined>()
  const [loading, setLoading] = useState(true)

  const splitPath = location.pathname.split('/')
  const txnHash = addHexDots(splitPath[splitPath.length - 1])
  useDocumentTitle(`${indexerTitleBase} Transaction ${addHexDots(txnHash)}`)

  useEffect(() => {
    const getData = async () => {
      const result  = await scry<{ transaction: { [key: string]: Transaction } }>(`/json/transaction/${txnHash}`)

      if (result && result.transaction && Object.values(result.transaction)[0]) {
        setTransaction(Object.values(result.transaction)[0])
      } else {
        alert('There was an error loading the transaction.')
      }
      console.log(result)
      setLoading(false)
    }

    if (mockData) {
      // return setTransaction(mockTransaction)
    }

    getData()
  }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!transaction) {
    return loading ? <Loader dark style={{ marginTop: 16 }}/> :
      <Text>No transaction data</Text>
  }

  const { 
    output: { modified, burned, events, errorcode, gas }, 
    location: loc, 
    transaction: { shell, calldata } 
  } = transaction
  // console.log('LOCATION:', loc)

  const perItems = (items: [string, Item][]) => (
    <Entry className='p0'>
      {items.length ? 
        items.map(([address, item], i) => (
          <Entry className='p0 mb1' key={address}>
            <Row>
              <Link href={`/address/${address}`}>
                <HexNum num={address} />
              </Link>
              <CopyIcon iconOnly text={address} />
            </Row>
            <Json json={item} />
          </Entry>
        ))
      : <Text mb1>None</Text>}
    </Entry>
  )

  return (
    <Container className='transaction-view'>
      <PageHeader title='Transaction'>
        <HexNum mono copy style={{ fontSize: 18 }} num={addHexDots(txnHash)} />
      </PageHeader>
      <Entry>
        <Card title='Overview'>
          <Entry>
            <Field name='Batch:'>
              <Link href={`/batch/${loc['batch-id']}`} className='address'>
                <HexNum num={''+loc['batch-id']} />
              </Link>
              <CopyIcon text={''+loc['batch-id']} />
            </Field>

            <Field name='From:'>
              <Link href={`/address/${addHexDots(shell.caller.id)}`} className='address'>
                <HexNum mono num={addHexDots(shell.caller.id)} />
              </Link>
              <CopyIcon iconOnly text={addHexDots(shell.caller.id)} />
            </Field>

            <Field name='To:'>
              <Link href={`/address/${addHexDots(shell.contract)}`} className='address'>
                <HexNum mono num={addHexDots(shell.contract)}/>
              </Link>
              <CopyIcon iconOnly text={addHexDots(shell.contract)} />
            </Field>

            <Field name='Status:'>
              <Text mono>{getRawStatus(shell.status)}</Text>
            </Field>

            <Field name='Gas:'>
              <Text mono oneLine>{gas}</Text>
            </Field>

            <Field name='Budget:'>
              <Text mono oneLine>{shell.budget}</Text>
            </Field>

            <Field name='Caller:'>
              <Link href={`/address/${addHexDots(shell.caller.id)}`} className='address'>
                <HexNum mono num={addHexDots(shell.caller.id)} />
              </Link>
              <CopyIcon iconOnly text={addHexDots(shell.caller.id)} />
            </Field>

            <Field name='Action:'>
              <Json json={calldata} />
            </Field>

            <Field name='Output:'>
              <Entry className='p0'>
                <Field name='Modified:'>
                  {perItems(Object.entries(modified))}
                </Field>
                <Field name='Burned:'>
                  {perItems(Object.entries(burned))}
                </Field>
                <Field name='Events:'><Json json={events} /></Field>
              </Entry>
            </Field>
          </Entry>
        </Card>
      </Entry>
      <Footer />
    </Container>
  )
}

export default TransactionView
