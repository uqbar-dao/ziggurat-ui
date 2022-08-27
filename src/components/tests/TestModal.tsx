import { useCallback, useMemo, useState } from "react"
import { FaMinusCircle } from "react-icons/fa"
import { FormValues } from "../../types/FormValues"
import { Molds } from "../../types/Molds"
import { UqbarType, UQBAR_TYPES } from "../../types/UqbarType"
import Button from "../form/Button"
import Input from "../form/Input"
import { Select } from "../form/Select"
import Modal from "../popups/Modal"
import Col from "../spacing/Col"
import Row from "../spacing/Row"

interface TestModalProps {
  showTestModal: boolean
  hideTestModal: () => void
  actionType: string
  selectAction: (action: string) => void
  isEdit: boolean
  molds: Molds
  testFormValues: FormValues
  setTestFormValues: (values: FormValues) => void
  updateTestFormValue: (key: string, value: string) => void
  submitTest: (isUpdate: boolean) => () => void
}

export const TestModal = ({
  showTestModal,
  hideTestModal,
  actionType,
  selectAction,
  isEdit,
  molds,
  testFormValues,
  setTestFormValues,
  updateTestFormValue,
  submitTest,
}: TestModalProps) => {
  const [newTestField, setNewTestField] = useState('')
  const [newTestFieldType, setNewTestFieldType] = useState(`@ux`)

  const addTestField = useCallback(() => {
    const newValues = { ...testFormValues }
    newValues[newTestField] = { value: '', type: newTestFieldType as UqbarType }
    setTestFormValues(newValues)
    setNewTestField('')
  }, [newTestField, newTestFieldType, testFormValues, setTestFormValues])

  const removeTestField = useCallback((key: string) => () => {
    const newValues = { ...testFormValues }
    delete newValues[key]
    setTestFormValues(newValues)
  }, [testFormValues, setTestFormValues])

  const testFieldPlaceHolder = useMemo(() => `field${Object.keys(testFormValues).length}`, [testFormValues])

  return (
    <Modal show={showTestModal} hide={hideTestModal}>
      <Col style={{ minWidth: 320, maxHeight: 'calc(100vh - 80px)', overflow: 'scroll' }}>
        <h3 style={{ marginTop: 0 }}>Add New Test</h3>

        <Input
          label="Test (in Hoon)"
          onChange={(e) => updateTestFormValue('testString', e.target.value)}
          placeholder="Your test here"
          value={testFormValues.testString?.value}
          required
        />

        {/* <Select onChange={(e) => selectAction(e.target.value)} value={actionType} disabled={isEdit}>
          <option>Select an Action Type</option>
          {Object.keys(molds.actions).map(key => (
            <option key={key} value={key}>{key}</option>
          ))}
        </Select>
        {Object.keys(testFormValues).map((key) => (
          <Row key={key}>
            <Input
              disabled={key === 'id' && isEdit}
              onChange={(e) => updateTestFormValue(key, e.target.value)}
              value={testFormValues[key].value}
              label={`${key} (${JSON.stringify(testFormValues[key].type).replace(/"/g, '')})`}
              placeholder={key}
              containerStyle={{ marginTop: 4, width: '100%' }}
            />
            <Button onClick={removeTestField(key)} style={{ marginTop: 24, marginLeft: 8 }} variant="unstyled" iconOnly icon={<FaMinusCircle />} />
          </Row>
        ))}
        <Row style={{ marginTop: 12, borderTop: '1px solid black', paddingTop: 12 }}>
          <Input
            onChange={(e) => setNewTestField(e.target.value)}
            value={newTestField}
            placeholder={testFieldPlaceHolder}
            containerStyle={{ width: 'calc(100% - 176px)' }}
          />
          <Select onChange={(e) => setNewTestFieldType(e.target.value)}
            value={newTestFieldType}
            style={{ marginLeft: 8, width: 60, padding: '6px' }}>
            {UQBAR_TYPES.map(t => (
              <option key={t}>{t}</option>
            ))}
          </Select>
          <Button onClick={addTestField} style={{ marginLeft: 8, padding: '4px 8px', width: 100, justifyContent: 'center' }} variant="dark">Add Field</Button>
        </Row> */}
        
        <Button onClick={submitTest(isEdit)} style={{ alignSelf: 'center', marginTop: 16 }}>{isEdit ? 'Update' : 'Add'} Test</Button>
      </Col>
    </Modal>
  )
}