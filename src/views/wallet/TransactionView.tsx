import React from 'react'
import { useParams } from 'react-router-dom'
import { useWalletStore } from '@uqbar/wallet-ui'
import Entry from '../../components/spacing/Entry'
import Field from '../../components/spacing/Field'
import BackLink from '../../components-wallet/BackLink'
import Col from '../../components/spacing/Col'
import Container from '../../components/spacing/Container'
import Text from '../../components/text/Text'
import CopyIcon from '../../components/text/CopyIcon'
import { getRawStatus, getStatus } from '../../utils/constants'
import { addHexDots, removeDots } from '../../utils/format'
import HexNum from '../../components/text/HexNum'
import Row from '../../components/spacing/Row'

import './TransactionView.scss'
import Json from '../../components/text/Json'
import Link from '../../components-indexer/nav/Link'

type ActionValue = { [key: string]: ActionValue } | string | number

interface ActionDisplayProps {
  action: ActionValue
  indent?: number
}

const ActionDisplay = ({ action, indent = 0 }: ActionDisplayProps) => {
  if (typeof action === 'string' || typeof action === 'number') {
    return <Text mono breakAll>{action}</Text>
  }

  return (
    <>
      {Object.keys(action).map(key => (
        typeof action[key] === 'string' || typeof action[key] === 'number' ?
        <Row style={{ marginLeft: indent * 16, alignItems: 'flex-start' }}>
          <Text mono style={{ marginRight: 8 }}>{key}:</Text>
          <ActionDisplay action={action[key]} />
        </Row> :
        <Col style={{ marginLeft: indent * 16 }}>
          <Text mono style={{ marginRight: 8 }}>{key}:</Text>
          <ActionDisplay action={action[key]} indent={indent + 1} />
        </Col>
      ))}
    </>
  )
}

const TransactionView = () => {
  const { hash } = useParams()
  const { unsignedTransactions, transactions } = useWalletStore()
  const txn = [...transactions, ...Object.values(unsignedTransactions)].find(t => t.hash === hash)

  if (!txn) {
    return (
      <Container className='transaction-view'>
        <h3>Transaction not found</h3>
        <BackLink />
      </Container>
    )
  }

  return (
    <Container className='transaction-view'>
      <h2>Transaction</h2>
      <Col className='transaction'>
        <Entry>
          <Field name='Hash:'>
            <Link external newTab href={`/apps/ziggurat/indexer/tx/${removeDots(txn.hash)}`}>
              <HexNum mono num={addHexDots(txn.hash)} />
            </Link>
            <CopyIcon text={addHexDots(txn.hash)} />
          </Field>
        </Entry>
        <Entry>
          <Field name='From:'>
            <Link external newTab href={`/apps/ziggurat/indexer/address/${removeDots(txn.hash)}`}>
              <HexNum mono num={ addHexDots(txn.from)} />
            </Link>
            <CopyIcon text={addHexDots(txn.from)} />
          </Field>
          <Field name='To:'>
            <Link external newTab href={`/apps/ziggurat/indexer/address/${removeDots(txn.hash)}`}>
              <HexNum mono num={ addHexDots(txn.contract)} />
            </Link>
            <CopyIcon text={addHexDots(txn.contract)} />
          </Field>
        </Entry>
        <Entry>
          <Field name='Status:'>
            <Text mono>
              {getStatus(txn.status)}
              {' '}
              {txn.created ? 
                `(${(typeof txn.created === 'string') ?
                  txn.created
                  : txn.created.toDateString()})` 
                : ''}
            </Text>
          </Field>
        </Entry>
        <Entry>
          <Field name='Town:'>
            <HexNum mono copy num={addHexDots(txn.town)} />
            </Field>
        </Entry>
        <Entry>
        <Field name='Nonce:'>
          <Text mono>{txn.nonce}</Text> 
          </Field>
        </Entry>
        <Entry>
          <Field name='Rate:'>
            <Text>{txn.rate}</Text>
          </Field>
          <Field name='Budget:'>
            <Text>{txn.budget}</Text>
          </Field>
          {txn.output && <Field name='Gas:'>
            <Text>{txn.output.gas}</Text>
          </Field>}
          {txn.output && <Field name='Error Code:'>
            <Text>{txn.output.errorcode}</Text>
          </Field>}
        </Entry>
        <Entry>
          <Field name='Action:'>
            <Row className='mb1'>
              <Json json={txn.action}/>
              <CopyIcon text={JSON.stringify(txn.action)} />
            </Row>
          </Field>
        </Entry>
      </Col>
      <BackLink/> 
    </Container>
  )
}

export default TransactionView
