import React, { useCallback, useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { FaChevronRight, FaChevronDown, FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import Col from '../../components/spacing/Col'
import Row from '../../components/spacing/Row'
import useZigguratStore from '../../stores/zigguratStore';
import { TestItem } from '../../types/ziggurat/TestItem';
import Button from '../../components/form/Button';
import HexNum from '../../components/text/HexNum'
import { METADATA_GRAIN_ID, MY_CONTRACT_ID, ZIGS_ACCOUNT_ID } from '../../utils/constants';
import { displayPubKey } from '../../utils/account';
import Field from '../../components/spacing/Field';
import Entry from '../../components/spacing/Entry';
import Input from '../../components/form/Input';
import { formValuesFromItem, itemFromForm, validateFormValues } from '../../utils/form';
import TextArea from '../../components/form/TextArea';

import './ItemList.scss'
import { toast } from 'react-toastify';

interface ItemValueDisplayProps {
  item: TestItem
  itemIndex: number
  editItem: (item: TestItem) => void
  testId?: string
  isExpectation?: boolean
}

export const ItemValueDisplay = ({ item, itemIndex, editItem, testId, isExpectation }: ItemValueDisplayProps) => {
  const { deleteItem, addItem } = useZigguratStore()
  const [expanded, setExpanded] = useState(false)
  const [itemValues, setItemValues] = useState(formValuesFromItem(item))

  const updateValue = useCallback((key: string) => (e: any) => {
    const newItemValues = { ...itemValues }
    newItemValues[key].value = e.target.value
    setItemValues(newItemValues)
  }, [itemValues, setItemValues])

  const saveItem = useCallback(() => {
    const validationError = validateFormValues(itemValues)
    if (validationError)
      return window.alert(validationError)
      
    try {
      // ids are now calculated on backend for new items
      const newItem = itemFromForm({...itemValues, id: { value: item.id, type: '%id' }})
      addItem(newItem, true)
    } catch (err) {
      toast.error(`Error saving item: \n\n${err}`)
    }
  }, [item, itemValues, addItem])

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

  const inputContainerStyle = { width: '100%' }
  const inputStyle = { padding: '1px 3px', marginBottom: 4, width: '100%' }

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
        <Field name='Holder'>
          <Input containerStyle={inputContainerStyle} style={inputStyle} placeholder='holder'
            onChange={updateValue('holder')} value={itemValues.holder.value} onBlur={saveItem}/>
        </Field>
        <Field name='Source'>
          <Input containerStyle={inputContainerStyle} style={inputStyle} placeholder='source'
            onChange={updateValue('source')} value={itemValues.source.value} onBlur={saveItem}/>
        </Field>
        <Field name='Town'>
          <Input containerStyle={inputContainerStyle} style={inputStyle} placeholder='town'
            onChange={updateValue('town')} value={itemValues.town.value} onBlur={saveItem}/>
        </Field>
        <Field name='Label'>
          <Input containerStyle={inputContainerStyle} style={inputStyle} placeholder='label'
            onChange={updateValue('label')} value={itemValues.label.value} onBlur={saveItem}/>
        </Field>
        <Field name='Data'>
          <TextArea containerStyle={inputContainerStyle} style={inputStyle} placeholder='noun'
            onChange={updateValue('noun')} value={itemValues.noun.value} onBlur={saveItem}/>
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