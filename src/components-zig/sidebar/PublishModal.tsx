import { useCallback, useState } from "react"
import useZigguratStore from "../../stores/zigguratStore"
import Button from "../../components/form/Button"
import Form from "../../components/form/Form"
import Input from "../../components/form/Input"
import Modal from "../../components/popups/Modal"

type PublishFormField = 'title' | 'info' | 'color' | 'image' | 'version' | 'website' | 'license'
const BLANK_DEPLOY_FORM = {
  title: '',
  info: '',
  color: '',
  image: '',
  version: '',
  website: '',
  license: '',
}

const FORM_LABELS = {
  title: '',
  info: '',
  color: '(6-digit hexadecimal)',
  image: '(URL)',
  version: '(space-separated list of integers)',
  website: '(URL)',
  license: '(e.g. MIT)',
}

interface PublishModalProps {
  project: string
  show: boolean
  hide: () => void
}

export const PublishModal = ({ project, show, hide }: PublishModalProps) => {
  const { publishGallApp } = useZigguratStore()
  const [deployForm, setPublishForm] = useState(BLANK_DEPLOY_FORM)

  const publishApp = useCallback(async () => {
    const { title, info, color, image, version, website, license } = deployForm
    await publishGallApp(project, title, info, color, image, version.split(' ').map(Number).filter(v => !isNaN(v)), website, license)
    hide()
    setPublishForm(BLANK_DEPLOY_FORM)
  }, [deployForm, project, hide, publishGallApp])

  const updateField = useCallback((key: PublishFormField, value: string) => {
    const newForm = { ...deployForm }
    newForm[key] = value
    setPublishForm(newForm)
  }, [deployForm, setPublishForm])

  return (
    <Modal title='Publish App' show={show} hide={hide}>
      <Form onSubmit={publishApp} style={{ minWidth: 320 }}>
        {(['title', 'info', 'color', 'image', 'version', 'website', 'license'] as PublishFormField[]).map(field => (
          <Input
            key={field}
            label={`${field} ${FORM_LABELS[field]}`}
            value={deployForm[field]}
            onChange={(e) => updateField(field, e.target.value)}
          />
        ))}
        <Button style={{ width: '100%', marginTop: 12 }} variant="dark" type="submit">Publish</Button>
      </Form>
    </Modal>
  )
}
