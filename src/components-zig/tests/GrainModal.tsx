import { useCallback, useMemo, useState } from "react"
import useProjectStore from "../../ui-ziggurat/store/projectStore"
import { FormValues } from "../../types/ziggurat/FormValues"
import { METADATA_GRAIN_ID, MY_CONTRACT_ID, ZIGS_ACCOUNT_ID } from "../../utils/constants"
import { formValuesFromGrain } from "../../utils/form"
import Button from "../form/Button"
import Input from "../form/Input"
import { Select } from "../form/Select"
import TextArea from "../form/TextArea"
import Modal from "../popups/Modal"
import Col from "../spacing/Col"
import Row from "../spacing/Row"
import Text from "../text/Text"

interface GrainModalProps {
  showGrainModal: boolean
  hideGrainModal: () => void
  isEdit: boolean
  grainFormValues: FormValues
  updateGrainFormValue: (key: string, value: string) => void
  setGrainFormValues: (values: FormValues) => void
  submitGrain: () => void
  testExpectation?: string
}

export const GrainModal = ({
  showGrainModal,
  hideGrainModal,
  isEdit,
  grainFormValues,
  updateGrainFormValue,
  setGrainFormValues,
  submitGrain,
  testExpectation,
}: GrainModalProps) => {
  const { contracts, currentProject } = useProjectStore()
  const project = useMemo(() => contracts[currentProject], [contracts, currentProject])

  const [mold, setMold] = useState('other')
  const [selectedGrainId, setSelectedGrainId] = useState('other')

  const selectMold = useCallback((action: string) => {
    setMold(action)
    const selectedMold = project.molds.rice.find(m => m.name === action)
    if (selectedMold) {
      updateGrainFormValue('data', `[${selectedMold.mold}]`)
      updateGrainFormValue('label', `[${selectedMold.name}]`)
    }
  }, [project, setMold, updateGrainFormValue])

  const selectGrain = useCallback((grainId: string) => {
    setSelectedGrainId(grainId)
    const grain = project.state[grainId]
    setGrainFormValues(formValuesFromGrain(grain))
  }, [project, setSelectedGrainId, setGrainFormValues])

  return (
    <Modal show={showGrainModal} hide={hideGrainModal}>
      <Col style={{ minWidth: 320, maxHeight: 'calc(100vh - 80px)', overflow: 'scroll' }}>
        <h3 style={{ marginTop: 0 }}>{isEdit ? 'Update' : 'Add New'} Grain</h3>
        {!!project?.molds?.rice?.length && !isEdit && !testExpectation && (
          <>
            <Text style={{ marginTop: 12, marginBottom: 2 }}>grain type</Text>
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
            <Text style={{ marginTop: 12, marginBottom: 2 }}>copy grain</Text>
            <Select value={selectedGrainId} onChange={(e) => selectGrain(e.target.value)}>
              <option key="other" value="other">other</option>
              {Object.keys(project.state)
                .filter(id => id !== ZIGS_ACCOUNT_ID && id !== MY_CONTRACT_ID && id !== METADATA_GRAIN_ID)
                .map(id => (
                  <option key={id} value={id}>{id}</option>
                ))
              }
            </Select>
          </>
        )}
        {Object.keys(grainFormValues).map((key) => (
          <Row key={key}>
            { key === 'data' ? (
              <TextArea
                onChange={(e) => updateGrainFormValue(key, e.target.value)}
                value={grainFormValues[key].value}
                label={`${key} (${JSON.stringify(grainFormValues[key].type).replace(/"/g, '')})`}
                placeholder={key}
                containerStyle={{ marginTop: 4, width: '100%' }}
              />
            ) : (
              <Input
                disabled={key === 'id' && isEdit}
                onChange={(e) => updateGrainFormValue(key, e.target.value)}
                value={grainFormValues[key].value}
                label={`${key} (${JSON.stringify(grainFormValues[key].type).replace(/"/g, '')})`}
                placeholder={key}
                containerStyle={{ marginTop: 4, width: '100%' }}
              />
            )}
          </Row>
        ))}
        <Button onClick={submitGrain} style={{ alignSelf: 'center', marginTop: 16 }}>{isEdit ? 'Update' : 'Add'} Grain</Button>
      </Col>
    </Modal>
  )
}
