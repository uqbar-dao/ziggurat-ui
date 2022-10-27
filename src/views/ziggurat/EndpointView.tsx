import React, { useCallback, useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';
import { isMobileCheck } from '../../utils/dimensions'
import Col from '../../components/spacing/Col'
import Row from '../../components/spacing/Row'
import useZigguratStore from '../../stores/zigguratStore';
import Button from '../../components/form/Button';
import { OpenFileHeader } from '../../components-zig/nav/OpenFileHeader';
import Text from '../../components/text/Text'
import { BLANK_ENDPOINT_FORM, EndpointForm, EndpointFormField } from '../../types/ziggurat/EndpointForm';
import { Endpoint } from '../../types/ziggurat/Endpoint';
import { EndpointList } from '../../components-zig/tests/EndpointList';
import { EndpointModal } from '../../components-zig/tests/EndpointModal';

import './EndpointView.scss'

const genFormValues = (app: string) => ({ ...BLANK_ENDPOINT_FORM, app })

export interface EndpointViewProps {}

export const EndpointView = () => {
  const { projects, currentProject, endpoints, setLoading, addEndpoint } = useZigguratStore()

  const [showEndpointModal, setShowEndpointModal] = useState(false)
  const [endpointFormValues, setEndpointFormValues] = useState<EndpointForm>(genFormValues(currentProject))
  const [edit, setEdit] = useState<Endpoint>()

  const isMobile = isMobileCheck()

  const editEndpoint = useCallback((endpoint: Endpoint) => {
    setEndpointFormValues(endpoint)
    setEdit(endpoint)
    setShowEndpointModal(true)
  }, [setEndpointFormValues, setShowEndpointModal])

  const updateEndpointFormValue = useCallback((key: EndpointFormField, value: string) => {
    const newValues = { ...endpointFormValues }
    newValues[key] = value as any
    setEndpointFormValues(newValues)
  }, [endpointFormValues, setEndpointFormValues])

  const submitEndpoint = useCallback(async () => {
    setLoading('Saving endpoint...')

    try {
      if (endpointFormValues.type === 'poke' && endpointFormValues.json) {
        try {
          JSON.parse(endpointFormValues.json)
        } catch (err) {
          toast.error('Poke payload is not valid JSON')
          return
        }
      }
      await addEndpoint(endpointFormValues, edit?.id)
      setShowEndpointModal(false)
      setEndpointFormValues(genFormValues(currentProject))
      setEdit(undefined)
    } catch (e) {
      toast.error('Error saving endpoint')
    }
    
    setLoading(undefined)
  }, [endpointFormValues, edit, currentProject, setLoading, addEndpoint])

  const handleDragAndDropItem = useCallback(({ source, destination }) => {
    if (!destination)
      return;

    if (source.droppableId === 'items') {
      if (destination.droppableId === 'items') {
        const newItems = [ ...Object.values(projects[currentProject].state) ]
        const reorderedItem = newItems.splice(source.index, 1)[0];
        newItems.splice(destination.index, 0, reorderedItem);
        
        // TODO: update the item order (is this even possible now?)
      }
    }
  }, [projects, currentProject]);

  const hideEndpointModal = useCallback(() => {
    if (edit) {
      if (window.confirm('Are you sure you want to discard your changes?')) {
        setEndpointFormValues(genFormValues(currentProject))
        setShowEndpointModal(false)
        setEdit(undefined)
      }
    } else {
      setShowEndpointModal(false)
    }
  }, [currentProject, edit, setEndpointFormValues, setShowEndpointModal, setEdit])

  const isEdit = Boolean(edit)

  return (
    <DragDropContext onDragEnd={handleDragAndDropItem}>
      <OpenFileHeader />
      <Row className='tests' style={{ flexDirection: isMobile ? 'column' : 'row' }}>
        <Col className='test-actions' style={{ height: isMobile ? 600 : '100%', width: '100%' }}>
          <Row className='section-header'>
            <Row>
              <Text mr1 className='title'>App Endpoints</Text>
            </Row>
            <Row>
              <Button className='action mr1' small onClick={() => setShowEndpointModal(true)}>+ Add Endpoint</Button>
            </Row>
          </Row>
          <EndpointList editEndpoint={editEndpoint} endpoints={endpoints} />
        </Col>
        <EndpointModal {...{ showEndpointModal, hideEndpointModal, isEdit, endpointFormValues, updateEndpointFormValue, submitEndpoint }} />
      </Row>
    </DragDropContext>
  )
}
