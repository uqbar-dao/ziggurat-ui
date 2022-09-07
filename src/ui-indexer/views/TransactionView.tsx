import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Link from '../../components-indexer/nav/Link'
import Card from '../../components-indexer/card/Card'
import Container from '../../components-indexer/spacing/Container'
import Text from '../../components-indexer/text/Text'
import CopyIcon from '../../components-indexer/card/CopyIcon'
import useExplorerStore from '../store/explorerStore'
import { RawTransaction, Transaction } from '../../types/indexer/Transaction'
import { getStatus, mockData } from '../../utils/constants'
import { removeDots } from '../../utils/format'
import { addHexDots } from '../../utils/number'
import { processRawData } from '../../utils/object'
import Entry from '../../components-indexer/card/Entry'
import Field from '../../components-indexer/card/Field'
import { mockTransaction } from '../../mocks/indexer-mocks'
import Col from '../../components-indexer/spacing/Col'
import PageHeader from '../../components-indexer/page/PageHeader'

import './TransactionView.scss'

const TransactionView = () => {
  const { scry } = useExplorerStore()
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

  alert('This page is pending refactor to match the updated backend.')

  return (
    <Container className='transaction-view'>
      <PageHeader title='Transaction'>
        <Text mono oneLine style={{ fontSize: 18 }}>
          {removeDots(txnHash)}
        </Text>
        <CopyIcon text={removeDots(txnHash)} />
      </PageHeader>
      <Card title='Overview'>
        <Entry>
          <Field name='Block:'>
            <Link href={`/block/${loc.epochNum}/${loc.blockNum}/${loc.townId}`} className='address'>
              <Text mono oneLine>{loc.epochNum}-{loc.blockNum}-{loc.townId}</Text>
            </Link>
          </Field>
        </Entry>
        <Entry>
          <Field name='From:'>
            <Link href={`/address/${removeDots(shell.from.id)}`} className='address'>
              <Text mono oneLine>{removeDots(shell.from.id)}</Text>
            </Link>
            <CopyIcon iconOnly={true} text={removeDots(shell.from.id)} />
          </Field>
          <Field name='To:'>
            <Link href={`/grain/${removeDots(shell.to)}`} className='address'>
              <Text mono oneLine>{removeDots(shell.to)}</Text>
            </Link>
            <CopyIcon iconOnly={true} text={removeDots(shell.to)} />
          </Field>
        </Entry>
        <Entry>
          <Field name='Status:'>
            <Text mono>{getStatus(shell.status)}</Text>
          </Field>
        </Entry>
        <Entry>
          <Field name='Budget:'>
            <Text mono oneLine>{shell.budget}</Text>
          </Field>
        </Entry>
        <Entry>
          <Field name='Caller:'>
            <Link href={`/address/${removeDots(yolk.caller.id)}`} className='address'>
              <Text mono oneLine>{removeDots(yolk.caller.id)}</Text>
            </Link>
            <CopyIcon iconOnly={true} text={removeDots(yolk.caller.id)} />
          </Field>
        </Entry>
        <Entry>
          <Field name='Args:'>
            <Text mono oneLine>{removeDots(JSON.stringify(yolk.args))}</Text>
          </Field>
        </Entry>
        <Entry divide={false}>
          <Field name='Grains:'>
            <Col style={{ maxWidth: 'calc(100% - 60px)' }}>
              {yolk.myGrains.concat(yolk.contGrains).map(grain => (
                // <Link key={grain} href={`/grain/${removeDots(grain)}`} className='address'>
                //   <Text mono oneLine>{removeDots(grain)}</Text>
                // </Link>
                <Text mono oneLine key={grain}>{removeDots(grain)}</Text>
              ))}
            </Col>
          </Field>
        </Entry>
      </Card>
    </Container>
  )
}

export default TransactionView
