import React, { useMemo, useState } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { FaChevronDown, FaChevronUp, FaPen, FaCopy } from 'react-icons/fa';
import Col from '../spacing/Col'
import Row from '../spacing/Row'
import useContractStore from '../../store/contractStore';
import { TestGrain } from '../../types/TestGrain';
import { Values } from './ValuesDisplay';
import Button from '../form/Button';
import { EMPTY_PROJECT } from '../../types/Project';

import './GrainList.scss'

interface GrainValueDisplayProps extends GrainListProps {
  grain: TestGrain
  grainIndex: number
}

export const GrainValueDisplay = ({ grain, grainIndex, editGrain }: GrainValueDisplayProps) => {
  const { removeGrain, saveFiles } = useContractStore()
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

  // const grainData = useMemo(() => Object.keys(grain.data).reduce((acc, key) => {
  //   acc[key] = grain.data[key].value
  //   return acc
  // }, {} as { [key: string]: string }), [grain])

  const grainContent = (
    <Col style={{ ...grainStyle, position: 'relative' }}>
      <Col>
        <Row>
          <Button
            onClick={() => setExpanded(!expanded)}
            variant='unstyled'
            style={{ marginRight: 8, marginTop: 2, alignSelf: 'flex-start' }}
            iconOnly
            icon={expanded ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
          />
          <Col>
            <div>ID: {grain.id}</div>
          </Col>
        </Row>
      </Col>
      {expanded && <Col>
        <div>Holder: {grain.holder}</div>
        <div>Lord: {grain.lord}</div>
        <div>Town ID: {grain['town-id']}</div>
        <div>Data:</div>
        <div>{grain.data}</div>
        {/* <Values values={grainData} /> */}
      </Col>}
      <Row style={{ position: 'absolute', top: 4, right: 4, padding: 4 }}>
        {!grain.obsolete && (
          <Button
            onClick={() => editGrain(grain, true)}
            variant='unstyled'
            iconOnly
            icon={<FaCopy size={14} />}
            style={{ marginRight: 8 }}
          />
        )}
        {!grain.obsolete && (
          <Button
            onClick={() => editGrain(grain)}
            variant='unstyled'
            iconOnly
            icon={<FaPen size={14} />}
          />
        )}
        <Button
          onClick={() => { if(window.confirm('Are you sure you want to remove this grain?')) { removeGrain(grainIndex); saveFiles() } }}
          variant='unstyled'
          className="delete"
          style={{ fontSize: 20, marginLeft: 8 }}
        >
          &times;
        </Button>
      </Row>
    </Col>
  )

  return (
    <Draggable draggableId={grain.id} index={grainIndex} isDragDisabled={Boolean(grain.obsolete)}>
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
  editGrain: (grain: TestGrain, copyFormat?: boolean) => void
}

export const GrainList = ({ editGrain }: GrainListProps) => {
  const { projects, currentProject } = useContractStore()
  const project = useMemo(() => projects.find(p => p.title === currentProject), [currentProject, projects])
  const { testData } = useMemo(() => project || EMPTY_PROJECT, [project])

  return (
    <Droppable droppableId="grains" style={{ width: '100%', height: '100%' }}>
      {(provided: any) => (
        <Col className='grains' {...provided.droppableProps} innerRef={provided.innerRef} style={{ ...provided.droppableProps.style,  width: '100%', overflow: 'scroll' }}>
          {testData.grains.map((grain, i) => (
            <GrainValueDisplay key={grain.id} grain={grain} grainIndex={i} editGrain={editGrain} />
          ))}
          {provided.placeholder}
        </Col>
      )}
    </Droppable>
  )
}
