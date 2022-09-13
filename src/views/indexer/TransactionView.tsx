import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Link from '../../components-indexer/nav/Link'
import Card from '../../components-indexer/card/Card'
import Container from '../../components/spacing/Container'
import Text from '../../components/text/Text'
import CopyIcon from '../../components/text/CopyIcon'
import useIndexerStore from '../../stores/indexerStore'
import { RawTransaction, Transaction } from '../../types/indexer/Transaction'
import { getRawStatus, mockData } from '../../utils/constants'
import { removeDots } from '../../utils/format'
import { addHexDots } from '../../utils/number'
import { processRawData } from '../../utils/object'
import Entry from '../../components/spacing/Entry'
import Field from '../../components/spacing/Field'
import { mockTransaction } from '../../mocks/indexer-mocks'
import Col from '../../components/spacing/Col'
import PageHeader from '../../components/page/PageHeader'

import './TransactionView.scss'
import Footer from '../../components-indexer/nav/Footer'
import HexNum from '../../components/text/HexNum'

const TransactionView = () => {
  const { scry } = useIndexerStore()
  const location = useLocation()
  const [transaction, setTransaction] = useState<Transaction | undefined>()

  const splitPath = location.pathname.split('/')
  const txnHash = addHexDots(splitPath[splitPath.length - 1])

  useEffect(() => {
    const getData = async () => {
      // 0x523515b872fce8297919a3e40bfd48dec4d27d9700dd44dd81efc254ef8aa3e6
      
      const result = await scry<{ egg: { [key: string]: RawTransaction } }>(`/egg/${txnHash}`)

      if (result) {
        setTransaction(processRawData(Object.values(result.egg)[0]))
      }
    }

    if (mockData) {
      return setTransaction(mockTransaction)
    }

    getData()
  }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!transaction) {
    return <Text>No transaction data</Text>
  }

  const { location: loc, egg: { shell, yolk } } = transaction

  return (
    <Container className='transaction-view'>
      <PageHeader title='Transaction'>
        <HexNum mono copy style={{ fontSize: 18 }} num={removeDots(txnHash)} />
      </PageHeader>
      <Entry>
        <Card title='Overview'>
          <Entry>
            <Field name='Batch:'>
              <Link href={`/block/${loc.epochNum}/${loc.blockNum}/${loc.townId}`} className='address'>
                <Text mono oneLine>{loc.epochNum}-{loc.blockNum}-{loc.townId}</Text>
              </Link>
            </Field>
          </Entry>
          <Entry>
            <Field name='From:'>
              <Link href={`/address/${removeDots(shell.from.id)}`} className='address'>
                <HexNum mono num={removeDots(shell.from.id)} />
              </Link>
              <CopyIcon iconOnly={true} text={removeDots(shell.from.id)} />
            </Field>
            <Field name='To:'>
              <Link href={`/grain/${removeDots(shell.contract)}`} className='address'>
                <HexNum mono num={removeDots(shell.contract)}/>
              </Link>
              <CopyIcon iconOnly={true} text={removeDots(shell.contract)} />
            </Field>
          </Entry>
          <Entry>
            <Field name='Status:'>
              <Text mono>{getRawStatus(shell.status)}</Text>
            </Field>
          </Entry>
          <Entry>
            <Field name='Budget:'>
              <Text mono oneLine>{shell.budget}</Text>
            </Field>
          </Entry>
          <Entry>
            <Field name='Caller:'>
              <Link href={`/address/${removeDots(shell.from.id)}`} className='address'>
                <HexNum mono num={removeDots(shell.from.id)} />
              </Link>
              <CopyIcon iconOnly={true} text={removeDots(shell.from.id)} />
            </Field>
          </Entry>
          <Entry>
            <Field name='Action:'>
              <Text mono>{JSON.stringify(yolk)}</Text>
            </Field>
          </Entry>
        </Card>
      </Entry>
      <Footer />
    </Container>
  )
}

export default TransactionView
