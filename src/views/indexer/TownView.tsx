import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Col from "../../components/spacing/Col"
import useIndexerStore from "../../stores/indexerStore"
import Text from '../../components/text/Text'
import BatchView from "./BatchView"
import { Batch, Batches } from "../../types/indexer/Batch"
import BatchCard from "../../components-indexer/indexer/BatchCard"
import Container from "../../components/spacing/Container"
import PageHeader from "../../components/page/PageHeader"
import HexNum from "../../components/text/HexNum"

const TownView = () => {
  const { scry, setLoading, loadingText } = useIndexerStore()
  const { townId } = useParams()
  const [batches, setBatches] = useState<Batch[]>([])

  useEffect(() => {
    const getData = async () => {
      const result = await scry<Batches>(`/town/${townId}`)
      
      if (result?.batch) {
        const bees = Object.entries(result.batch).map(([hash, b]) => ({ id: hash, ...b }))
        setBatches(bees.sort((a, b) => a.timestamp > b.timestamp ? -1 : 1))
      }
    }

    getData()
  }, [townId])


  return (<Container>
    <PageHeader title='Town'> <HexNum num={townId!} /> </PageHeader>
    <Col>
      {(batches.length == 0) ? <Text>Loading...</Text>
      : batches.map((batch, i) => <BatchCard showHash key={i} batchData={batch} />)}
    </Col>
  </Container>)
}

export default TownView