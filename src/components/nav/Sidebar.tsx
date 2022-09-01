import React, { useCallback, useEffect, useState } from 'react'
import { FaRegPlusSquare, FaRegMinusSquare, FaSave, FaDownload, FaTrash, FaUpload } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import useContractStore from '../../store/contractStore'
import { Project } from '../../types/Project';
import Button from '../form/Button';
import Input from '../form/Input';
import { Tooltip } from '../popups/Tooltip';
import Modal from '../popups/Modal';
import Col from '../spacing/Col'
import Row from '../spacing/Row'
import Text from '../text/Text'
import Link from './Link';
import { DeployModal } from './DeployModal';

interface FileLinkProps {
  project: string
  file: string
}

const BUTTON_STYLE = { marginLeft: 6, padding: 2 }

const FileLink = ({ project, file }: FileLinkProps) => {
  const { pathname } = useLocation()
  const { currentProject, openFiles, setCurrentProject, setOpenFiles, deleteFile } = useContractStore()
  const [showButtons, setShowButtons] = useState(false)
  const isTests = file === 'tests'

  const selectFile = useCallback(() => {
    if (!openFiles.find((of) => of.project === project && of.file === file)) {
      setOpenFiles(openFiles.concat([{ project, file }]))
    }
    if (project !== currentProject) {
      setCurrentProject(project)
    }
  }, [project, currentProject, file, openFiles, setOpenFiles, setCurrentProject])

  return (
    <Row onMouseEnter={() => setShowButtons(true)} onMouseLeave={() => setShowButtons(false)}>
      <Link onClick={selectFile} underline={pathname === `/${project}/${file}`} href={`/${project}/${file}`} style={{ padding: 2 }}>
        {file}{!isTests ? '.hoon' : ''}
      </Link>
      {showButtons && !isTests && file !== project && (
        <Tooltip tip="delete">
          <Button style={BUTTON_STYLE} variant="unstyled" iconOnly icon={<FaTrash size={14} />} onClick={() => deleteFile(project, file)} />
        </Tooltip>
      )}
    </Row>
  )
}

interface DirectoryProps {
  project: Project
}

const Directory = ({ project }: DirectoryProps) => {
  const nav = useNavigate()
  const { deleteProject, setProjectExpanded } = useContractStore()
  const [showButtons, setShowButtons] = useState(false)
  const [showDeployModal, setShowDeployModal] = useState(false)

  const { title, libs, expanded } = project

  // TODO: download icon should save all project files in a zip

  return (
    <Col style={{ padding: '0px 4px', fontSize: 14 }} onMouseEnter={() => setShowButtons(true)} onMouseLeave={() => setShowButtons(false)}>
      <Row style={{ padding: 2, marginBottom: 2, cursor: 'pointer', justifyContent: 'space-between' }} onClick={() => setProjectExpanded(title, !expanded)}>
        <Row>
          <Button style={BUTTON_STYLE} variant="unstyled" iconOnly icon={expanded ? <FaRegMinusSquare size={12} /> : <FaRegPlusSquare size={12} />} />
          <Text style={{ marginLeft: 4, marginBottom: 2, }}>{title}</Text>
        </Row>
        {showButtons && (
          <Row>
            <Tooltip tip="deploy contract" right>
              <Button style={BUTTON_STYLE} variant="unstyled" iconOnly icon={<FaUpload size={14} />} onClick={() => setShowDeployModal(true)} />
            </Tooltip>
            <Tooltip tip="download zip" right>
              <Button style={BUTTON_STYLE} variant="unstyled" iconOnly icon={<FaDownload size={14} />} onClick={() => null} />
            </Tooltip>
            <Tooltip tip="delete" right>
              <Button style={BUTTON_STYLE} variant="unstyled" iconOnly icon={<FaTrash size={14} />} onClick={async () => {
                if (window.confirm(`Are you sure you want to delete the ${title} project?`)) {
                  const navigateTo = await deleteProject(title)
                  if (navigateTo) {
                    nav(`/${navigateTo}/main`)
                  } else if (navigateTo === '') {
                    nav('/')
                  }
                }
              }} />
            </Tooltip>
          </Row>
        )}
      </Row>
      {expanded && (
        <Col style={{ paddingLeft: 28 }}>
          <FileLink project={title} file={title} />
          {Object.keys(libs).map((file) => <FileLink key={file} project={title} file={file} /> )}
          <FileLink project={title} file='tests' />
        </Col>
      )}
      <DeployModal project={title} show={showDeployModal} hide={() => setShowDeployModal(false)} />
    </Col>
  )
}

export const Sidebar = () => {
  const { projects, currentProject, currentApp, openApps, addApp, setCurrentApp, removeApp, saveFiles } = useContractStore()
  const [showAppModal, setShowAppModal] = useState(false)
  const [appToAdd, setAppToAdd] = useState('')
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

  const BUTTON_STYLE = { marginLeft: 6, padding: 2 }

  const buttons = [
    [<FaRegPlusSquare />, () => nav('/new'), 'new project'],
    [<FaSave />, () => saveFiles(currentProject), 'save project'],
  ]

  const openApp = useCallback(() => {
    // TODO: check if app is valid
    if (!openApps.includes(appToAdd)) {
      addApp(appToAdd)
    } else {
      setCurrentApp(appToAdd)
    }
    nav('/app')
    setShowAppModal(false)
    setAppToAdd('')
  }, [appToAdd, addApp, nav, openApps, setCurrentApp])

  const setApp = useCallback((app: string) => {
    setCurrentApp(app)
    nav('/app')
  }, [setCurrentApp, nav])

  return (
    <Col style={{ height: '100%', width: 'calc(100% - 1px)', maxWidth: 239, minWidth: 209, borderRight: '1px solid black' }}>
      <Col style={{ width: '100%', height: '80%', overflowY: 'scroll' }}>
        <Text style={{ fontSize: 16, fontWeight: 600, padding: '16px 24px' }}>PROJECT EXPLORER</Text>
        <Row style={{ padding: '8px 12px' }}>
          <div style={{ fontSize: 14, padding: 2, marginRight: 6 }}>Projects</div>
          {buttons.map(([icon, onClick, tip]: any, i: number) => (
            <Tooltip key={tip} tip={tip}>
              <Button key={i} style={BUTTON_STYLE} variant="unstyled" onClick={onClick} iconOnly icon={icon} />
            </Tooltip>
          ))}
        </Row>
        {Object.values(projects).map((p) => <Directory key={p.title} project={p} />)}
      </Col>
      <Col style={{ width: '100%', height: 'calc(20% - 1px)', borderTop: '1px solid black', overflow: 'scroll' }}>
        <Row style={{ padding: '8px 12px' }}>
          <div style={{ fontSize: 14, padding: 2, marginRight: 0 }}>Tools</div>
          <Button style={BUTTON_STYLE} variant="unstyled" onClick={() => setShowAppModal(true)} iconOnly icon={<FaRegPlusSquare />} />
        </Row>
        <Col>
          {openApps.map(app => (
            <Row key={app} style={{ marginLeft: 14, cursor: 'pointer' }} onClick={() => setApp(app)}>
              <Text style={{ fontSize: 14, textDecoration: app === currentApp ? 'underline' : undefined }}>{app}</Text>
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  removeApp(app)
                }}
                variant='unstyled'
                className="delete"
                style={{ fontSize: 20, marginLeft: 6, marginTop: 4 }}
              >
                &times;
              </Button>
            </Row>
          ))}
        </Col>
      </Col>
      <Modal show={showAppModal} hide={() => {setShowAppModal(false)}}>
        <h3 style={{ marginTop: 0 }}>Enter App URL (i.e. "webterm"):</h3>
        <Input onChange={(e) => setAppToAdd(e.target.value)} value={appToAdd} placeholder='app url' />
        <Button style={{ margin: '16px auto 0' }} variant='dark' onClick={openApp}>Open App</Button>
      </Modal>
    </Col>
  )
}
