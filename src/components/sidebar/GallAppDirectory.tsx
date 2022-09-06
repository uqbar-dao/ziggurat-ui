import React, { useState } from 'react'
import { FaDownload, FaTrash, FaUpload, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useProjectStore from '../../store/projectStore'
import Button from '../form/Button';
import { Tooltip } from '../popups/Tooltip';
import Col from '../spacing/Col'
import Row from '../spacing/Row'
import Text from '../text/Text'
import { PublishModal } from './PublishModal';
import { BUTTON_STYLE, FileLink } from './FileLink';
import { GallApp } from '../../types/GallApp';
import { Folder } from '../../types/Folder';

interface SubDirectoryProps {
  projectTitle: string
  folder: Folder
  indent: number
}

const SubDirectory = ({ projectTitle, folder, indent }: SubDirectoryProps) => {
  const { currentFolder, currentProject, toggleGallFolder, setCurrentFolder } = useProjectStore()

  const { name, expanded, contents } = folder
  const selected = currentFolder === name && currentProject === projectTitle

  return (
    <Col style={{ padding: '0px 4px', fontSize: 14 }} onClick={() => setCurrentFolder(name)}>
      <Row style={{ padding: 2, cursor: 'pointer', justifyContent: 'space-between' }} onClick={(e) => {
        if (!(expanded && !selected))
          toggleGallFolder(projectTitle, name)
      }}>
        <Row>
          <Button onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleGallFolder(projectTitle, name)
          }} variant="unstyled" iconOnly icon={expanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />} />
          <Text style={{ marginLeft: 4, textDecorationLine: selected ? 'underline' : undefined }}>{name}</Text>
        </Row>
      </Row>
      {expanded && (
        <Col style={{ paddingLeft: indent * 9 }}>
          {Object.keys(contents).map((item) => {
            if (typeof item === 'string') {
              return <FileLink key={item} isGall project={projectTitle} file={item} />
            }
            return <SubDirectory key={item} projectTitle={projectTitle} folder={contents[item] as Folder} indent={1} />
          })}
        </Col>
      )}
    </Col>
  )
}

interface GallAppDirectoryProps {
  project: GallApp
}

export const GallAppDirectory = ({ project }: GallAppDirectoryProps) => {
  const nav = useNavigate()
  const { deleteProject, setProjectExpanded, setCurrentProject } = useProjectStore()
  const [showButtons, setShowButtons] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)

  const { title, folder, expanded } = project

  // TODO: download icon should save all project files in a zip

  return (
    <Col style={{ padding: '0px 4px', fontSize: 14 }} onMouseEnter={() => setShowButtons(true)} onMouseLeave={() => setShowButtons(false)} onClick={() => setCurrentProject(title)}>
      <Row style={{ padding: 2, marginBottom: 2, cursor: 'pointer', justifyContent: 'space-between' }} onClick={() => setProjectExpanded(title, !expanded)}>
        <Row>
          <Button style={BUTTON_STYLE} variant="unstyled" iconOnly icon={expanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />} />
          <Text style={{ marginLeft: 4, marginBottom: 2, }}>{title}</Text>
        </Row>
        {showButtons && (
          <Row>
            <Tooltip tip="publish app" right>
              <Button style={BUTTON_STYLE} variant="unstyled" iconOnly icon={<FaUpload size={14} />} onClick={(e) => {e.stopPropagation(); setShowPublishModal(true)}} />
            </Tooltip>
            <Tooltip tip="download zip" right>
              <Button style={BUTTON_STYLE} variant="unstyled" iconOnly icon={<FaDownload size={14} />} onClick={() => null} />
            </Tooltip>
            <Tooltip tip="delete" right>
              <Button style={BUTTON_STYLE} variant="unstyled" iconOnly icon={<FaTrash size={14} />} onClick={async (e) => {
                e.stopPropagation()
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
          {Object.keys(folder.contents).map((item) => {
            if (typeof folder.contents[item] === 'string') {
              return <FileLink isGall key={item} project={title} file={item} />
            }
            return <SubDirectory key={item} projectTitle={title} folder={folder.contents[item] as Folder} indent={1} />
          })}
        </Col>
      )}
      <PublishModal project={title} show={showPublishModal} hide={() => setShowPublishModal(false)} />
    </Col>
  )
}
