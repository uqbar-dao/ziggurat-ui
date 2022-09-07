import React, { useMemo, useState } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { FaChevronDown, FaChevronUp, FaPen, FaTrash } from 'react-icons/fa';
import Col from '../spacing/Col'
import Row from '../spacing/Row'
import useProjectStore from '../../ui-ziggurat/store/projectStore';
import { TestGrain } from '../../types/ziggurat/TestGrain';
import Button from '../form/Button';
import HexNum from '../text/HexNum'
import Text from '../text/Text'

import './GrainList.scss'
import { METADATA_GRAIN_ID, MY_CONTRACT_ID, ZIGS_ACCOUNT_ID } from '../../utils/constants';
import { displayPubKey } from '../../utils/account';
import Field from '../form/Field';
import Entry from '../form/Entry';

interface GrainValueDisplayProps {
  grain: TestGrain
  grainIndex: number
  editGrain: (grain: TestGrain) => void
  testId?: string
}

export const GrainValueDisplay = ({ grain, grainIndex, editGrain, testId }: GrainValueDisplayProps) => {
  const { deleteGrain } = useProjectStore()
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
          variant='unstyled'
          style={{ marginRight: 8, marginTop: 2, alignSelf: 'flex-start' }}
          iconOnly
          icon={expanded ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
        />
        <Col style={{ wordBreak: 'break-all' }}>
          <HexNum num={grain.id} displayNum={grainIdDisplay} />
        </Col>
        <Row style={{ marginLeft: 'auto'}}>
          {/* {!grain.obsolete && (
            <Button
              onClick={() => editGrain(grain, true)}
              variant='unstyled'
              iconOnly
              icon={<FaCopy size={14} />}
              style={{ marginRight: 8 }}
            />
          )} */}
          {!grain.obsolete && !untouchable && (
            <Button
              onClick={() => editGrain(grain)}
              variant='unstyled'
              iconOnly
              icon={<FaPen size={14} />}
            />
          )}
          {!untouchable && (
            <Button
              onClick={() => { if(window.confirm('Are you sure you want to remove this grain?')) { deleteGrain(grain.id, testId) } }}
              variant='unstyled'
              className='delete'
              style={{ marginLeft: 8 }}
              iconOnly
              icon={<FaTrash size={14} />}
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

interface GrainListProps {
  editGrain: (grain: TestGrain) => void
  grains: TestGrain[]
  testId?: string
}

export const GrainList = ({ grains, editGrain, testId }: GrainListProps) =>
  <Droppable droppableId='grains' style={{ width: '100%', height: '100%' }}>
    {(provided: any) => (
      <Col className='grains' {...provided.droppableProps} innerRef={provided.innerRef} style={{ ...provided.droppableProps.style,  width: '100%', overflow: 'scroll' }}>
        {grains.map((grain, i) => (
          <GrainValueDisplay key={grain.id} grain={grain} grainIndex={i} editGrain={editGrain} testId={testId} />
        ))}
        {provided.placeholder}
      </Col>
    )}
  </Droppable>
