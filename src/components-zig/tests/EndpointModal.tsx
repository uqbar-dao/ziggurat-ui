import { useCallback } from "react"
import Button from "../../components/form/Button"
import Input from "../../components/form/Input"
import { Select } from "../../components/form/Select"
import TextArea from "../../components/form/TextArea"
import Modal from "../../components/popups/Modal"
import Col from "../../components/spacing/Col"
import Text from "../../components/text/Text"
import { EndpointForm, EndpointFormField } from "../../types/ziggurat/EndpointForm"
import { EndpointType, ENDPOINT_TYPES } from "../../types/ziggurat/Endpoint"

interface EndpointModalProps {
  showEndpointModal: boolean
  hideEndpointModal: () => void
  isEdit: boolean
  endpointFormValues: EndpointForm
  updateEndpointFormValue: (key: EndpointFormField, value: string) => void
  submitEndpoint: () => void
}

export const EndpointModal = ({
  showEndpointModal,
  hideEndpointModal,
  isEdit,
  endpointFormValues,
  updateEndpointFormValue,
  submitEndpoint,
}: EndpointModalProps) => {
  const selectType = useCallback((type: EndpointType) => {
    updateEndpointFormValue('type', type)
  }, [updateEndpointFormValue])

  const isPoke = endpointFormValues.type === 'poke'

  return (
    <Modal title={(isEdit ? 'Edit' : 'Add New') + ' Endpoint'} show={showEndpointModal} hide={hideEndpointModal} style={{ minWidth: 320, width: '60%', maxWidth: 500 }}>
      <Col style={{ maxHeight: 'calc(100vh - 80px)', overflow: 'scroll' }}>
        <Input
          label="App"
          onChange={(e) => updateEndpointFormValue('app', e.target.value)}
          placeholder="app name"
          value={endpointFormValues.app}
          required
        />
        <Text style={{ marginTop: 12, marginBottom: 2 }}>Type</Text>
        <Select value={endpointFormValues.type} onChange={(e) => selectType(e.target.value as EndpointType)}>
          {ENDPOINT_TYPES.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </Select>
        {!isPoke && <Input
          label="Path"
          onChange={(e) => updateEndpointFormValue('path', e.target.value)}
          placeholder="/path"
          value={endpointFormValues.path}
          required
        />}
        {isPoke && <Input
          label="Mark"
          onChange={(e) => updateEndpointFormValue('mark', e.target.value)}
          placeholder="mark"
          value={endpointFormValues.mark}
          required
        />}
        {isPoke && <TextArea
          containerStyle={{ marginTop: 12 }}
          onChange={(e) => updateEndpointFormValue('json', e.target.value)}
          label="JSON"
          placeholder="JSON for poke"
          value={endpointFormValues.json}
          required
        />}
        <Button onClick={submitEndpoint} style={{ alignSelf: 'center', marginTop: 16 }}>{isEdit ? 'Update' : 'Add'} Endpoint</Button>
      </Col>
    </Modal>
  )
}
