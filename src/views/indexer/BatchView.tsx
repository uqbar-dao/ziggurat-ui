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
import HexNum from '../../components/text/HexNum'
import Loader from '../../components/popups/Loader'
import { Transaction } from '../../types/indexer/Transaction'
import { formatIndexerTimestamp } from '../../utils/date'
import BatchCard from '../../components-indexer/indexer/BatchCard'

import './BatchView.scss'

const BatchView = () => {
  const { scry, setLoading, loadingText } = useIndexerStore()
  const location = useLocation()
  const { batchId, townId } = useParams()
  const [batchData, setBatchData] = useState<Batch | undefined>()
 
  useEffect(() => {
    const getData = async () => {
      setLoading('Loading batch data...')
      const params = location.pathname.split('/').slice(2)
      // console.log({ params, batchId, townId })
      if (params.length < 1) {
        return
      }
      const result = await scry<Batches>(`/batch/${batchId}`)
      console.log(result)
      if (result?.batch) {
        setBatchData({ ...Object.values(result?.batch || {})[0], id: batchId })
      }
      else {
        setBatchData(undefined)
      }
      setLoading('')
    }

    if (mockData) {
      // return setBatch(mockBlock)
    }

    getData()
  }, [batchId]) // eslint-disable-line react-hooks/exhaustive-deps

  if (loadingText) {
    return <Col center style={{ marginTop: 60, marginLeft: 60 }}>
      <Loader />
    </Col>
  }

  if (!batchData) {
    return <Text>No batch data</Text>
  }

  return (
    <Container className='batch-view'>
      <PageHeader title='Batch'>
        <HexNum style={{ fontSize: 18 }} num={batchData.id} copy />
        <HexNum num={batchData.location['town-id']} 
                displayNum={'Town: ' + batchData.location['town-id']} 
                copy copyText={batchData.location['town-id']} />
      </PageHeader>
      <BatchCard batchData={batchData} />
    </Container>
  )
}

export default BatchView
