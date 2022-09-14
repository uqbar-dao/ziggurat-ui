import React from 'react'
import { useParams } from 'react-router-dom'
import Entry from '../../components/spacing/Entry'
import Field from '../../components/spacing/Field'
import BackLink from '../../components-wallet/nav/BackLink'
import Col from '../../components/spacing/Col'
import Container from '../../components/spacing/Container'
import Text from '../../components/text/Text'
import CopyIcon from '../../components/text/CopyIcon'
import useWalletStore from '../../stores/walletStore'
import { getStatus } from '../../utils/constants'
import { removeDots } from '../../utils/format'
import HexNum from '../../components/text/HexNum'
import Row from '../../components/spacing/Row'

import './TransactionView.scss'

const TransactionView = () => {
  const { hash } = useParams()
  const { transactions } = useWalletStore()
  const txn = transactions.find(t => t.hash === hash)

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
            {/* <Link target='_blank' urlPrefix='/apps/ziggurat/indexer' href={`/tx/${removeDots(txn.hash)}`}> */}
              <HexNum mono copy num={removeDots(txn.hash)} />
            {/* </Link> */}
          </Field>
        </Entry>
        <Entry>
          <Field name='From:'>
            <HexNum mono copy num={ removeDots(txn.from)} />
            </Field>
          <Field name='To:'>
            <HexNum mono copy num={ removeDots(txn.contract)} />
            </Field>
        </Entry>
        <Entry>
          <Field name='Status:'>
            <Text mono>{getStatus(txn.status)}</Text>
            {txn.created && <Text mono style={{ marginLeft:'auto'}}>{txn.created.toDateString()}</Text>}
          </Field>
        </Entry>
        <Entry>
          <Field name='Town:'>
            <HexNum mono copy num={ removeDots(txn.town)} />
            </Field>
        </Entry>
        <Entry>
        <Field name='Nonce:'>
          <Text mono>
            {txn.nonce.toString()}
          </Text> 
          </Field>
        </Entry>
        <Entry>
          <Field name='Rate:'>
            <Text>
              { txn.rate.toString()}
            </Text>
            </Field>
          <Field name='Budget:'>
            <Text>
              { txn.budget.toString()}
            </Text>
            </Field>
        </Entry>
        <Entry>
          <Field name='Action:'>
            <Row className='mb1'>
              <Text mono breakAll>{JSON.stringify(txn.action)}</Text>
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
