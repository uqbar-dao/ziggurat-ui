import React, { useMemo, useState } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { FaChevronRight, FaChevronDown, FaPen, FaTrash, FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import Col from '../../components/spacing/Col'
import Row from '../../components/spacing/Row'
import useZigguratStore from '../../stores/zigguratStore';
import { TestGrain } from '../../types/ziggurat/TestGrain';
import Button from '../../components/form/Button';
import HexNum from '../../components/text/HexNum'
import Text from '../../components/text/Text'

import './GrainList.scss'
import { METADATA_GRAIN_ID, MY_CONTRACT_ID, ZIGS_ACCOUNT_ID } from '../../utils/constants';
import { displayPubKey } from '../../utils/account';
import Field from '../../components/spacing/Field';
import Entry from '../../components/spacing/Entry';


interface GrainValueDisplayProps {
  grain: TestGrain
  grainIndex: number
  editGrain: (grain: TestGrain) => void
  testId?: string
}

export const GrainValueDisplay = ({ grain, grainIndex, editGrain, testId }: GrainValueDisplayProps) => {
  const { deleteGrain } = useZigguratStore()
  const [expanded, setExpanded] = useState(false)

  const grainStyle = {
    background: grain.obsolete ? 'rgba(0,0,0,0.05)' : 'white',
  }

  const isZigsGrain = grain.id === ZIGS_ACCOUNT_ID
  const isContractGrain = grain.id === MY_CONTRACT_ID
  const isMetadataGrain = grain.id === METADATA_GRAIN_ID
  const untouchable = isZigsGrain || isContractGrain || isMetadataGrain

  const grainIdDisplay = expanded ? grain.id :
    isZigsGrain ? `${displayPubKey(grain.id)} - zigs account` :
    isContractGrain ? `${displayPubKey(grain.id)} - contract grain` :
    isMetadataGrain ? `${displayPubKey(grain.id)} - metadata grain` :
    displayPubKey(grain.id)

  const grainContent = (
    <>
      <Row style={{ ...grainStyle, width: '100%' }}>
        <Button
          onClick={() => setExpanded(!expanded)}
          variant='unstyled' expander
          iconOnly
          icon={expanded ? <FaChevronDown size={16} /> : <FaChevronRight size={16} />}
        />
        <HexNum num={grain.id} displayNum={grainIdDisplay} />
        <Row style={{ marginLeft: 'auto'}}>
          {!grain.obsolete && !untouchable && (
            <Button
              onClick={() => editGrain(grain)}
              small iconOnly
              icon={<FaRegEdit size={14} />}
            />
          )}
          {!untouchable && (
            <Button
              onClick={() => { if(window.confirm('Are you sure you want to remove this grain?')) { deleteGrain(grain.id, testId) } }}
              small className='delete'
              style={{ marginLeft: 8 }}
              iconOnly
              icon={<FaRegTrashAlt size={14} />}
            />
          )}
        </Row>
      </Row>
      {expanded && <Entry>
        <Field name='Holder'> {grain.holder}</Field>
        <Field name='Lord'> {grain.lord}</Field>
        <Field name='Town'> {grain.town_id}</Field>
        <Field name='Label'> {grain.label}</Field>
        <Field name='Data'>
          <Text breakWord>
            {grain.data_text || grain.data}
          </Text>
        </Field>
      </Entry>}
    </>
  )

  return (
    <Draggable draggableId={grain.id} index={grainIndex} isDragDisabled/*={Boolean(grain.obsolete)}*/>
      {(provided: any, snapshot: any) => (
        <>
          <Col key={grain.id} className='grain' innerRef={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
            {grainContent}
          </Col>
          {snapshot.isDragging && snapshot.draggingOver !== 'grains' && <Col className='grain'>{grainContent}</Col>}
        </>
      )}
    </Draggable>
  )
}