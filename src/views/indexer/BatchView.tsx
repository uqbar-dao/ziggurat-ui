import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { FaCaretDown, FaCaretRight } from 'react-icons/fa'

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
import { formatIndexerTimestamp } from '../../utils/date'

import './BatchView.scss'

const BatchView = () => {
  const { scry } = useIndexerStore()
  const location = useLocation()
  const { batchId } = useParams()
  const [batch, setBatch] = useState<Batch | undefined>()
  const [loading, setLoading] = useState(false)
  const [expandGranary, setExpandGranary] = useState(false)
  const [expandPopulace, setExpandPopulace] = useState(false)
  const [expandTransactions, setExpandTransactions] = useState(false)

  useEffect(() => {
    const getData = async () => {
      setLoading(true)
      const params = location.pathname.split('/').slice(2)
      if (params.length < 1) {
        return
      }
      const result = await scry<Batches>(`/batch/${batchId}`)
      if (result?.batch) {
        setBatch({ ...Object.values(result?.batch || {})[0], id: batchId })
      }
      setLoading(false)
    }

    if (mockData) {
      // return setBatch(mockBlock)
    }

    getData()
  }, [batchId]) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return <Col style={{ justifyContent: 'center', marginTop: 60, marginLeft: 60 }}>
      <Loader />
    </Col>
  }

  if (!batch) {
    return <Text>No batch data</Text>
  }

  return (
    <Container className='batch-view'>
      <PageHeader title='Batch'>
        <Text mono style={{ fontSize: 18 }}>{batch.id}</Text>
        <CopyIcon text={addHexDots(batch.id)} />
      </PageHeader>
      <Card title='Overview'>
        <Entry>
          <Field name='Timestamp:'>
            <Text>{formatIndexerTimestamp(batch.timestamp)}</Text>
          </Field>
        </Entry>
        <Entry>
          <Field name={`Granary: (${Object.keys(batch.batch.town.chain.state).length})`}>
            <Col>
              <Row className='purple pointer' onClick={() => setExpandGranary(!expandGranary)}>
                {expandGranary ? <FaCaretDown /> : <FaCaretRight />}
                <Text>{expandGranary ? 'Collapse' : 'Expand'}</Text>
              </Row>
              {expandGranary &&
                <Col className='expanded-details'>
                  {Object.keys(batch.batch.town.chain.state).map(grainId => (
                    <Col className="transaction">
                      <Link href={`/grain/${addHexDots(grainId || '')}`} key={grainId}>
                        <HexNum num={grainId} />
                      </Link>
                    </Col>
                  ))}
                </Col>
              }
            </Col>
          </Field>
        </Entry>
        <Entry>
          <Field name={`Populace: (${Object.keys(batch.batch.town.chain.nonces).length})`}>
            <Col>
              <Row className='purple pointer' onClick={() => setExpandPopulace(!expandPopulace)}>
                {expandPopulace ? <FaCaretDown /> : <FaCaretRight />}
                <Text>{expandPopulace ? 'Collapse' : 'Expand'}</Text>
              </Row>
              {expandPopulace &&
                <Col className='expanded-details'>
                  {Object.keys(batch.batch.town.chain.nonces).map(userAddress => (
                    <Col className="transaction">
                      <Link href={`/address/${addHexDots(userAddress || '')}`} className="transaction" key={userAddress}>
                        <HexNum num={userAddress} />
                      </Link>
                    </Col>
                  ))}
                </Col>
              }
            </Col>
          </Field>
        </Entry>
        <Entry divide={false} className="transactions">
          <Field name={`Transactions: (${batch.batch.transactions.length})`}>
            <Col>
              <Row className='purple pointer' onClick={() => setExpandTransactions(!expandTransactions)}>
                {expandTransactions ? <FaCaretDown /> : <FaCaretRight />}
                <Text>{expandTransactions ? 'Collapse' : 'Expand'}</Text>
              </Row>
              {expandTransactions &&
                <Col className='expanded-details'>
                  {batch.batch.transactions.map((tx, i) => (
                    <Col className="transaction">
                      <Link href={`/tx/${addHexDots(tx.hash || '')}`} className="transaction" key={tx.hash}>
                        <Text mono oneLine>{i + 1}. {addHexDots(tx.hash || '')}</Text>
                      </Link>
                    </Col>
                  ))}
                </Col>
              }
            </Col>
          </Field>
        </Entry>
      </Card>
    </Container>
  )
}

export default BatchView
