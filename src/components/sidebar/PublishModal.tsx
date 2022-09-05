import { useCallback, useState } from "react"
import useProjectStore from "../../store/projectStore"
import { DEFAULT_BUDGET, DEFAULT_RATE } from "../../utils/constants"
import Button from "../form/Button"
import Form from "../form/Form"
import Input from "../form/Input"
import Modal from "../popups/Modal"

type PublishFormField = 'address' | 'location' | 'town' | 'rate' | 'budget'
const BLANK_DEPLOY_FORM = { address: '', location: '', town: '0x0', rate: DEFAULT_RATE.toString(), budget: DEFAULT_BUDGET.toString() }

interface PublishModalProps {
  project: string
  show: boolean
  hide: () => void
}

export const PublishModal = ({ project, show, hide }: PublishModalProps) => {
  const { deployContract } = useProjectStore()
  const [deployForm, setPublishForm] = useState(BLANK_DEPLOY_FORM)

  const deployProjectContract = useCallback(async () => {
    const { address, location, town, rate, budget } = deployForm
    await deployContract(project, address, location, town, Number(rate), Number(budget), true)
    hide()
    setPublishForm(BLANK_DEPLOY_FORM)
  }, [deployForm, project, hide, deployContract])

  const updateField = useCallback((key: PublishFormField, value: string) => {
    const newForm = { ...deployForm }
    newForm[key] = value
    setPublishForm(newForm)
  }, [deployForm, setPublishForm])

  return (
    <Modal show={show} hide={hide}>
      <Form onSubmit={deployProjectContract} style={{ minWidth: 320 }}>
        <h3 style={{ marginTop: 0 }}>Publish Contract</h3>
        {(['address', 'location', 'town', 'rate', 'budget'] as PublishFormField[]).map(field => (
          <Input
            key={field}
            label={field}
            value={deployForm[field]}
            onChange={(e) => updateField(field, e.target.value)}
          />
        ))}
        <Button style={{ width: '100%', marginTop: 12 }} variant="dark" type="submit">Publish</Button>
      </Form>
    </Modal>
  )
}