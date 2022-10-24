import React, { useCallback, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/addon/display/placeholder'
import Button from '../../components/form/Button'
import Col from '../../components/spacing/Col'
import Row from '../../components/spacing/Row'
import useZigguratStore from '../../stores/zigguratStore';
import Input from '../../components/form/Input';
import { generateInitialMetadata } from '../../utils/fungible';
import { MetadataForm } from '../../components-zig/forms/MetadataForm';
import LoadingOverlay from '../../components/popups/LoadingOverlay';
import { METADATA_GRAIN_ID, MY_CONTRACT_ID } from '../../utils/constants';
import { numToUd } from '../../utils/number';
import { addHexDots } from '../../utils/format';
import { RawMetadata } from '../../types/ziggurat/Metadata';

import './NewProjectView.scss'

type CreationStep = 'title' | 'project' | 'gall' | 'token' | 'template' | 'metadata'
type ProjectOption = 'contract' | 'gall' | 'contract-gall'
type TokenOption = 'fungible' | 'nft' | 'blank'
type TemplateOption = 'issue' | 'wrapper'
export interface CreationOptions {
  title?: string
  project?: ProjectOption
  token?: TokenOption
  template?: TemplateOption
  gall?: string
}

const NewProjectView = ({ hide = false }: { hide?: boolean }) => {
  const { userAddress, contracts, createProject, populateTemplate, openFiles, setOpenFiles } = useZigguratStore()
  const nav = useNavigate()

  const [step, setStep] = useState<CreationStep>('title')
  const [options, setOptions] = useState<CreationOptions>({ title: '' })
  // TODO: get default minter from the wallet and then figure out the default deployer
  const [metadata, setMetadata] = useState<RawMetadata>(generateInitialMetadata([userAddress], userAddress, 'fungible'))
  const [loading, setLoading] = useState(false)

  const submitNewProject = useCallback(async (options: CreationOptions, md?: RawMetadata) => {
    setLoading(true)

    const metadata = !md ? undefined : {
      id: METADATA_GRAIN_ID,
      holder: MY_CONTRACT_ID,
      source: MY_CONTRACT_ID,
      'town-id': '0x0',
      label: 'token-metadata',
      salt: Number(md.salt),
      data: `[name='${md.name}' symbol='${md.symbol}' ${md.decimals ? `decimals=${numToUd(md.decimals)}` : `properties=(~(gas pn *(pset @tas)) ~[${md.properties?.map(p => `%${p}`).join(' ') || ''}])`} supply=${numToUd(md.supply)} cap=${!md.cap || md.cap === '~' ? '~' : `\`${numToUd(Math.max(Number(md.cap), Number(md.supply)))}`} mintable=${md.mintable === 't' ? '&' : '|'} minters=(~(gas pn *(pset address)) ~[${md.minters.join(' ')}]) deployer=${addHexDots(md.deployer)} salt=${numToUd(md.salt)}]`
    }

    await createProject(options as { [key: string]: string })
    if (metadata && options.token !== 'blank') {
      await populateTemplate(options.title!, options.token!, metadata)
    }
    setOptions({})
    setMetadata(generateInitialMetadata([userAddress], userAddress, 'fungible'))
    setStep('title')
    setTimeout(() => {
      if (options?.project === 'contract') {
        setOpenFiles(openFiles.concat([{ project: options.title!, file: options.title! }]))
        nav(`/${options.title}/${options.title}`)
      } else if (options?.project === 'gall') {
        nav(`/${options.title}/${encodeURIComponent(`/app/${options.title}/hoon`)}`)
      }
      setLoading(false)
    }, 500)
  }, [userAddress, nav, createProject, populateTemplate, openFiles, setOpenFiles])

  const onSelect = useCallback((option: string) => async () => {
    switch (step) {
      case 'title':
        if (contracts[options.title!]) {
          window.alert('You already have a project with that name')
          break
        } else if (options.title === 'app' || options.title === 'new') {
          window.alert('You cannot name your project "app" or "new"')
          break
        }
        setStep('project')
        break
      case 'project':
        setOptions({ ...options, project: option as ProjectOption })
        // TODO: if the option is gall-only, then we need to figure out what to show in the next screen

        if (option === 'gall') {
          submitNewProject({ ...options, project: option as ProjectOption })
        } else {
          setStep(option === 'contract' ? 'token' : 'gall')
        }
        break
      case 'gall':
          setOptions({ ...options, project: option as ProjectOption })
          setStep('token')
          break
      case 'token':
        if (option === 'blank') {
          submitNewProject({ ...options, token: option as TokenOption })
        } else {
          setOptions({ ...options, token: option as TokenOption })
          setMetadata(generateInitialMetadata([userAddress], userAddress, option as TokenOption))
          setStep('metadata')
        }
        break
      // TODO: skipping this, we may not want it. Maybe replace with option to input interface(s)
      case 'template':
        if (option === 'issue') {
          setOptions({ ...options, template: option })
          setStep('metadata')
        } else {
          submitNewProject({ ...options, template: option as TemplateOption })
          nav('/')
        }
        break
      default:
        submitNewProject(options, metadata)
        nav('/')
        break
    }
  }, [userAddress, step, setStep, options, setOptions, contracts, submitNewProject, metadata, setMetadata, nav])

  const onBack = useCallback(() => {
    switch (step) {
      case 'title':
        nav('/')
        break
      case 'project':
        setOptions({ ...options, title: '' })
        setStep('title')
        break
      case 'gall':
        setOptions({ ...options, project: undefined })
        setStep('project')
        break
      case 'token':
        setOptions({ ...options, gall: undefined })
        setStep(options.project === 'contract' ? 'project' : 'gall')
        break
      case 'template':
        setOptions({ ...options, token: undefined })
        setStep('token')
        break
      case 'metadata':
        setOptions({ ...options, template: undefined })
        // TODO: skipping template, we may not want it
        setStep('token')
        break
    }
  }, [step, setStep, options, setOptions, nav])

  const renderContent = () => {
    const buttonStyle = {
      width: '48%',
      minWidth: 240,
      height: '60px',
      verticalAlign: 'middle',
      justifyContent: 'center',
    }

    const backButton = <Button style={{ position: 'absolute', left: 0 }} iconOnly onClick={onBack} variant="unstyled" icon={<FaArrowLeft />} />

    if (step === 'title') {
      return (
        <>
          <Row style={{ width: '100%', position: 'relative', justifyContent: 'center' }}>
            {Object.keys(contracts).length > 0 && backButton}
            <h3>Create a Project:</h3>
          </Row>
          <Input
            style={{ width: 240 }}
            onChange={(e) => setOptions({ title: e.target.value?.replace(' ', '').toLowerCase() })}
            value={options.title || ''}
            placeholder="Title (no spaces)"
          />
          <Button variant='dark' style={{ marginTop: 16, width: 240, justifyContent: 'center' }} onClick={onSelect('title')}>
            Next
          </Button>
        </>
      )
    } else if (step === 'project') {
      return (
        <>
          <Row style={{ width: '100%', position: 'relative', justifyContent: 'center' }}>
            {backButton}
            <h3>Select Your Project Type:</h3>
          </Row>
          <Row style={{ flexWrap: 'wrap', width: '100%', justifyContent: 'space-between', marginTop: 12 }}>
            <Button style={{ ...buttonStyle, width: '48%', minWidth: 240 }} onClick={onSelect('contract')}>
              Uqbar Contract
            </Button>
            {/* <Button style={{ ...buttonStyle, width: '48%', minWidth: 240 }} onClick={onSelect('contract-gall')}>
              Uqbar Contract + Gall App
            </Button> */}
            <Button style={{ ...buttonStyle, width: '48%', minWidth: 240 }} onClick={onSelect('gall')}>
              Gall App
            </Button>
          </Row>
        </>
      )
    } else if (step === 'gall') {
      return (
        <>
          <Row style={{ width: '100%', position: 'relative', justifyContent: 'center' }}>
            {backButton}
            <h3>Select Your Gall Template:</h3>
            <h4>(Do we even need this step?)</h4>
          </Row>
          <Row style={{ flexWrap: 'wrap', width: '100%', justifyContent: 'space-between', marginTop: 12 }}>
            <Button style={buttonStyle} onClick={onSelect('gall-app-template')}>
              Blank Template
            </Button>
          </Row>
        </>
      )
    } else if (step === 'token') {
      return (
        <>
          <Row style={{ width: '100%', position: 'relative', justifyContent: 'center' }}>
            {backButton}
            <h3>Select Contract Type:</h3>
          </Row>
          <Row style={{ flexWrap: 'wrap', width: '100%', justifyContent: 'space-between', marginTop: 12 }}>
            <Button style={{ ...buttonStyle, width: '32%', minWidth: 160 }} onClick={onSelect('fungible')}>
              Fungible Token
            </Button>
            <Button style={{ ...buttonStyle, width: '32%', minWidth: 160 }} onClick={onSelect('nft')}>
              Non-Fungible Token (NFT)
            </Button>
            <Button style={{ ...buttonStyle, width: '32%', minWidth: 160 }} onClick={onSelect('blank')}>
              Blank Contract
            </Button>
          </Row>
        </>
      )
    } else if (step === 'template') {
      return (
        <>
          <Row style={{ width: '100%', position: 'relative', justifyContent: 'center' }}>
            {backButton}
            <h3>Select Template Type:</h3>
          </Row>
          <Row style={{ flexWrap: 'wrap', width: '100%', justifyContent: 'space-between', marginTop: 12 }}>
            <Button style={buttonStyle} onClick={onSelect('issue')}>
              Issue New Token
            </Button>
            <Button style={buttonStyle} onClick={onSelect('wrapper')}>
              Wrapper Logic for Token
            </Button>
          </Row>
        </>
      )
    } else {
      return (
        <>
          <Row style={{ width: '100%', position: 'relative', justifyContent: 'center' }}>
            {backButton}
            <h3>Token Info:</h3>
          </Row>
          <MetadataForm metadata={metadata} setMetadata={setMetadata} onSubmit={onSelect('metadata')} />
        </>
      )
    }
  }

  return (
    <Col style={{ position: 'absolute', visibility: hide ? 'hidden' : 'visible', width: '100%', maxWidth: 600, height: '100%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', justifySelf: 'center' }}>
      {renderContent()}
      <LoadingOverlay loading={loading} />
    </Col>
  )
}

export default NewProjectView
