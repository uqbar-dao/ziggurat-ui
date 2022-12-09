import Link from '../nav/Link'
import logo from '../../assets/img/logo192.png'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FaDownload, FaTrash, FaRegPlusSquare, FaSave, FaFileAlt, FaUpload, FaGithub } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useZigguratStore from '../../stores/zigguratStore'
import Button from '../../components/form/Button';
import Input from '../../components/form/Input';
import { Tooltip } from '../../components/popups/Tooltip';
import Modal from '../../components/popups/Modal';
import Col from '../../components/spacing/Col'
import Row from '../../components/spacing/Row'
import Text from '../../components/text/Text'
import { Select } from '../../components/form/Select';
import { displayPubKey } from '../../utils/account';
import { DEFAULT_USER_ADDRESS } from '../../utils/constants';
import { ProjectDirectory } from './ProjectDirectory';
import { downloadProjectZip } from '../../utils/project';
import { PublishModal } from './PublishModal';
import { DeployModal } from './DeployModal';
import { FileLink } from './FileLink';

import './Sidebar.scss'

const APP_NAMES : { [key: string]: string } = {
  webterm: 'dojo - terminal'
}

export const Sidebar = () => {
  const { userAddress, projects, currentProject, currentFolder, currentTool, openTools, accounts, importedAccounts,
    addTool, setCurrentTool, removeTool, saveFiles, setUserAddress, addFile, setCurrentProject, openFiles, deleteProject } = useZigguratStore()
  const [showToolModal, setShowToolModal] = useState(false)
  const [toolToAdd, setToolToAdd] = useState('')
  const [showAddFileModal, setShowAddFileModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [showDeployModal, setShowDeployModal] = useState(false)
  const [newFile, setNewFile] = useState('')
  const nav = useNavigate()

  useEffect(() => {
    const keydownFunc = (e: any) => {
      if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        e.stopPropagation()
        saveFiles(currentProject)
      }
    }

    document.addEventListener('keydown', keydownFunc)
    return () => document.removeEventListener('keydown', keydownFunc)
  }, [currentProject, saveFiles])

  const project = useMemo(() => projects[currentProject], [currentProject, projects])
  const projectSelected = useMemo(() => Boolean(currentProject), [currentProject])

  const downloadZip = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    downloadProjectZip(project)
  }, [project])

  const onDelete = useCallback(async (e) => {
    e.stopPropagation()

    if (window.confirm(`Are you sure you want to delete the ${currentProject} project?`)) {
      await deleteProject(currentProject)
      const file = openFiles.filter(of => of.project !== currentProject)[0]
      if (file) {
        nav(`/${file.project}/${file.file[0] === '/' ? file.file.slice(1) : file}`)
      } else {
        nav('/')
      }
    }
  }, [currentProject, openFiles, deleteProject, nav])

  const BUTTON_STYLE = { marginRight: 6, padding: 2, marginBottom: -4 }

  const buttons = [
    [<FaRegPlusSquare />, () => nav('/new'), 'new project'],
    [<FaSave />, () => saveFiles(currentProject), 'save project'],
    [<FaFileAlt size={15} />, () => {
      if (currentFolder) {
        setNewFile(`/${currentFolder}/`)
      }
      setShowAddFileModal(true)
    }, 'new file'],
    [<FaUpload size={14} />, (e: any) => {e.stopPropagation(); setShowPublishModal(true)}, 'publish app'],
    [<FaDownload size={14} />, downloadZip, 'download zip'],
    [<FaTrash size={14} />, onDelete, 'delete'],
    /* <Tooltip tip='deploy contract' right>
      <Button style={BUTTON_STYLE} variant='unstyled' iconOnly icon={<FaUpload size={14} />} onClick={() => setShowDeployModal(true)} />
    </Tooltip> */
  ]

  const openTool = useCallback(() => {
    // TODO: check if app is valid
    if (!openTools.includes(toolToAdd)) {
      addTool(toolToAdd)
    } else {
      setCurrentTool(toolToAdd)
    }
    nav('/app')
    setShowToolModal(false)
    setToolToAdd('')
  }, [toolToAdd, addTool, nav, openTools, setCurrentTool])

  const setTool = useCallback((app: string) => {
    setCurrentTool(app)
    nav('/app')
  }, [setCurrentTool, nav])

  const addNewFile = useCallback(() => {
    addFile(currentProject, newFile)
    setNewFile('')
    setShowAddFileModal(false)
  }, [currentProject, newFile, addFile, setNewFile, setShowAddFileModal])

  const userAddresses = useMemo(
    () => accounts.map(({ rawAddress }) => rawAddress).concat(importedAccounts.map(({ rawAddress }) => rawAddress)).concat([DEFAULT_USER_ADDRESS]),
    [accounts, importedAccounts]
  )

  useEffect(() => {
    setUserAddress(userAddresses[0])
  }, [userAddresses, setUserAddress])

  return (
    <Col className='sidebar'>
      <Row className='sidebar-header'>
        <Link title='Home' external href='/apps/ziggurat' className='nav-link logo'>
          <Row>
            {/* <FaArrowLeft className='mr1' /> */}
            <img src={logo} alt='Uqbar Logo' />
          </Row>
        </Link>
        <Text bold mr1>ZIGGURAT</Text>
      </Row>
      <Col className='projects'>
        <Col style={{ margin: '8px 12px' }}>
          <Row>
            <Text small mr1>Wallet:</Text>
            <Select style={{ fontSize: 'smaller' }} value={userAddress} onChange={(e) => setUserAddress(e.target.value)}>
              {userAddresses.map(a => <option key={a} value={a}>{displayPubKey(a)}</option>)}
            </Select>
          </Row>
        </Col>
        <Row style={{ padding: '4px 12px' }}>
          <Text small mr1>Project:</Text>
          <Select style={{ fontSize: 'smaller' }} value={currentProject} onChange={(e) => {setCurrentProject(e.target.value); nav(`/${e.target.value}`)}}>
            <option key='select' value=''>none selected</option>
            {Object.keys(projects).map(title => <option key={title} value={title}>{title}</option>)}
          </Select>
        </Row>
        {project && projectSelected && (
          <>
            <Row style={{ padding: '8px 12px' }}>
              {buttons.map(([icon, onClick, tip]: any, i: number) => (
                <Tooltip key={tip} tip={tip}>
                  <Button key={i} style={BUTTON_STYLE} variant='unstyled' onClick={onClick} iconOnly icon={icon} />
                </Tooltip>
              ))}
            </Row>
            {Object.keys(project.tests || {}).length > 0 && <Row style={{ margin: '0 6px 6px' }}>
              <FileLink key='contract-tests' project={currentProject} file='contract-tests' />
            </Row>}
            <ProjectDirectory project={project} />
          </>
        )}
      </Col>
      <Col className='tools' style={{ width: '100%', height: '20%', borderTop: '1px solid black', overflow: 'auto' }}>
        <Row style={{ padding: '8px 12px' }}>
          <div style={{ fontSize: 14, padding: 2, marginRight: 0 }}>Tools</div>
          <Button style={BUTTON_STYLE} variant='unstyled' onClick={() => setShowToolModal(true)} iconOnly icon={<FaRegPlusSquare />} />
        </Row>
        <Col>
          {openTools.map(app => (
            <Row key={app} style={{ marginLeft: 14, cursor: 'pointer' }} onClick={() => setTool(app)}>
              <Text style={{ fontSize: 14, textDecoration: app === currentTool ? 'underline' : undefined }}>{APP_NAMES[app] || app}</Text>
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  removeTool(app)
                }}
                variant='unstyled'
                className='delete'
                style={{ fontSize: 20, marginLeft: 6 }}
              >
                &times;
              </Button>
            </Row>
          ))}
        </Col>
      </Col>
      <Modal title='Enter App URL (i.e. "webterm"):' show={showToolModal} hide={() => setShowToolModal(false)}>
        <Input onChange={(e) => setToolToAdd(e.target.value)} value={toolToAdd} placeholder='app url' autoFocus />
        <Button style={{ margin: '16px auto 0' }} variant='dark' onClick={openTool}>Open App</Button>
      </Modal>
      <Modal  title='Add New File' show={showAddFileModal} hide={() => setShowAddFileModal(false)} style={{ minWidth: 300 }}>
        <div style={{ marginBottom: 12 }}>(adding to project '{currentProject}')</div>
        <Input onChange={(e) => setNewFile(e.target.value)}
          value={newFile} placeholder='file name'
          label={'Please include the full file path'}
          autoFocus
        />
        <Button fullWidth variant='dark' onClick={addNewFile}>Add</Button>
      </Modal>
      <PublishModal project={currentProject} show={showPublishModal} hide={() => setShowPublishModal(false)} />
      <DeployModal project={currentProject} show={showDeployModal} hide={() => setShowDeployModal(false)} />
    </Col>
  )
}
