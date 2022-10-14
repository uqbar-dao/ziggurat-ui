import { useCallback, useEffect, useMemo, useState } from "react"
import useZigguratStore from "../../stores/zigguratStore"
import { DEFAULT_BUDGET, DEFAULT_RATE } from "../../utils/constants"
import Button from "../../components/form/Button"
import Form from "../../components/form/Form"
import Input from "../../components/form/Input"
import Modal from "../../components/popups/Modal"
import Col from "../../components/spacing/Col"
import { Select } from "../../components/form/Select"
import Text from "../../components/text/Text"
import { displayPubKey } from "../../utils/account"

type DeployFormField = 'address' | 'location' | 'town' | 'rate' | 'budget'
const BLANK_DEPLOY_FORM = { address: '', location: 'test', town: '0x0', rate: DEFAULT_RATE.toString(), budget: DEFAULT_BUDGET.toString() }

interface DeployModalProps {
  project: string
  show: boolean
  hide: () => void
}

export const DeployModal = ({ project, show, hide }: DeployModalProps) => {
  const { accounts, importedAccounts, deployContract } = useZigguratStore()
  const [deployForm, setDeployForm] = useState(BLANK_DEPLOY_FORM)
  const [customLocation, setCustomLocation] = useState('')

  useEffect(() => {
    updateField('address', userAddresses[0] || '')
  }, []) // eslint-disable-line

  const deployProjectContract = useCallback(async () => {
    const { address, location, town, rate, budget } = deployForm
    await deployContract(project, address, location === 'custom' ? customLocation : location, town, Number(rate), Number(budget), true)
    hide()
    setDeployForm(BLANK_DEPLOY_FORM)
    setCustomLocation('')
  }, [deployForm, project, customLocation, hide, deployContract, setCustomLocation])

  const updateField = useCallback((key: DeployFormField, value: string) => {
    const newForm = { ...deployForm }
    newForm[key] = value
    setDeployForm(newForm)
  }, [deployForm, setDeployForm])

  const userAddresses = useMemo(
    () => accounts.map(({ address }) => address).concat(importedAccounts.map(({ address }) => address)),
    [accounts, importedAccounts]
  )

  // TODO: give 'custom' option for the location
  return (
    <Modal title='Deploy Contract' show={show} hide={hide}>
      <Form onSubmit={deployProjectContract} style={{ minWidth: 320 }}>
        <Col>
          <Text mr1 style={{ marginBottom: 4 }}>Wallet Address</Text>
          <Select style={{ height: 30.5, }} value={deployForm.address} onChange={(e) => updateField('address', e.target.value)}>
            {userAddresses.map(a => <option key={a} value={a}>{displayPubKey(a)}</option>)}
          </Select>
        </Col>
        <Col>
          <Text mr1 style={{ marginBottom: 4, marginTop: 2 }}>Location</Text>
          <Select style={{ height: 30.5, }} value={deployForm.location} onChange={(e) => updateField('location', e.target.value)}>
            {['~bacdun', 'local', 'custom'].map(a => <option key={a} value={a}>{a}</option>)}
          </Select>
        </Col>
        {deployForm.location === 'custom' && <Input
          label='Custom Location'
          value={customLocation}
          onChange={(e) => setCustomLocation(e.target.value)}
          autoFocus
        />}
        {(['town', 'rate', 'budget'] as DeployFormField[]).map(field => (
          <Input
            key={field}
            label={`${field[0].toUpperCase()}${field.slice(1)}`}
            value={deployForm[field]}
            onChange={(e) => updateField(field, e.target.value)}
          />
        ))}
        <Button style={{ width: '100%', marginTop: 12 }} variant="dark" type="submit">Deploy</Button>
      </Form>
    </Modal>
  )
}
