import React, { useState } from 'react'
import { FaChevronRight, FaChevronDown, FaTrash, FaUpload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useZigguratStore from '../../stores/zigguratStore'
import { Contract } from '../../types/ziggurat/Contracts';
import Button from '../../components/form/Button';
import { Tooltip } from '../../components/popups/Tooltip';
import Col from '../../components/spacing/Col'
import Row from '../../components/spacing/Row'
import Text from '../../components/text/Text'
import { DeployModal } from './DeployModal';
import { BUTTON_STYLE, FileLink } from './FileLink';

interface ContractDirectoryProps {
  project: Contract
}

export const ContractDirectory = ({ project }: ContractDirectoryProps) => {
  const nav = useNavigate()
  const { deleteProject, setProjectExpanded } = useZigguratStore()
  const [showButtons, setShowButtons] = useState(false)
  const [showDeployModal, setShowDeployModal] = useState(false)

  const { title, libs, expanded } = project

  // TODO: download icon should save all project files in a zip

  return (
    <Col style={{ padding: '0px 4px', fontSize: 14 }} onMouseEnter={() => setShowButtons(true)} onMouseLeave={() => setShowButtons(false)}>
      <Row between style={{ padding: 2, marginBottom: 2, cursor: 'pointer',  }} onClick={() => setProjectExpanded(title, !expanded)}>
        <Row>
          <Button style={BUTTON_STYLE} variant='unstyled' iconOnly icon={expanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />} />
          <Text style={{ marginLeft: 4, marginBottom: 2, }}>{title}</Text>
        </Row>
        {showButtons && (
          <Row>
            <Tooltip tip='deploy contract' right>
              <Button style={BUTTON_STYLE} variant='unstyled' iconOnly icon={<FaUpload size={14} />} onClick={() => setShowDeployModal(true)} />
            </Tooltip>
            {/* 
            <Tooltip tip='download zip' right>
              <Button style={BUTTON_STYLE} variant='unstyled' iconOnly icon={<FaDownload size={14} />} onClick={() => alert('This feature is currently in development.')} />
            </Tooltip> */}
            <Tooltip tip='delete' right>
              <Button style={BUTTON_STYLE} variant='unstyled' iconOnly icon={<FaTrash size={14} />} onClick={async () => {
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
        <Col style={{ paddingLeft: 20 }}>
          <FileLink project={title} file={title} />
          {Object.keys(libs).map((file) => <FileLink key={file} project={title} file={file} /> )}
          <FileLink project={title} file='tests' />
        </Col>
      )}
      <DeployModal project={title} show={showDeployModal} hide={() => setShowDeployModal(false)} />
    </Col>
  )
}
