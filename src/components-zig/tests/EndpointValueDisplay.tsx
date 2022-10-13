import React, { useCallback, useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { FaChevronRight, FaChevronDown, FaRegEdit, FaRegTrashAlt, FaPlay } from 'react-icons/fa';
import Col from '../../components/spacing/Col'
import Row from '../../components/spacing/Row'
import useZigguratStore from '../../stores/zigguratStore';
import Button from '../../components/form/Button';
import Text from '../../components/text/Text'
import Field from '../../components/spacing/Field';
import Entry from '../../components/spacing/Entry';
import { Endpoint } from '../../types/ziggurat/Endpoint';

import './EndpointList.scss'
import TextArea from '../../components/form/TextArea';
import { toast } from 'react-toastify';

interface EndpointValueDisplayProps {
  endpoint: Endpoint
  endpointIndex: number
  editEndpoint: (endpoint: Endpoint) => void
  testId?: string
}

export const EndpointValueDisplay = ({ endpoint, endpointIndex, editEndpoint, testId }: EndpointValueDisplayProps) => {
  const { testEndpoint, removeEndpoint, addEndpoint, setLoading } = useZigguratStore()
  const [expanded, setExpanded] = useState(false)
  const [json, setJson] = useState(endpoint.json || '')
  const [jsonError, setJsonError] = useState(false)

  const run = useCallback(() => {
    setLoading('Running...')
    testEndpoint(endpoint)
    setLoading(undefined)
    setExpanded(true)
  }, [endpoint, testEndpoint, setLoading])

  const saveJson = useCallback(async () => {
    try {
      try {
        JSON.parse(json)
      } catch (err) {
        toast.error('Invalid JSON')
        setJsonError(true)
        return
      }
      await addEndpoint({ ...endpoint, json }, endpoint.id)
      setJsonError(false)
    } catch (e) {
      toast.error('Error saving endpoint')
    }
  }, [endpoint, json, addEndpoint])

  const endpointContent = (
    <>
      <Row style={{ width: '100%' }}>
        <Button
          style={{ marginTop: 4, paddingTop: 2 }}
          onClick={() => setExpanded(!expanded)}
          variant='unstyled' expander
          iconOnly
          icon={expanded ? <FaChevronDown size={16} /> : <FaChevronRight size={16} />}
        />
        <Row>
          <Text bold style={{ marginRight: 8 }}>%{endpoint.app} - {endpoint.type}</Text>
          <Text>{endpoint.path || endpoint.mark}</Text>
        </Row>
        <Row style={{ marginLeft: 'auto'}}>
          {endpoint.type !== 'sub' && <Button
            onClick={run}
            small iconOnly
            icon={<FaPlay size={14} style={{ marginBottom: -1 }} />}
          />}
          <Button
            onClick={() => editEndpoint(endpoint)}
            small iconOnly
            style={{ marginLeft: 8 }}
            icon={<FaRegEdit size={14} />}
          />
          <Button
            onClick={() => { if (window.confirm('Are you sure you want to remove this endpoint?')) { removeEndpoint(endpoint.id) } }}
            small className='delete'
            style={{ marginLeft: 8 }}
            iconOnly
            icon={<FaRegTrashAlt size={14} />}
          />
        </Row>
      </Row>
      {endpoint.type === 'poke' && (
        <TextArea
          containerStyle={{ marginTop: 12, width: '100%' }}
          style={{ border: jsonError ? '1px solid red' : undefined }}
          onChange={(e: any) => setJson(e.target.value)}
          placeholder="JSON for poke"
          label='JSON'
          value={json}
          onBlur={saveJson}
          required
        />
      )}
      {expanded && <Entry>
        {endpoint.error ? (
          <Field name="Error" style={{ color: 'red' }}>
            <Text>{endpoint.error}</Text>
          </Field>
        ) : (
          <Field name={`Result${endpoint.result instanceof Array ? 's' : ''}`}>
            {typeof endpoint.result === 'string' || !endpoint.result ? endpoint.result || 'none' : 
              <Col>
                {endpoint.result.map((r, i) => <Field key={i} name={`${i}.`}>
                  <Text>{r}</Text>
                </Field>)}
              </Col>
            }
          </Field>
        )}
      </Entry>}
    </>
  )

  return (
    <Draggable draggableId={endpoint.id} index={endpointIndex} isDragDisabled/*={Boolean(endpoint.obsolete)}*/>
      {(provided: any, snapshot: any) => (
        <>
          <Col key={endpoint.id} className='endpoint' innerRef={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
            {endpointContent}
          </Col>
          {snapshot.isDragging && snapshot.draggingOver !== 'endpoints' && <Col className='endpoint'>{endpointContent}</Col>}
        </>
      )}
    </Draggable>
  )
}