import { useCallback, useMemo, useState } from "react"
import useZigguratStore from "../../stores/zigguratStore"
import { FormValues } from "../../types/ziggurat/FormValues"
import { METADATA_GRAIN_ID, MY_CONTRACT_ID, ZIGS_ACCOUNT_ID } from "../../utils/constants"
import { formValuesFromItem } from "../../utils/form"
import Button from "../../components/form/Button"
import Input from "../../components/form/Input"
import { Select } from "../../components/form/Select"
import TextArea from "../../components/form/TextArea"
import Modal from "../../components/popups/Modal"
import Col from "../../components/spacing/Col"
import Row from "../../components/spacing/Row"
import Text from "../../components/text/Text"

interface ItemModalProps {
  showItemModal: boolean
  hideItemModal: () => void
  isEdit: boolean
  itemFormValues: FormValues
  updateItemFormValue: (key: string, value: string) => void
  setItemFormValues: (values: FormValues) => void
  submitItem: () => void
  testExpectation?: string
}

export const ItemModal = ({
  showItemModal,
  hideItemModal,
  isEdit,
  itemFormValues,
  updateItemFormValue,
  setItemFormValues,
  submitItem,
  testExpectation,
}: ItemModalProps) => {
  const { projects, currentProject } = useZigguratStore()
  const project = useMemo(() => projects[currentProject], [projects, currentProject])

  const [mold, setMold] = useState('other')
  const [selectedItemId, setSelectedItemId] = useState('other')

  const selectMold = useCallback((action: string) => {
    setMold(action)
    const selectedMold = project.molds.rice.find(m => m.name === action)
    if (selectedMold) {
      updateItemFormValue('data', `${selectedMold.mold}`)
      updateItemFormValue('label', `${selectedMold.name}`)
    }
  }, [project, setMold, updateItemFormValue])

  const selectItem = useCallback((itemId: string) => {
    setSelectedItemId(itemId)
    const item = project.state[itemId]
    setItemFormValues(formValuesFromItem(item))
  }, [project, setSelectedItemId, setItemFormValues])

  return (
    <Modal title={ (isEdit ? 'Update' : 'Add New') + ' Item'} show={showItemModal} hide={hideItemModal}>
      <Col style={{ minWidth: 320, maxHeight: 'calc(100vh - 80px)', overflow: 'scroll' }}>
        {!!project?.molds?.rice?.length && !isEdit && !testExpectation && (
          <>
            <Text style={{ marginTop: 12, marginBottom: 2 }}>item type</Text>
            <Select value={mold} onChange={(e) => selectMold(e.target.value)}>
              <option key="other" value="other">other</option>
              {project.molds.rice.map(({ name }) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </Select>
          </>
        )}
        {Boolean(testExpectation) && (
          <>
            <Text style={{ marginTop: 12, marginBottom: 2 }}>copy item</Text>
            <Select value={selectedItemId} onChange={(e) => selectItem(e.target.value)}>
              <option key="other" value="other">other</option>
              {Object.keys(project.state)
                .filter(id => id !== MY_CONTRACT_ID && id !== METADATA_GRAIN_ID)
                .map(id => (
                  <option key={id} value={id}>{id}</option>
                ))
              }
            </Select>
          </>
        )}
        {Object.keys(itemFormValues).map((key) => (
          <Row key={key}>
            { key === 'data' ? (
              <TextArea
                onChange={(e) => updateItemFormValue(key, e.target.value)}
                value={itemFormValues[key].value}
                label={`${key} (${JSON.stringify(itemFormValues[key].type).replace(/"/g, '')})`}
                placeholder={key}
                containerStyle={{ marginTop: 4, width: '100%' }}
              />
            ) : (
              <Input
                disabled={key === 'id' && isEdit}
                onChange={(e) => updateItemFormValue(key, e.target.value)}
                value={itemFormValues[key].value}
                label={`${key} (${JSON.stringify(itemFormValues[key].type).replace(/"/g, '')})`}
                placeholder={key}
                containerStyle={{ marginTop: 4, width: '100%' }}
              />
            )}
          </Row>
        ))}
        <Button onClick={submitItem} style={{ alignSelf: 'center', marginTop: 16 }}>{isEdit ? 'Update' : 'Add'} Item</Button>
      </Col>
    </Modal>
  )
}
