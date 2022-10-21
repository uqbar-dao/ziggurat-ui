import React, { useCallback, useEffect, useState } from 'react'
import { FaArrowLeft, FaExclamationTriangle, FaGithub, FaInfoCircle, FaRuler } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {unzip} from 'unzipit';
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/addon/display/placeholder'
import { Octokit } from 'octokit'
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

import './NewProjectView.scss'
import Form from '../../components/form/Form';
import { Select } from '../../components/form/Select';
import { stellarGetAddress } from '@trezor/connect/lib/types/api/stellarGetAddress';
import Divider from '../../components/spacing/Divider';

type CreationStep = 'title' | 'project' | 'gall' | 'token' | 'template' | 'metadata' | 'import' | 'github' | 'zip'
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
  const { userAddress, approveCorsDomain, contracts, createProject, populateTemplate, openFiles, setOpenFiles, addFile } = useZigguratStore()
  const nav = useNavigate()

  const [step, setStep] = useState<CreationStep>('title')
  const [options, setOptions] = useState<CreationOptions>({ title: '' })
  // TODO: get default minter from the wallet and then figure out the default deployer
  const [metadata, setMetadata] = useState<RawMetadata>(generateInitialMetadata([userAddress], userAddress, 'fungible'))
  const [loadingText, setLoadingText] = useState('')
  const [repoUrl, setRepoUrl] = useState('')
  const [repos, setRepos] = useState<RepoInfo[]>([])
  const [githubToken, setGithubToken] = useState('')
  const [repoContents, setRepoContents] = useState<RepoContents>()

  // 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
  
  const authWithGithub = async (token: string) => {
    setLoadingText('Fetching repositories...')
    try {
      const o = new Octokit({ auth: token })
      let _repos: any[] = []
      let result: any = await o.request('GET /user/repos', { per_page: 100 })
      let page = 1
      console.log ({ page, result })
      if (result && result.data && result.data.length > 0) {
        _repos = [...result.data]
        
        setLoadingText(`Fetching repositories (${_repos.length} so far)...`)

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

          setLoadingText(`Fetching repositories (${_repos.length} so far)...`)
        }

        setRepos(_repos)
      }
    } catch (e) {
      alert('Unable to fetch repositories from Github. Please check your API key is correct and has repo access to your account.')
    } finally {
      setLoadingText('')
    }
  }

  const getRepoContents = async (ownerRepo: string) => {
    setLoadingText('Fetching repo contents...')
    try {
      const o = new Octokit({ auth: githubToken })
      const result: any = await o?.request(`GET /repos/${ownerRepo}`)
      console.log('repo contents:', result)
      setRepoContents(result.data)
    } catch {
      setRepoContents(undefined)
      alert('Unable to fetch repository data. Is the repo private? Please add an API key with `repo` access to get a private repository.')
    } finally {
      setLoadingText('')
    }
  }

  const downloadFiles = async () => {
    const proj = await submitNewProject({ ...options, project: 'gall' }, undefined, false)
    
    setLoadingText('Gathering file data...')
    let result: any = ''
    const o = new Octokit({ auth: githubToken })
    try {
      result = await o.request(`GET /repos/${repoUrl}/git/trees/master`, {
        recursive: true
      })
      console.log(1, { result })

      if (!result || !result.data || !result.data.tree) {
        throw 'Bad result: ' + JSON.stringify(result)
      }
    } catch {
      alert('Unable to gather file data.')
      setLoadingText('')
      return
    }

    let _downloadedFiles: DownloadedFile[] = []
    try {
      setLoadingText(`Downloading files...`)
    
      await Promise.allSettled(result.data.tree
        .filter((branch: TreeFile) => branch.type == 'blob')
        .map(async (file: TreeFile, i: number) => {
          const { data: { content, path } } = await o.request(`GET /repos/${repoUrl}/contents/${file.path}`)
          const text = Buffer.from(content, 'base64').toString()
          
          console.log(2, { title: options.title!, path, text })
          
          await addFile(options.title!, path, true, text)
      }))

      console.log(3, { _downloadedFiles })
    } catch {
      alert(`Unable to download files. Halted at ${_downloadedFiles.length}/${result.data.tree.length}`)
      setLoadingText('')
      return
    }

    let _savedFiles: any[] = []
    try {
      setLoadingText(`Saving files...`)
      
      await Promise.allSettled(_downloadedFiles.map(async (file, i) => {
        console.log ({ file })
        const addedFile = await addFile(options.title!, file.path, true, file.content)
      }))
    } catch {
      alert(`Unable to save files. Halted at ${_savedFiles.length}/${_downloadedFiles.length}`)
      setLoadingText('')
      return
    }

    setLoadingText('')
    nav(`/${options.title!}/${options.title!}`)
  }

  const submitNewProject = useCallback(async (options: CreationOptions, md?: RawMetadata, navOnFinish?: boolean) => {
    setLoadingText('Submitting project...')

    const metadata = !md ? undefined : {
      id: METADATA_GRAIN_ID,
      holder: MY_CONTRACT_ID,
      lord: MY_CONTRACT_ID,
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
        if (navOnFinish) nav(`/${options.title}/${options.title}`)
      } else if (options?.project === 'gall') {
        if (navOnFinish) nav(`/${options.title}/${encodeURIComponent(`/app/${options.title}/hoon`)}`)
      }
      setLoadingText('')
    }, 500)
  }, [userAddress, nav, createProject, populateTemplate, openFiles, setOpenFiles])

  const onSelect = useCallback((option: string) => async () => {
    switch (step) {
      case 'title':
        if (contracts[options.title!]) {
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
      case 'import':
        setOptions({ ...options, import: option as ImportOption })
        if (option === 'github') {
          setStep('github')
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
      case 'import':
        setOptions({ ...options, project: undefined })
        setStep('project')
        break
      case 'github':
        setOptions({ ...options, import: undefined })
        setStep('import')
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
          <Row between style={{ flexWrap: 'wrap', width: '100%', marginTop: 12 }}>
            <Button style={{ ...buttonStyle }} onClick={onSelect('contract')}>
              Uqbar Contract
            </Button>
            {/* <Button style={{ ...buttonStyle, width: '48%', minWidth: 240 }} onClick={onSelect('contract-gall')}>
              Uqbar Contract + Gall App
            </Button> */}
            <Button style={{ ...buttonStyle }} onClick={onSelect('gall')}>
              Gall App
            </Button>
            <Button style={{ ...buttonStyle }} onClick={onSelect('import')}>
              Import a Project
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
          <Row between style={{ flexWrap: 'wrap', width: '100%', marginTop: 12 }}>
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
          <Row between style={{ flexWrap: 'wrap', width: '100%', marginTop: 12 }}>
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
    } else if (step === 'import') {
      return (
        <>
          <Row style={{ width: '100%', position: 'relative', justifyContent: 'center' }}>
            {backButton}
            <h3>Select Import Type:</h3>
          </Row>
          <Row between style={{ flexWrap: 'wrap', width: '100%',  marginTop: 12 }}>
            <Button style={{ ...buttonStyle, width: '48%', minWidth: 160 }} onClick={onSelect('github')}>
              <Row> <FaGithub fontSize='xx-large' className='mr1' /> Import from Github </Row>
            </Button>
            <label style={{ width: '48%', minWidth: 160 }}>
              <input hidden type='file' />
              <Button style={{ pointerEvents: 'none', cursor: 'pointer', ...buttonStyle, width: '100%', minWidth: 160 }}>
                Upload .zip file
              </Button>
            </label>
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
                Fetch personal repos
              </Button>
            </Form>
            <Divider className='mt1'/>
          </>}
          <h3>Github username/repo:</h3>
          <Row style={{ width: '100%', position: 'relative', justifyContent: 'center' }}>
            {backButton}
            <Form style={{ borderRadius: 4, alignItems: 'center' }}
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                alert(repoUrl)
              }}
            > <Row>
                <Text>github.com/</Text>
                <Input
                  style={{ width: 300 }}
                  onChange={(e) => {
                    setRepoUrl(e.target.value)
                    setRepoContents(undefined)
                  }}
                  placeholder='username/repo'
                  autoFocus />
              </Row>
            </Form>
          </Row>
          {repos.length > 0 && <Divider className='mt1' />}
          {repos.length > 0 && <>
            <h3>Personal repos ({repos.length}):</h3>
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
              <Row>
                <Button wide className='mt1 mr1' type='button' 
                  disabled={!Boolean(repoUrl)}
                  onClick={() => getRepoContents(repoUrl)}
                >
                    Fetch repo data
                </Button>
      {/* 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 */}
                <Button wide variant='dark' className='mt1' type='button'
                  disabled={!Boolean(repoContents)}
                  onClick={() => {
                    downloadFiles()
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
            </Form>
          </>}
        </>
      )
    } else if (step === 'zip') {
    } else if (step === 'template') {
      return (
        <>
          <Row style={{ width: '100%', position: 'relative', justifyContent: 'center' }}>
            {backButton}
            <h3>Select Template Type:</h3>
          </Row>
          <Row between style={{ flexWrap: 'wrap', width: '100%', marginTop: 12 }}>
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
      <LoadingOverlay loading={Boolean(loadingText)} text={loadingText} />
    </Col>
  )
}

export default NewProjectView
