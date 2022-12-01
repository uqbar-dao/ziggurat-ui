import Col from "../../components/spacing/Col"
import Entry from "../../components/spacing/Entry"
import Row from "../../components/spacing/Row"
import HexNum from "../../components/text/HexNum"
import Card from "../card/Card"
import { Batch } from '../../types/indexer/Batch'
import { Transaction } from "../../types/indexer/Transaction"
import Field from "../../components/spacing/Field"
import Text from '../../components/text/Text'
import React, { useState } from "react"
import { formatIndexerTimestamp } from "../../utils/date"
import { addHexDots } from "../../utils/format"
import Link from '../nav/Link'
import CardHeader from "../card/CardHeader"
import './BatchCard.scss'

export interface BatchCardProps {
  batchData: Batch
  showHash?: boolean
}

const BatchCard = ({ batchData, showHash } : BatchCardProps) => {
  const [expandState, setExpandState] = useState(true)
  const [expandNonces, setExpandNonces] = useState(true)
  const [expandTransactions, setExpandTransactions] = useState(true)
  
  if (!batchData) return <></>
  
  const { batch: { town: { chain: { state, nonces } }, transactions } } = batchData
  
  return (<Entry className="batch-card">
    <Card title={showHash ? undefined : 'Overview'}>
      {showHash && <CardHeader> <Text bold>Batch:</Text> <HexNum num={batchData.id} /> </CardHeader>}
      <Entry>
        <Field name='Timestamp:'>
          <Text>{formatIndexerTimestamp(batchData.timestamp)}</Text>
        </Field>
      </Entry>
      <Entry>
        <Field name={`State:`}>
          <Text mr1>
            {Object.keys(state).length} items
            <a className='ml1 purple pointer' onClick={() => setExpandState(!expandState)}>{expandState? 'hide' : 'show'}</a>
          </Text>
        </Field>
        {expandState && <Row>
            <Col className='expanded-details'>
              {Object.keys(state).map(itemId => (
                <Col className="state" key={itemId}>
                  <Link href={`/item/${addHexDots(itemId || '')}`} key={itemId}>
                    <HexNum num={itemId} />
                  </Link>
                </Col>
              ))}
            </Col>
        </Row>}
      </Entry>
      <Entry>
        <Field name={`Nonces:`}>
          <Text>{Object.keys(nonces).length}</Text>
          {Object.keys(nonces).length ?
            <a className='ml1 purple pointer' onClick={() => setExpandNonces(!expandNonces)}>{expandNonces? 'hide' : 'show'}</a>
          : <></>}
        </Field>
        {expandNonces && <Row>
          <Col className='expanded-details'>
            {Object.keys(nonces).map((userAddress) => (
              <Link href={`/address/${addHexDots(userAddress || '')}`} className="nonce" key={userAddress}>
                <HexNum num={userAddress} />
              </Link>
            ))}
          </Col>
        </Row>}
      </Entry>
      <Entry>
        <Field name={`Transactions:`}>
          <Text>{transactions.length}</Text>
          {transactions.length > 0 ?
            <a className='ml1 purple pointer' onClick={() => setExpandTransactions(!expandTransactions)}>{expandTransactions? 'hide' : 'show'}</a>
          : <></>}
        </Field>
        {expandTransactions && <Row>
          <Col className='expanded-details'>
            {transactions.map((tx: Transaction, i) => (
              <Link href={`/tx/${addHexDots(tx.hash || '')}`} className="transaction" key={tx.hash}>
                <HexNum displayNum={addHexDots(tx.hash || '')} num={tx.hash} />
              </Link>
            ))}
          </Col>
        </Row>}
      </Entry>
    </Card>
  </Entry>)
}

export default BatchCard