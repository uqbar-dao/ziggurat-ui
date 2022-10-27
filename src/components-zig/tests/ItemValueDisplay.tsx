import React, { useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { FaChevronRight, FaChevronDown, FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import Col from '../../components/spacing/Col'
import Row from '../../components/spacing/Row'
import useZigguratStore from '../../stores/zigguratStore';
import { TestItem } from '../../types/ziggurat/TestItem';
import Button from '../../components/form/Button';
import HexNum from '../../components/text/HexNum'
import Text from '../../components/text/Text'
import { METADATA_GRAIN_ID, MY_CONTRACT_ID, ZIGS_ACCOUNT_ID } from '../../utils/constants';
import { displayPubKey } from '../../utils/account';
import Field from '../../components/spacing/Field';
import Entry from '../../components/spacing/Entry';

import './ItemList.scss'

interface ItemValueDisplayProps {
  item: TestItem
  itemIndex: number
  editItem: (item: TestItem) => void
  testId?: string
  isExpectation?: boolean
}

export const ItemValueDisplay = ({ item, itemIndex, editItem, testId, isExpectation }: ItemValueDisplayProps) => {
  const { deleteItem } = useZigguratStore()
  const [expanded, setExpanded] = useState(false)

  const itemStyle = {
    background: item.obsolete ? 'rgba(0,0,0,0.05)' : 'white',
  }

  const isZigsItem = item.id === ZIGS_ACCOUNT_ID
  const isContractItem = item.id === MY_CONTRACT_ID
  const isMetadataItem = item.id === METADATA_GRAIN_ID
  const untouchable = (isZigsItem || isContractItem) && !isExpectation

  const itemIdDisplay = expanded ? item.id :
    isZigsItem ? `${displayPubKey(item.id)} - zigs account` :
    isContractItem ? `${displayPubKey(item.id)} - contract` :
    isMetadataItem ? `${displayPubKey(item.id)} - metadata` :
    displayPubKey(item.id)

  const itemContent = (
    <>
      <Row style={{ ...itemStyle, width: '100%' }}>
        <Button
          onClick={() => setExpanded(!expanded)}
          variant='unstyled' expander
          iconOnly
          icon={expanded ? <FaChevronDown size={16} /> : <FaChevronRight size={16} />}
        />
        <HexNum num={item.id} displayNum={itemIdDisplay} />
        <Row style={{ marginLeft: 'auto'}}>
          {!item.obsolete && !untouchable && (
            <Button
              onClick={() => editItem(item)}
              small iconOnly
              icon={<FaRegEdit size={14} />}
            />
          )}
          {!untouchable && (
            <Button
              onClick={() => { if(window.confirm('Are you sure you want to remove this item?')) { deleteItem(item.id, testId) } }}
              small className='delete'
              style={{ marginLeft: 8 }}
              iconOnly
              icon={<FaRegTrashAlt size={14} />}
            />
          )}
        </Row>
      </Row>
      {expanded && <Entry>
        <Field name='Holder'> {item.holder}</Field>
        <Field name='Source'> {item.source}</Field>
        <Field name='Town'> {item.town_id}</Field>
        <Field name='Label'> {item.label}</Field>
        <Field name='Data'>
          <Text breakWord>
            {item.noun_text || item.noun}
          </Text>
        </Field>
      </Entry>}
    </>
  )

  return (
    <Draggable draggableId={item.id} index={itemIndex} isDragDisabled/*={Boolean(item.obsolete)}*/>
      {(provided: any, snapshot: any) => (
        <>
          <Col key={item.id} className='item' innerRef={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
            {itemContent}
          </Col>
          {snapshot.isDragging && snapshot.draggingOver !== 'items' && <Col className='item'>{itemContent}</Col>}
        </>
      )}
    </Draggable>
  )
}