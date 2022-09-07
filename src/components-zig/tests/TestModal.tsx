import { useCallback, useMemo, useState } from "react"
import useProjectStore from "../../store/projectStore"
import { TestFormField, TestFormValues } from "../../types/ziggurat/TestForm"
import { STATUS_CODES } from "../../utils/constants"
import Button from "../form/Button"
import Input from "../form/Input"
import { Select } from "../form/Select"
import TextArea from "../form/TextArea"
import Modal from "../popups/Modal"
import Col from "../spacing/Col"
import Text from "../text/Text"

interface TestModalProps {
  showTestModal: boolean
  hideTestModal: () => void
  isEdit: boolean
  testFormValues: TestFormValues
  updateTestFormValue: (key: TestFormField, value: string) => void
  submitTest: () => void
}

export const TestModal = ({
  showTestModal,
  hideTestModal,
  isEdit,
  testFormValues,
  updateTestFormValue,
  submitTest,
}: TestModalProps) => {
  const { contracts, currentProject } = useProjectStore()
  const project = useMemo(() => contracts[currentProject], [contracts, currentProject])

  const [mold, setMold] = useState('other')

  const selectMold = useCallback((action: string) => {
    setMold(action)
    const { mold } = project.molds.actions.find(m => m.name === action) || {}
    if (mold) {
      updateTestFormValue('action', mold[0] === '[' ? mold : `[${mold}]`)
    }
  }, [project, setMold, updateTestFormValue])

  return (
    <Modal show={showTestModal} hide={hideTestModal} style={{ minWidth: 320, width: '60%', maxWidth: 500 }}>
      <Col style={{ maxHeight: 'calc(100vh - 80px)', overflow: 'scroll' }}>
        <h3 style={{ marginTop: 0 }}>{isEdit ? 'Edit' : 'Add New'} Test</h3>
        <Input
          label="Name"
          onChange={(e) => updateTestFormValue('name', e.target.value)}
          placeholder="Nickname for test"
          value={testFormValues.name}
          required
        />
        {!!project?.molds?.actions?.length && !isEdit && (
          <>
            <Text style={{ marginTop: 12, marginBottom: 2 }}>Action</Text>
            <Select value={mold} onChange={(e) => selectMold(e.target.value)}>
              <option key="other" value="other">other</option>
              {project.molds.actions.map(({ name }) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </Select>
          </>
        )}
        <Text style={{ marginTop: 12, marginBottom: 2 }}>Expected Status Code</Text>
        <Select value={testFormValues.expectedError} onChange={(e) => updateTestFormValue('expectedError', e.target.value)}>
          {Object.keys(STATUS_CODES).map(code => (
            <option key={code} value={code}>{STATUS_CODES[Number(code)]}</option>
          ))}
        </Select>
        <TextArea
          containerStyle={{ marginTop: 12 }}
          onChange={(e) => updateTestFormValue('action', e.target.value)}
          label="Test (in Hoon)"
          placeholder="Your test here"
          value={testFormValues.action}
          required
        />
        <Button onClick={submitTest} style={{ alignSelf: 'center', marginTop: 16 }}>{isEdit ? 'Update' : 'Add'} Test</Button>
      </Col>
    </Modal>
  )
}
