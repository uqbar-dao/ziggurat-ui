import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FaRegPlusSquare, FaSave, FaFileAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useProjectStore from '../../store/projectStore'
import Button from '../form/Button';
import Input from '../form/Input';
import { Tooltip } from '../popups/Tooltip';
import Modal from '../popups/Modal';
import Col from '../spacing/Col'
import Row from '../spacing/Row'
import Text from '../text/Text'
import { Select } from '../form/Select';
import { displayPubKey } from '../../utils/account';
import { DEFAULT_USER_ADDRESS } from '../../utils/constants';
import { ContractDirectory } from './ContractDirectory';
import { GallAppDirectory } from './GallAppDirectory';

export const Sidebar = () => {
  const { userAddress, contracts, gallApps, currentProject, currentFolder, currentTool, openTools, accounts, importedAccounts,
    addTool, setCurrentTool, removeTool, saveFiles, setUserAddress, addFile } = useProjectStore()
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

  const BUTTON_STYLE = { marginLeft: 6, padding: 2 }

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
    addFile(currentProject, newFile, Boolean(contracts[currentProject]))
    setNewFile('')
    setShowAddFileModal(false)
  }, [contracts, currentProject, newFile, addFile, setNewFile, setShowAddFileModal])

  const userAddresses = useMemo(
    () => accounts.map(({ address }) => address).concat(importedAccounts.map(({ address }) => address)).concat([DEFAULT_USER_ADDRESS]),
    [accounts, importedAccounts]
  )

  return (
    <Col style={{ height: '100%', width: 'calc(100% - 1px)', maxWidth: 239, minWidth: 209, borderRight: '1px solid black' }}>
      <Col style={{ width: '100%', height: '80%', overflowY: 'scroll' }}>
        <Text style={{ fontSize: 16, fontWeight: 600, padding: '16px 24px' }}>PROJECT EXPLORER</Text>
        <Col style={{ margin: '8px 12px' }}>
          <Text style={{ fontSize: 14 }}>Wallet Address</Text>
          <Select style={{ fontSize: 14 }} value={userAddress} onChange={(e) => setUserAddress(e.target.value)}>
            {userAddresses.map(a => <option key={a} value={a}>{displayPubKey(a)}</option>)}
          </Select>
        </Col>
        <Row style={{ padding: '8px 12px' }}>
          <div style={{ fontSize: 14, padding: 2, marginRight: 6 }}>Projects</div>
          {buttons.map(([icon, onClick, tip]: any, i: number) => (
            <Tooltip key={tip} tip={tip}>
              <Button key={i} style={BUTTON_STYLE} variant="unstyled" onClick={onClick} iconOnly icon={icon} />
            </Tooltip>
          ))}
        </Row>
        {Object.values(contracts).map((p) => <ContractDirectory key={p.title} project={p} />)}
        {Object.values(gallApps).map((p) => <GallAppDirectory key={p.title} project={p} />)}
      </Col>
      <Col style={{ width: '100%', height: 'calc(20% - 1px)', borderTop: '1px solid black', overflow: 'scroll' }}>
        <Row style={{ padding: '8px 12px' }}>
          <div style={{ fontSize: 14, padding: 2, marginRight: 0 }}>Tools</div>
          <Button style={BUTTON_STYLE} variant="unstyled" onClick={() => setShowToolModal(true)} iconOnly icon={<FaRegPlusSquare />} />
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
                className="delete"
                style={{ fontSize: 20, marginLeft: 6, marginTop: 4 }}
              >
                &times;
              </Button>
            </Row>
          ))}
        </Col>
      </Col>
      <Modal show={showToolModal} hide={() => setShowToolModal(false)}>
        <h3 style={{ marginTop: 0 }}>Enter App URL (i.e. "webterm"):</h3>
        <Input onChange={(e) => setToolToAdd(e.target.value)} value={toolToAdd} placeholder='app url' autoFocus />
        <Button style={{ margin: '16px auto 0' }} variant='dark' onClick={openTool}>Open App</Button>
      </Modal>
      <Modal show={showAddFileModal} hide={() => setShowAddFileModal(false)} style={{ minWidth: 300 }}>
        <h3 style={{ margin: 0 }}>Add New File</h3>
        <div style={{ marginBottom: 12 }}>(adding to project "{currentProject}")</div>
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
