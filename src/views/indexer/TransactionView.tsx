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

import './TransactionView.scss'

const TransactionView = () => {
  const { scry } = useIndexerStore()
  const location = useLocation()
  const [transaction, setTransaction] = useState<Transaction | undefined>()
  const [loading, setLoading] = useState(true)

  const splitPath = location.pathname.split('/')
  const txnHash = addHexDots(splitPath[splitPath.length - 1])

  useEffect(() => {
    const getData = async () => {
      // 0x523515b872fce8297919a3e40bfd48dec4d27d9700dd44dd81efc254ef8aa3e6

      const result = await scry<{ txn: { [key: string]: Transaction } }>(`/json/txn/${txnHash}`)

      if (result) {
        setTransaction(Object.values(result.txn)[0])
      }
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

  const { location: loc, txn: { shell, calldata } } = transaction
  console.log('LOCATION:', loc)

  return (
    <Container className='transaction-view'>
      <PageHeader title='Transaction'>
        <HexNum mono copy style={{ fontSize: 18 }} num={addHexDots(txnHash)} />
      </PageHeader>
      <Entry>
        <Card title='Overview'>
          <Entry>
            <Field name='Batch:'>
              <Link href={`/block/${loc['epoch-num']}/${loc['block-num']}/${loc['town-id']}`} className='address'>
                <Text mono oneLine>{loc['epoch-num']}-{loc['block-num']}-{loc['town-id']}</Text>
              </Link>
            </Field>
          </Entry>
          <Entry>
            <Field name='From:'>
              <Link href={`/address/${addHexDots(shell.caller.id)}`} className='address'>
                <HexNum mono num={addHexDots(shell.caller.id)} />
              </Link>
              <CopyIcon iconOnly={true} text={addHexDots(shell.caller.id)} />
            </Field>
            <Field name='To:'>
              <Link href={`/address/${addHexDots(shell.contract)}`} className='address'>
                <HexNum mono num={addHexDots(shell.contract)}/>
              </Link>
              <CopyIcon iconOnly={true} text={addHexDots(shell.contract)} />
            </Field>
          </Entry>
          <Entry>
            <Field name='Status:'>
              <Text mono>{getRawStatus(shell.status)}</Text>
            </Field>
          </Entry>
          <Entry>
            <Field name='Budget:'>
              <Text mono oneLine>{addDecimalDots(shell.budget)}</Text>
            </Field>
          </Entry>
          <Entry>
            <Field name='Caller:'>
              <Link href={`/address/${addHexDots(shell.caller.id)}`} className='address'>
                <HexNum mono num={addHexDots(shell.caller.id)} />
              </Link>
              <CopyIcon iconOnly={true} text={addHexDots(shell.caller.id)} />
            </Field>
          </Entry>
          <Entry>
            <Field name='Action:'>
              <Text mono breakAll>{JSON.stringify(calldata)}</Text>
            </Field>
          </Entry>
        </Card>
      </Entry>
      <Footer />
    </Container>
  )
}

export default TransactionView
