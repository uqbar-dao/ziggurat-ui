import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { FaCaretDown, FaCaretRight } from 'react-icons/fa'

import Card from '../../../components-indexer/card/Card'
import Col from '../../../components-indexer/spacing/Col'
import Container from '../../../components-indexer/spacing/Container'
import Row from '../../../components-indexer/spacing/Row'
import Text from '../../../components-indexer/text/Text'
import useIndexerStore from '../../../stores/indexerStore'
import { Block, RawBlock } from '../../../types/indexer/Block'
import { removeDots } from '../../../utils/format'
import { addDecimalDots } from '../../../utils/number'
import { processRawData } from '../../../utils/object'
import CopyIcon from '../../../components-indexer/card/CopyIcon'
import Link from '../../../components-indexer/nav/Link'
import Entry from '../../../components-indexer/card/Entry'
import { mockData } from '../../../utils/constants'
import { mockBlock } from '../../../mocks/indexer-mocks'

import './BlockView.scss'
import Field from '../../../components-indexer/card/Field'
import Divider from '../../../components-indexer/spacing/Divider'
import PageHeader from '../../../components-indexer/page/PageHeader'

const BlockView = () => {
  const { scry } = useIndexerStore()
  const location = useLocation()
  const [block, setBlock] = useState<Block | undefined>()
  const [expandTransactions, setExpandTransactions] = useState(false)

  useEffect(() => {
    const getData = async () => {
      const params = location.pathname.split('/').slice(2)
      if (params.length < 3) {
        return
      }
      const formattedParams = params.map(addDecimalDots)
      const result = await scry<RawBlock>(`/chunk-num/${formattedParams.join('/')}`)
      console.log('CHUNKS:', result)
      setBlock(processRawData(result))
    }

    if (mockData) {
      return setBlock(mockBlock)
    }

    getData()
  }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!block) {
    return <Text>No block data</Text>
  }

  return (
    <Container className='block-view'>
      <PageHeader title='Block'>
        <Text style={{ fontSize: 18 }}>
          # {block.location.epochNum}-{block.location.blockNum}-{block.location.townId}
        </Text>
        <CopyIcon text={removeDots(`${block.location.epochNum}/${block.location.blockNum}/${block.location.townId}`)} />
      </PageHeader>
      <Card title='Overview'>
        <Entry>
          <Field name='Granary:'>
            <Text>{Object.keys(block.chunk.town.granary).length}</Text>
          </Field>
        </Entry>
        <Entry>
          <Field name='Population:'>
            <Text>{Object.keys(block.chunk.town.populace).length}</Text>
          </Field>
        </Entry>
        <Entry divide={false} className="transactions">
          <Field name='Transactions:'>
            <Col>
              <Row>
                <Text style={{marginRight: '1em'}}>{block.chunk.transactions.length}</Text>
                <Text className='purple pointer' onClick={() => setExpandTransactions(!expandTransactions)}>
                  {expandTransactions ? <FaCaretDown /> : <FaCaretRight />}
                  {expandTransactions ? 'Collapse' : 'Expand'}
                </Text>
              </Row>
              {expandTransactions && 
                <Col style={{marginLeft: '1em'}}>
                  {block.chunk.transactions.map((tx, i) => (
                    <Link href={`/tx/${removeDots(tx.hash)}`} className="transaction" key={tx.hash}>
                      <Text mono oneLine>{i + 1}. {removeDots(tx.hash)}</Text>
                    </Link>
                  ))}
                </Col>
              }
            </Col>
            {/* town: {
              granary: {
                [key: string]: {
                  germ: {
                    data: number
                    isRice: boolean
                    salt: number
                  }
                  holder: string
                  id: string
                  lord: string
                  townId: number
                }
              }
              populace: { [key: string]: number }
            }
            transactions: any[] */}
          </Field>
        </Entry>
      </Card>
    </Container>
  )
}

export default BlockView
