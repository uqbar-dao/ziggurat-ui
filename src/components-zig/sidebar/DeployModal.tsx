import { useCallback, useState } from "react"
import useZigguratStore from "../../stores/zigguratStore"
import { DEFAULT_BUDGET, DEFAULT_RATE } from "../../utils/constants"
import Button from "../../components/form/Button"
import Form from "../../components/form/Form"
import Input from "../../components/form/Input"
import Modal from "../../components/popups/Modal"

type DeployFormField = 'address' | 'location' | 'town' | 'rate' | 'budget'
const BLANK_DEPLOY_FORM = { address: '', location: '', town: '0x0', rate: DEFAULT_RATE.toString(), budget: DEFAULT_BUDGET.toString() }

interface DeployModalProps {
  project: string
  show: boolean
  hide: () => void
}

export const DeployModal = ({ project, show, hide }: DeployModalProps) => {
  const { deployContract } = useZigguratStore()
  const [deployForm, setDeployForm] = useState(BLANK_DEPLOY_FORM)

  const deployProjectContract = useCallback(async () => {
    const { address, location, town, rate, budget } = deployForm
    await deployContract(project, address, location, town, Number(rate), Number(budget), true)
    hide()
    setDeployForm(BLANK_DEPLOY_FORM)
  }, [deployForm, project, hide, deployContract])

  const updateField = useCallback((key: DeployFormField, value: string) => {
    const newForm = { ...deployForm }
    newForm[key] = value
    setDeployForm(newForm)
  }, [deployForm, setDeployForm])

  return (
    <Modal title='Deploy Contract' show={show} hide={hide}>
      <Form onSubmit={deployProjectContract} style={{ minWidth: 320 }}>
        {(['address', 'location', 'town', 'rate', 'budget'] as DeployFormField[]).map(field => (
          <Input
            key={field}
            label={field}
            value={deployForm[field]}
            onChange={(e) => updateField(field, e.target.value)}
          />
        ))}
        <Button style={{ width: '100%', marginTop: 12 }} variant="dark" type="submit">Deploy</Button>
      </Form>
    </Modal>
  )
}