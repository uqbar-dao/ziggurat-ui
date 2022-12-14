import React, { useCallback, useState } from 'react'
import { FaArrowLeft, FaGithub, FaUpload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {unzip} from 'unzipit';
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/addon/display/placeholder'
import { Octokit } from 'octokit'
import pWaterfall from 'p-waterfall'

import Button from '../../components/form/Button'
import Col from '../../components/spacing/Col'
import Row from '../../components/spacing/Row'
import Text from '../../components/text/Text'
import useZigguratStore from '../../stores/zigguratStore';
import Input from '../../components/form/Input';
import { generateInitialMetadata } from '../../utils/fungible';
import { MetadataForm } from '../../components-zig/forms/MetadataForm';
import LoadingOverlay from '../../components/popups/LoadingOverlay';
import { METADATA_GRAIN_ID, MY_CONTRACT_ID } from '../../utils/constants';
import { numToUd } from '../../utils/number';
import { addHexDots } from '../../utils/format';
import { RawMetadata } from '../../types/ziggurat/Metadata';
import Form from '../../components/form/Form';
import { Select } from '../../components/form/Select';
import Divider from '../../components/spacing/Divider';
import useSessionStorage from '../../hooks/useSessionStorage';
import Modal from '../../components/popups/Modal';

import './NewProjectView.scss'
import useDocumentTitle from '../../hooks/useDocumentTitle';

type CreationStep = 'title' | 'project' | 'token' | 'template' | 'metadata' | 'import' | 'github' | 'zip'
type ProjectOption = 'contract' | 'gall' | 'contract-gall'
type TokenOption = 'fungible' | 'nft' | 'blank'
type TemplateOption = 'issue' | 'wrapper'
type ImportOption = 'github' | 'upload'
export interface CreationOptions {
  title?: string
  project?: ProjectOption
  token?: TokenOption
  template?: TemplateOption
  gall?: string
  import?: ImportOption
}

export interface RepoInfo {
  owner: {
    login: string
  }
  name: string
}

export interface RepoContents {
  size: number
}

export interface TreeFile { 
  mode: string
  path: string
  sha: string
  size: number
  type: string
  url: string
}

export interface DownloadedFile {
  type: string
  path: string
  content: string
}

const NewProjectView = ({ hide = false }: { hide?: boolean }) => {
  const { zigguratTitleBase, loading, setLoading, userAddress, saveFileList, projects, createProject } = useZigguratStore()
  const nav = useNavigate()

  const [step, setStep] = useState<CreationStep>('title')
  const [options, setOptions] = useState<CreationOptions>({ title: '' })
  // TODO: get default minter from the wallet and then figure out the default deployer
  const [metadata, setMetadata] = useState<RawMetadata>(generateInitialMetadata([userAddress], userAddress, 'fungible'))
  const [repoUrl, setRepoUrl] = useState('')
  const [repos, setRepos] = useState<RepoInfo[]>([])
  const [githubToken, setGithubToken] = useState('')
  const [repoContents, setRepoContents] = useState<RepoContents>()
  const [zip, setZip] = useState<any>()
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [disableInfoModal, setDisableInfoModal] = useSessionStorage<boolean>('disableInfoModal', false)

  const hideInfoModal = useCallback(() => {
    setShowInfoModal(false)
    nav(`/${options.title || ''}`)
    setOptions({})
  }, [options, setShowInfoModal, nav, setOptions])

  const authWithGithub = async (token: string) => {
    setLoading('Fetching repositories...')
    try {
      const o = new Octokit({ auth: token })
      let _repos: any[] = []
      let result: any = await o.request('GET /user/repos', { per_page: 100 })
      let page = 1
      console.log ({ page, result })
      if (result && result.data && result.data.length > 0) {
        _repos = [...result.data]
        
        setLoading(`Fetching repositories (${_repos.length} so far)...`)

        // if more than 100 repos, we need to make more requests until last page
        while (true) {
          page += 1

          try {
            result = await o.request('GET /user/repos', { page, per_page: 100 })
          } catch {
            break
          }

          console.log ({ page, result })
          if (result && result.data && result.data.find((r: any) => !_repos.includes(r))) 
            _repos = [..._repos, ...result.data]
          else break

          setLoading(`Fetching repositories (${_repos.length} so far)...`)
        }

        setRepos(_repos)
      }
    } catch (e) {
      alert('Unable to fetch repositories from Github. Please check your API key is correct and has repo access to your account.')
    } finally {
      setLoading('')
    }
  }

  const getRepoContents = async (ownerRepo: string) => {
    setLoading('Fetching repo contents...')
    try {
      const o = new Octokit({ auth: githubToken })
      const result: any = await o?.request(`GET /repos/${ownerRepo}`)
      console.log('repo contents:', result)
      setRepoContents(result.data)
    } catch {
      setRepoContents(undefined)
      alert('Unable to fetch repository data. Is the repo private? Please add an API key with `repo` access to get a private repository.')
    } finally {
      setLoading('')
    }
  }

  const downloadFilesFromGithub = async () => {
    await submitNewProject({ ...options, project: 'gall' }, undefined, false)
    
    setLoading('Gathering file data...')
    let result: any = ''
    const o = new Octokit({ auth: githubToken })
    try {
      result = await o.request(`GET /repos/${repoUrl}/git/trees/master`, {
        recursive: true
      })

      if (!result || !result.data || !result.data.tree) {
        throw new Error('Bad result: ' + JSON.stringify(result))
      }
    } catch {
     
    }

    if (!result) {
      alert('Unable to gather file data. Please verify your Github access token has the correct permissions.')
      setLoading('')
      return
    }

    const filesToDownload = result.data.tree
    .filter((branch: TreeFile) => branch.type === 'blob')
    // import mar files first to avoid crashes when creating odd files
    .sort((a: TreeFile, b: TreeFile) => a.path.match(/[/\\]?mar[/\\]/) ? -1 : 1)

    console.log({ filesToDownload })

    let lastFile = ''
    let downloadedFiles: DownloadedFile[] = []
    try {
      setLoading(`Downloading files from Github...`)
      
      await pWaterfall(filesToDownload.map((file: TreeFile, i: number) => async () => {
        lastFile = file.path
        setLoading(`Downloading files... (${i}/${filesToDownload.length})`)
        const { data: { content, path } } = await o.request(`GET /repos/${repoUrl}/contents/${file.path}`)
        const text = Buffer.from(content, 'base64').toString()
        const type = path.replace(/.*\//g, '')
        const filePath = path[0] === '/' ? path.replace(/\./g, '/') : `/${path.replace(/\./g, '/')}`
        downloadedFiles.push({ path: filePath, content: text, type })
      }))
    } catch {
      alert(`Unable to download files. Halted at ${lastFile}`)
      setLoading('')
      return
    }

    setLoading('')
    await saveFileList(downloadedFiles, options.title!)
  }

  const importZip = async () => {
    await submitNewProject({ ...options, project: 'gall' }, undefined, false)
    
    const { entries } = await unzip(zip)
    const filesToImport = []
    
    for (const [name, entry] of Object.entries(entries)) {
      if (entry.isDirectory) continue

      // replace all . with / and ensure path starts with /
      let path = name[0] === '/' ? name.replace(/\./g, '/') : `/${name.replace(/\./g, '/')}`

      // for zips with a single top level dir, remove the dir from path
      if (path.match('^/'+zip.name.replace('.zip', ''))) {
        path = path.replace(/.+?\//, '/')
      }

      // filetype is all of the chars after the last /
      const type = path.replace(/.*\//g, '')
      const content = await entry.text()
      filesToImport.push({ path, content, type })
    }

    // import mar files first to avoid crashes when creating odd files
    filesToImport.sort((a, b) => a.path.match(/[/\\]?mar[/\\]/) ? -1 : 1)

    console.log({ filesToImport })
    await saveFileList(filesToImport, options.title!)
    setLoading('')
  }

  const submitNewProject = useCallback(async (options: CreationOptions, md?: RawMetadata, navOnFinish?: boolean) => {
    setLoading('Submitting project...')

    const metadata = !md ? undefined : {
      id: METADATA_GRAIN_ID,
      source: MY_CONTRACT_ID,
      holder: MY_CONTRACT_ID,
      town: '0x0',
      label: 'token-metadata',
      salt: Number(md.salt),
      // "noun": "[%foonft %foo (make-pset `(list @tas)`~[%hat %eyes]) 1 ~ %.y ~ 0x1234.5678 `@`%foonft-salt]"}}}}
      noun: `[name='${md.name}' symbol='${md.symbol}' ${md.decimals ? `decimals=${numToUd(md.decimals)}` : `properties=(~(gas pn *(pset @tas)) ~[${md.properties?.map(p => `%${p}`).join(' ') || ''}])`} supply=${numToUd(md.supply)} cap=${!md.cap || md.cap === '~' ? '~' : `\`${numToUd(Math.max(Number(md.cap), Number(md.supply)))}`} mintable=${md.mintable === 't' ? '&' : '|'} minters=(~(gas pn *(pset address)) ~[${md.minters.join(' ')}]) deployer=${addHexDots(md.deployer)} salt=${numToUd(md.salt)}]`
    }

    await createProject(options as { [key: string]: string })
    // if (metadata && options.token !== 'blank') {
    //   await populateTemplate(options.title!, options.token!, metadata)
    // }
    setMetadata(generateInitialMetadata([userAddress], userAddress, 'fungible'))
    setStep('title')

    const shouldShowInfoModal = !disableInfoModal && true
    setShowInfoModal(shouldShowInfoModal)

    if (!shouldShowInfoModal) {
      hideInfoModal()
    }

    setLoading('')
  }, [userAddress, disableInfoModal, createProject, setLoading, setShowInfoModal, hideInfoModal])

  const onSelect = useCallback((option: string) => async () => {
    switch (step) {
      case 'title':
        if (projects[options.title!]) {
          window.alert('You already have a project with that name')
          break
        } else if (['new', 'app', 'nft', 'fungible'].indexOf(options.title!)>-1) {
          window.alert('You cannot name your project a reserved title.')
          break
        }
        setStep('project')
        break
      case 'project':
        setOptions({ ...options, project: option as ProjectOption })
        // TODO: if the option is gall-only, then we need to figure out what to show in the next screen

        if (option === 'gall') {
          submitNewProject({ ...options, project: option as ProjectOption })
        } else if (option === 'contract') {
          setStep('token')
        } else if (option === 'import') {
          setStep('import')
        }
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
      case 'import':
        setOptions({ ...options, import: option as ImportOption })
        if (option === 'github') {
          setStep('github')
        }
        if (option === 'zip') {
          setStep('zip')
        }
        break
      // TODO: skipping this, we may not want it. Maybe replace with option to input interface(s)
      case 'template':
        if (option === 'issue') {
          setOptions({ ...options, template: option })
          setStep('metadata')
        } else {
          submitNewProject({ ...options, template: option as TemplateOption })
        }
        break
      default:
        submitNewProject(options, metadata)
        break
    }
  }, [userAddress, step, setStep, options, setOptions, projects, submitNewProject, metadata, setMetadata])

  const onBack = useCallback(() => {
    switch (step) {
      case 'title':
        nav('/')
        break
      case 'project':
        setOptions({ ...options, title: '' })
        setStep('title')
        break
      case 'import':
        setOptions({ ...options, project: undefined })
        setStep('project')
        break
      case 'github':
        setOptions({ ...options, import: undefined })
        setStep('import')
        break
      case 'zip':
        setOptions({ ...options, import: undefined })
        setStep('import')
        break
      case 'token':
        setOptions({ ...options, gall: undefined })
        setStep('project')
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

  const repoDataFetchingButtons =  <Row>
    <Button wide className='mt1 mr1' type='button' 
      disabled={!Boolean(repoUrl)}
      onClick={() => getRepoContents(repoUrl)}
    >
        Fetch repo data
    </Button>
    <Button wide variant='dark' className='mt1' type='button'
      disabled={!Boolean(repoContents)}
      onClick={() => {
        downloadFilesFromGithub()
      }}>
      Import {repoContents ? 
        repoContents.size > 1000 ? 
          repoContents.size > 1000000 ? 
            `(${repoContents.size/1000000} GB)`
            : `(${repoContents.size/1000} MB)`
          : `(${repoContents.size} KB)`
        : ''
      }
    </Button>
  </Row>

  const renderContent = () => {
    const twoButtonStyle = {
      width: '48%',
      height: '60px',
      verticalAlign: 'middle',
      justifyContent: 'center',
    }
    
    const threeButtonStyle = {
      width: '31%',
      height: '60px',
      verticalAlign: 'middle',
      justifyContent: 'center',
    }

    const backButton = <Button style={{ position: 'absolute', left: 0 }} iconOnly onClick={onBack} variant="unstyled" icon={<FaArrowLeft />} />

    if (step === 'title') {
      return (
        <>
          <Row style={{ width: '100%', position: 'relative', justifyContent: 'center' }}>
            {Object.keys(projects).length > 0 && backButton}
            <h3>Create a Project:</h3>
          </Row>
          <Input
            style={{ width: 240 }}
            onChange={(e) => setOptions({ title: e.target.value?.replace(' ', '').toLowerCase() })}
            value={options.title || ''}
            placeholder="Title (no spaces)"
          />
          <Button disabled={!Boolean(options.title)} variant='dark' style={{ marginTop: 16, width: 240, justifyContent: 'center' }} onClick={onSelect('title')}>
            Next
          </Button>
        </>
      )
    } else if (step === 'project') {
      return (
        <>
          <Row style={{ width: '100%', position: 'relative', justifyContent: 'center' }}>
            {backButton}
            <h3>Project Source:</h3>
          </Row>
          <Row between style={{ flexWrap: 'wrap', width: '100%', marginTop: 12 }}>
            <Button style={twoButtonStyle} onClick={onSelect('contract')}>
              Uqbar Template
            </Button>
            <Button style={twoButtonStyle} onClick={onSelect('import')}>
              Import a Project
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
          <Row between style={{ flexWrap: 'wrap', width: '100%', marginTop: 12 }}>
            <Button style={threeButtonStyle} onClick={onSelect('fungible')}>
              Fungible Token
            </Button>
            <Button style={threeButtonStyle} onClick={onSelect('nft')}>
              Non-Fungible Token (NFT)
            </Button>
            <Button style={threeButtonStyle} onClick={onSelect('blank')}>
              Blank Contract
            </Button>
          </Row>
        </>
      )
    } else if (step === 'import') {
      return (
        <>
          <Row style={{ width: '100%', position: 'relative', justifyContent: 'center' }}>
            {backButton}
            <h3>Select Import Type:</h3>
          </Row>
          <Row between style={{ flexWrap: 'wrap', width: '100%',  marginTop: 12 }}>
            <Button style={twoButtonStyle} onClick={onSelect('github')}>
              <Row> <FaGithub fontSize='xx-large' className='mr1' /> Import from Github </Row>
            </Button>
            <Button style={twoButtonStyle} onClick={onSelect('zip')}>
              <Row> <FaUpload fontSize='xx-large' className='mr1' /> Upload .zip file </Row>
            </Button>
          </Row>
        </>
      )
    } else if (step === 'github') {
      return (
        <>
          {!repos.length && <>
            <h3>Github API key:</h3>
            <Form style={{ borderRadius: 4, alignItems: 'center' }}
                onSubmit={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  const token = (e.target as any).apitoken.value
                  setGithubToken(token)
                  authWithGithub(token)
                }}
              >
              <Input
                name='apitoken'
                containerStyle={{ marginTop: 8 }}
                style={{ width: 300 }}
                label='Github API key with `repo` access:'
                placeholder='ghp_abc123XYZ...'
                type='password'
                onChange={() => {
                  setRepoUrl('')
                  setRepoContents(undefined)
                }}
              />
              <Button variant='dark' type="submit" style={{ margin: '16px 0px 8px', width: '100%', justifyContent: 'center' }}>
                Fetch private repos
              </Button>
            </Form>
            <Divider className='mt1'/>
          </>}
          <h3>Github username/repo:</h3>
          <Row style={{ width: '100%', position: 'relative', justifyContent: 'center' }}>
            {backButton}
            <Form style={{ borderRadius: 4, paddingBottom: 16, alignItems: 'center' }}
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                getRepoContents(repoUrl)
              }}
            > <Row>
                <Text>github.com/</Text>
                <Input
                  style={{ width: 300 }}
                  onChange={(e) => {
                    const val = e.target.value
                    setRepoUrl(val)
                    setRepoContents(undefined)
                  }}
                  placeholder='username/repo' />
              </Row>
              {repoDataFetchingButtons}
            </Form>
          </Row>
          {repos.length > 0 && <Divider className='mt1' />}
          {repos.length > 0 && <>
            <h3>Private repos ({repos.length}):</h3>
            <Form style={{ borderRadius: 4, alignItems: 'center', padding: 16 }}>
              <Select name='repo' required onChange={(e) => {
                setRepoUrl(e.target.value)
                setRepoContents(undefined)
              }}>
                <option>Select a repo...</option>
                {repos.map((r:any, i)=> (
                  <option key={i} value={`${r.owner.login}/${r.name}`}>
                    {r.owner.login}/{r.name}
                  </option>
                ))}
              </Select>
              {repoDataFetchingButtons}
            </Form>
          </>}
        </>
      )
    } else if (step === 'zip') {
      return (
        <>
          <Row style={{ width: '100%', position: 'relative', justifyContent: 'center' }}>
            {backButton}
            <h3>Upload zip:</h3>
          </Row>
          <Form>
            <Input type='file' name='zip' label='Upload .zip archive' onChange={(e) => {
              setZip(e.target.files? e.target.files[0] : null)
            }} />
            <Button disabled={!Boolean(zip)} fullWidth variant='dark' className='mt1' onClick={(e) => {
              e.preventDefault()
              importZip()
            }}>
              Import zip
            </Button>
          </Form>
        </>
      )
    } else if (step === 'template') {
      return (
        <>
          <Row style={{ width: '100%', position: 'relative', justifyContent: 'center' }}>
            {backButton}
            <h3>Select Template Type:</h3>
          </Row>
          <Row between style={{ flexWrap: 'wrap', width: '100%', marginTop: 12 }}>
            <Button style={threeButtonStyle} onClick={onSelect('issue')}>
              Issue New Token
            </Button>
            <Button style={threeButtonStyle} onClick={onSelect('wrapper')}>
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
          <MetadataForm isNft={options.token === 'nft'} metadata={metadata} setMetadata={setMetadata} onSubmit={onSelect('metadata')} />
        </>
      )
    }
  }

  useDocumentTitle(`${zigguratTitleBase} New Project`)
  return (
    <Col style={{ position: 'absolute', visibility: hide ? 'hidden' : 'visible', width: '100%', maxWidth: 600, height: '100%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', justifySelf: 'center' }}>
      {renderContent()}
      <LoadingOverlay loading={Boolean(loading)} text={loading} />
      <Modal show={showInfoModal} hide={hideInfoModal}>
        <Col style={{ maxWidth: 380 }}>
          <p>
            Your project is now in the lefthand sidebar!<br /><br />
            Your app file is located in the 'app' directory and<br />
            your contract files are located in the 'con' directory.
          </p>
          <Row onClick={() => setDisableInfoModal(!disableInfoModal)} style={{ cursor: 'pointer' }}>
            <Input
              type="checkbox"
              value={disableInfoModal ? 'true' : undefined}
              onChange={(e) => {
                e.stopPropagation()
                setDisableInfoModal(!disableInfoModal)
              }}
              style={{ marginLeft: 0, marginRight: 8 }}
            />
            <Text>Don't show this message again</Text>
          </Row>
          <Button variant='dark' onClick={hideInfoModal} style={{ width: 200, margin: '24px auto 0' }}>OK</Button>
        </Col>
      </Modal>
    </Col>
  )
}

export default NewProjectView
