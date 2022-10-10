import { Droppable, } from 'react-beautiful-dnd'
import Col from '../../components/spacing/Col'
import { TestGrain } from '../../types/ziggurat/TestGrain';

import './GrainList.scss'
import { GrainValueDisplay } from './GrainValueDisplay';

interface GrainListProps {
  editGrain: (grain: TestGrain) => void
  grains: TestGrain[]
  testId?: string
  isExpectationsList?: boolean
}

export const GrainList = ({ grains, editGrain, testId, isExpectationsList }: GrainListProps) =>
  <Droppable droppableId='grains' style={{ width: '100%', height: '100%' }}>
    {(provided: any) => (
      <Col className='grains' {...provided.droppableProps} innerRef={provided.innerRef} style={{ ...provided.droppableProps.style }}>
        {grains.map((grain, i) => (
          <GrainValueDisplay key={grain.id} grain={grain} grainIndex={i} editGrain={editGrain} testId={testId} isExpectation={isExpectationsList} />
        ))}
        {provided.placeholder}
      </Col>
    )}
  </Droppable>
