import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { FaCaretDown, FaCaretRight } from 'react-icons/fa'
import moment from 'moment'

import Card from '../../components-indexer/card/Card'
import Col from '../../components/spacing/Col'
import Container from '../../components/spacing/Container'
import Row from '../../components/spacing/Row'
import Text from '../../components/text/Text'
import useIndexerStore from '../../stores/indexerStore'
import { Batch, Batches } from '../../types/indexer/Batch'
import { removeDots } from '../../utils/format'
import Link from '../../components-indexer/nav/Link'
import Entry from '../../components/spacing/Entry'
import { mockData } from '../../utils/constants'
// import { mockBlock } from '../../mocks/indexer-mocks'
import Field from '../../components/spacing/Field'
import PageHeader from '../../components/page/PageHeader'
import CopyIcon from '../../components/text/CopyIcon'

import './BatchView.scss'
import HexNum from '../../components/text/HexNum'
import Loader from '../../components/popups/Loader'

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
        <CopyIcon text={removeDots(batch.id)} />
      </PageHeader>
      <Card title='Overview'>
        <Entry>
          <Field name='Timestamp:'>
            <Text>{moment(batch.timestamp).format('YYYY-MM-DD hh:mm')}</Text>
          </Field>
        </Entry>
        <Entry>
          <Field name={`Granary: (${Object.keys(batch.batch.town.land.granary).length})`}>
            <Col>
              <Row className='purple pointer' onClick={() => setExpandGranary(!expandGranary)}>
                {expandGranary ? <FaCaretDown /> : <FaCaretRight />}
                <Text>{expandGranary ? 'Collapse' : 'Expand'}</Text>
              </Row>
              {expandGranary && 
                <Col style={{marginLeft: '1em'}}>
                  {Object.keys(batch.batch.town.land.granary).map(grainId => (
                    <Link href={`/grain/${removeDots(grainId || '')}`} className="transaction" key={grainId}>
                      <HexNum num={grainId} />
                    </Link>
                  ))}
                </Col>
              }
            </Col>
          </Field>
        </Entry>
        <Entry>
          <Field name={`Populace: (${Object.keys(batch.batch.town.land.populace).length})`}>
            <Col>
              <Row className='purple pointer' onClick={() => setExpandPopulace(!expandPopulace)}>
                {expandPopulace ? <FaCaretDown /> : <FaCaretRight />}
                <Text>{expandPopulace ? 'Collapse' : 'Expand'}</Text>
              </Row>
              {expandPopulace && 
                <Col style={{marginLeft: '1em'}}>
                  {Object.keys(batch.batch.town.land.populace).map(userAddress => (
                    <Link href={`/address/${removeDots(userAddress || '')}`} className="transaction" key={userAddress}>
                      <HexNum num={userAddress} />
                    </Link>
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
                <Col style={{marginLeft: '1em'}}>
                  {batch.batch.transactions.map((tx, i) => (
                    <Link href={`/tx/${removeDots(tx.hash || '')}`} className="transaction" key={tx.hash}>
                      <Text mono oneLine>{i + 1}. {removeDots(tx.hash || '')}</Text>
                    </Link>
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
