import React, { useCallback, useMemo, useState } from 'react'
import { FaRegPlusSquare, FaRegMinusSquare, FaSave, FaDownload, FaTrash } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import useContractStore from '../../store/contractStore'
import { Project } from '../../types/Project';
import Button from '../form/Button';
import Input from '../form/Input';
import Modal from '../popups/Modal';
import Col from '../spacing/Col'
import Row from '../spacing/Row'
import Text from '../text/Text'
import Link from './Link';

interface FileLinkProps {
  project: string
  file: string
}

const FileLink = ({ project, file }: FileLinkProps) => {
  const { pathname } = useLocation()
  const { currentProject, setCurrentProject, openFile } = useContractStore()
  const isTests = file === 'tests'

  const selectFile = useCallback(() => {
    if (!isTests) {
      openFile(project, file)
    }
    if (project !== currentProject) {
      setCurrentProject(project)
    }
  }, [project, isTests, currentProject, file, openFile, setCurrentProject])

  return (
    <Link onClick={selectFile} underline={pathname === `/${project}/${file}`} href={`/${project}/${file}`} style={{ padding: 2 }}>
      {file}{!isTests ? '.hoon' : ''}
    </Link>
  )
}

interface DirectoryProps {
  project: Project
}

const Directory = ({ project }: DirectoryProps) => {
  const { deleteProject, setProjectExpanded } = useContractStore()
  const buttonStyle = { marginLeft: 6, padding: 2 }

  const { title, libs, expanded } = project
  // TODO: download icon should save all project files in a zip

  return (
    <Col style={{ padding: '0px 4px', fontSize: 14 }}>
      <Row style={{ padding: 2, marginBottom: 2, cursor: 'pointer', justifyContent: 'space-between' }} onClick={() => setProjectExpanded(title, !expanded)}>
        <Row>
          <Button style={buttonStyle} variant="unstyled" iconOnly icon={expanded ? <FaRegMinusSquare size={12} /> : <FaRegPlusSquare size={12} />} />
          <Text style={{ marginLeft: 4, marginBottom: 2, }}>{title}</Text>
        </Row>
        <Row>
          <Button style={buttonStyle} variant="unstyled" iconOnly icon={<FaDownload size={14} />} onClick={() => null} />
          <Button style={buttonStyle} variant="unstyled" iconOnly icon={<FaTrash size={14} />} onClick={() => {
            if (window.confirm(`Are you sure you want to delete the ${title} project?`)) {
              deleteProject(title)
            }
          }} />
        </Row>
      </Row>
      {expanded && (
        <Col style={{ paddingLeft: 28 }}>
          <FileLink project={title} file='main' />
          {Object.keys(libs).map((file) => <FileLink key={file} project={title} file={file} /> )}
          <FileLink project={title} file='tests' />
        </Col>
      )}
    </Col>
  )
}

export const Sidebar = () => {
  const { projects, currentProject, currentApp, openApps, addApp, setCurrentApp, removeApp, saveFile } = useContractStore()
  const [showAppModal, setShowAppModal] = useState(false)
  const [appToAdd, setAppToAdd] = useState('')
  const nav = useNavigate()

  const project = useMemo(() => projects[currentProject], [projects, currentProject])
  const saveFiles = useCallback(() => {

  }, [])

  const buttonStyle = { marginLeft: 6, padding: 2 }

  const buttons = [
    [<FaRegPlusSquare />, () => nav('/new')],
    [<FaSave />, saveFiles],
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
      <Col style={{ width: '100%', height: '70%', overflow: 'scroll' }}>
        <Text style={{ fontSize: 16, fontWeight: 600, padding: '16px 24px' }}>PROJECT EXPLORER</Text>
        <Row style={{ padding: '8px 12px' }}>
          <div style={{ fontSize: 14, padding: 2, marginRight: 6 }}>Projects</div>
          {buttons.map(([icon, onClick]: any, i: number) => (
            <Button key={i} style={buttonStyle} variant="unstyled" onClick={onClick} iconOnly icon={icon} />
          ))}
        </Row>
        {Object.values(projects).map((p) => <Directory key={project.title} project={project} />)}
      </Col>
      <Col style={{ width: '100%', height: 'calc(30% - 1px)', borderTop: '1px solid black', overflow: 'scroll' }}>
        <Row style={{ padding: '8px 12px' }}>
          <div style={{ fontSize: 14, padding: 2, marginRight: 0 }}>Tools</div>
          <Button style={buttonStyle} variant="unstyled" onClick={() => setShowAppModal(true)} iconOnly icon={<FaRegPlusSquare />} />
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
