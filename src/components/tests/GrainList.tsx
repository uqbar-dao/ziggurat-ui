import React, { useMemo, useState } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { FaChevronDown, FaChevronUp, FaPen, FaTrash } from 'react-icons/fa';
import Col from '../spacing/Col'
import Row from '../spacing/Row'
import useContractStore from '../../store/contractStore';
import { TestGrain } from '../../types/TestGrain';
import Button from '../form/Button';

import './GrainList.scss'
import { METADATA_GRAIN_ID, MY_CONTRACT_ID, ZIGS_ACCOUNT_ID } from '../../utils/constants';

interface GrainValueDisplayProps {
  grain: TestGrain
  grainIndex: number
  editGrain: (grain: TestGrain) => void
  testId?: string
}

export const GrainValueDisplay = ({ grain, grainIndex, editGrain, testId }: GrainValueDisplayProps) => {
  const { deleteGrain } = useContractStore()
  const [expanded, setExpanded] = useState(false)

  const grainStyle = {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: 'calc(100% - 32px)',
    margin: '8px 8px 0',
    padding: 8,
    border: '1px solid black',
    borderRadius: 4,
    background: grain.obsolete ? 'rgba(0,0,0,0.05)' : 'white',
  }

  const isZigsGrain = grain.id === ZIGS_ACCOUNT_ID
  const isContractGrain = grain.id === MY_CONTRACT_ID
  const isMetadataGrain = grain.id === METADATA_GRAIN_ID
  const untouchable = isZigsGrain || isContractGrain || isMetadataGrain

  const grainIdDisplay = isZigsGrain ? 'zigs account' :
    isContractGrain ? 'contract grain' :
    isMetadataGrain ? 'metadata grain' :
    grain.id

  const grainContent = (
    <Col style={{ ...grainStyle, position: 'relative' }}>
      <Col style={{ width: '100%' }}>
        <Row style={{ width: '100%' }}>
          <Button
            onClick={() => setExpanded(!expanded)}
            variant='unstyled'
            style={{ marginRight: 8, marginTop: 2, alignSelf: 'flex-start' }}
            iconOnly
            icon={expanded ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
          />
          <Col style={{ wordBreak: 'break-all', maxWidth: 'calc(100% - 80px)' }}>
            ID: {grainIdDisplay}
          </Col>
        </Row>
      </Col>
      {expanded && <Col>
        <div>Holder: {grain.holder}</div>
        <div>Lord: {grain.lord}</div>
        <div>Town: {grain.town_id}</div>
        <div>Label: {grain.label}</div>
        <div>Data:</div>
        <div>{grain.data_text || grain.data}</div>
        {/* <Values values={grainData} /> */}
      </Col>}
      <Row style={{ position: 'absolute', top: 4, right: 4, padding: 4 }}>
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
            className="delete"
            style={{ marginLeft: 8 }}
            iconOnly
            icon={<FaTrash size={14} />}
          />
        )}
      </Row>
    </Col>
  )

  return (
    <Draggable draggableId={grain.id} index={grainIndex} isDragDisabled/*={Boolean(grain.obsolete)}*/>
      {(provided: any, snapshot: any) => (
        <>
          <Row key={grain.id} className="grain" innerRef={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
            {grainContent}
          </Row>
          {snapshot.isDragging && snapshot.draggingOver !== 'grains' && <Row className='grain'>{grainContent}</Row>}
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
  <Droppable droppableId="grains" style={{ width: '100%', height: '100%' }}>
    {(provided: any) => (
      <Col className='grains' {...provided.droppableProps} innerRef={provided.innerRef} style={{ ...provided.droppableProps.style,  width: '100%', overflow: 'scroll' }}>
        {grains.map((grain, i) => (
          <GrainValueDisplay key={grain.id} grain={grain} grainIndex={i} editGrain={editGrain} testId={testId} />
        ))}
        {provided.placeholder}
      </Col>
    )}
  </Droppable>
