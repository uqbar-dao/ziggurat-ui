import { Droppable, } from 'react-beautiful-dnd'
import Col from '../../components/spacing/Col'
import { TestItem } from '../../types/ziggurat/TestItem';

import './ItemList.scss'
import { ItemValueDisplay } from './ItemValueDisplay';

interface ItemListProps {
  editItem: (item: TestItem) => void
  items: TestItem[]
  testId?: string
  isExpectationsList?: boolean
}

export const ItemList = ({ items, editItem, testId, isExpectationsList }: ItemListProps) =>
  <Droppable droppableId='items' style={{ width: '100%', height: '100%' }}>
    {(provided: any) => (
      <Col className='items' {...provided.droppableProps} innerRef={provided.innerRef} style={{ ...provided.droppableProps.style }}>
        {items.map((item, i) => (
          <ItemValueDisplay key={item.id} item={item} itemIndex={i} editItem={editItem} testId={testId} isExpectation={isExpectationsList} />
        ))}
        {provided.placeholder}
      </Col>
    )}
  </Droppable>
