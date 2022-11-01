import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'

import Card from '../../components-indexer/card/Card'
import Col from '../../components/spacing/Col'
import Container from '../../components/spacing/Container'
import Row from '../../components/spacing/Row'
import Text from '../../components/text/Text'
import useIndexerStore from '../../stores/indexerStore'
import { Batch, Batches } from '../../types/indexer/Batch'
import { addHexDots } from '../../utils/format'
import Link from '../../components-indexer/nav/Link'
import Entry from '../../components/spacing/Entry'
import { mockData } from '../../utils/constants'
// import { mockBlock } from '../../mocks/indexer-mocks'
import Field from '../../components/spacing/Field'
import PageHeader from '../../components/page/PageHeader'
import CopyIcon from '../../components/text/CopyIcon'
import HexNum from '../../components/text/HexNum'
import Loader from '../../components/popups/Loader'
import { Transaction } from '../../types/indexer/Transaction'
import { formatIndexerTimestamp } from '../../utils/date'

import './BatchView.scss'

const BatchView = () => {
  const { scry, setLoading, loadingText } = useIndexerStore()
  const location = useLocation()
  const { batchId } = useParams()
  const [batchData, setBatchData] = useState<Batch | undefined>()
  const [expandState, setExpandState] = useState(true)
  const [expandNonces, setExpandNonces] = useState(true)
  const [expandTransactions, setExpandTransactions] = useState(true)

  useEffect(() => {
    const getData = async () => {
      setLoading('Loading batch data...')
      const params = location.pathname.split('/').slice(2)
      if (params.length < 1) {
        return
      }
      const result = await scry<Batches>(`/batch/${batchId}`)
      if (result?.batch) {
        setBatchData({ ...Object.values(result?.batch || {})[0], id: batchId })
      }
      setLoading('')
    }

    if (mockData) {
      // return setBatch(mockBlock)
    }

    getData()
  }, [batchId]) // eslint-disable-line react-hooks/exhaustive-deps

  if (loadingText) {
    return <Col style={{ justifyContent: 'center', marginTop: 60, marginLeft: 60 }}>
      <Loader />
    </Col>
  }

  if (!batchData) {
    return <Text>No batch data</Text>
  }

  const { batch: { town: { chain: { state, nonces } }, transactions } } = batchData

  return (
    <Container className='batch-view'>
      <PageHeader title='Batch'>
        <HexNum style={{ fontSize: 18 }} num={batchData.id} copy />
      </PageHeader>
      <Card title='Overview'>
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
        <Entry divide={false} className="transactions">
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
    </Container>
  )
}

export default BatchView
