import { Droppable, } from 'react-beautiful-dnd'
import Col from '../../components/spacing/Col'
import { Endpoint } from '../../types/ziggurat/Endpoint'
import { EndpointValueDisplay } from './EndpointValueDisplay'

import './EndpointList.scss'

interface EndpointListProps {
  editEndpoint: (endpoint: Endpoint) => void
  endpoints: Endpoint[]
}

export const EndpointList = ({ endpoints, editEndpoint }: EndpointListProps) =>
  <Droppable droppableId='endpoints' style={{ width: '100%', height: '100%' }}>
    {(provided: any) => (
      <Col className='endpoints' {...provided.droppableProps} innerRef={provided.innerRef} style={{ ...provided.droppableProps.style }}>
        {endpoints.map((endpoint, i) => (
          <EndpointValueDisplay key={endpoint.id} endpoint={endpoint} endpointIndex={i} editEndpoint={editEndpoint} />
        ))}
        {provided.placeholder}
      </Col>
    )}
  </Droppable>
