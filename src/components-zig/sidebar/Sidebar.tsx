import Link from '../nav/Link'
import logo from '../../assets/img/logo192.png'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FaRegPlusSquare, FaSave, FaFileAlt, FaArrowLeft } from 'react-icons/fa';
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
import { ContractDirectory } from './ContractDirectory';
import { GallAppDirectory } from './GallAppDirectory';

import './Sidebar.scss'

export const Sidebar = () => {
  const { userAddress, contracts, gallApps, currentProject, currentFolder, currentTool, openTools, accounts, importedAccounts,
    addTool, setCurrentTool, removeTool, saveFiles, setUserAddress, addFile } = useZigguratStore()
  const [showToolModal, setShowToolModal] = useState(false)
  const [toolToAdd, setToolToAdd] = useState('')
  const [showAddFileModal, setShowAddFileModal] = useState(false)
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

  const BUTTON_STYLE = { marginLeft: 6, padding: 2, marginBottom: -4 }

  const isGall = useMemo(() => Boolean(gallApps[currentProject]), [gallApps, currentProject])

  const buttons = [
    [<FaRegPlusSquare />, () => nav('/new'), 'new project'],
    [<FaSave />, () => saveFiles(currentProject), 'save project'],
    [<FaFileAlt size={15} />, () => {
      if (isGall) {
        setNewFile(`/${currentFolder}/`)
      }
      setShowAddFileModal(true)
    }, 'new file'],
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
    addFile(currentProject, newFile, Boolean(gallApps[currentProject]))
    setNewFile('')
    setShowAddFileModal(false)
  }, [gallApps, currentProject, newFile, addFile, setNewFile, setShowAddFileModal])

  const userAddresses = useMemo(
    () => accounts.map(({ address }) => address).concat(importedAccounts.map(({ address }) => address)).concat([DEFAULT_USER_ADDRESS]),
    [accounts, importedAccounts]
  )

  return (
    <Col className='sidebar'>
      <Col className='projects'>
        <Row className='sidebar-header'>
          <Link title='Home' external href='/apps/ziggurat' className='nav-link logo'>
            <Row>
              <FaArrowLeft className='mr1' />
              <img src={logo} alt='Uqbar Logo' />
            </Row>
          </Link>
          <Text bold mr1>ZIGGURAT</Text>
        </Row>
        <Col style={{ margin: '8px 12px' }}>
          <Row>
            <Text small mr1>Wallet Address</Text>
            <Select style={{ fontSize: 'smaller' }} value={userAddress} onChange={(e) => setUserAddress(e.target.value)}>
              {userAddresses.map(a => <option key={a} value={a}>{displayPubKey(a)}</option>)}
            </Select>
          </Row>
        </Col>
        <Row style={{ padding: '8px 12px' }}>
          <Text small mr1>Projects</Text>
          {buttons.map(([icon, onClick, tip]: any, i: number) => (
            <Tooltip key={tip} tip={tip}>
              <Button key={i} style={BUTTON_STYLE} variant='unstyled' onClick={onClick} iconOnly icon={icon} />
            </Tooltip>
          ))}
        </Row>
        {Object.values(contracts).map((p) => <ContractDirectory key={p.title} project={p} />)}
        {Object.values(gallApps).map((p) => <GallAppDirectory key={p.title} project={p} />)}
      </Col>
      <Col className='tools' style={{ width: '100%', height: 'calc(20% - 1px)', borderTop: '1px solid black', overflow: 'auto' }}>
        <Row style={{ padding: '8px 12px' }}>
          <div style={{ fontSize: 14, padding: 2, marginRight: 0 }}>Tools</div>
          <Button style={BUTTON_STYLE} variant='unstyled' onClick={() => setShowToolModal(true)} iconOnly icon={<FaRegPlusSquare />} />
        </Row>
        <Col>
          {openTools.map(app => (
            <Row key={app} style={{ marginLeft: 14, cursor: 'pointer' }} onClick={() => setTool(app)}>
              <Text style={{ fontSize: 14, textDecoration: app === currentTool ? 'underline' : undefined }}>{app}</Text>
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
          label={isGall ? 'Please include the full file path' : undefined}
          autoFocus
        />
        <Button style={{ margin: '16px auto 0', width: '100%' }} variant='dark' onClick={addNewFile}>Add</Button>
      </Modal>
    </Col>
  )
}
