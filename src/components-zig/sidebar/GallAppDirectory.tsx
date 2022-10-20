import React, { useCallback, useState } from 'react'
import { FaDownload, FaTrash, FaUpload, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import useZigguratStore from '../../stores/zigguratStore'
import Button from '../../components/form/Button';
import { Tooltip } from '../../components/popups/Tooltip';
import Col from '../../components/spacing/Col'
import Row from '../../components/spacing/Row'
import Text from '../../components/text/Text'
import { PublishModal } from './PublishModal';
import { BUTTON_STYLE, FileLink } from './FileLink';
import { GallApp } from '../../types/ziggurat/GallApp';
import { Folder, FolderContents } from '../../types/ziggurat/Folder';
import { downloadProjectZip } from '../../utils/gall';

const sortFolderContents = (contents: FolderContents) => Object.keys(contents).sort((a, b) => {
  const aIsFile = typeof contents[a] === 'string'
  const bIsFile = typeof contents[b] === 'string'
 
  return aIsFile && bIsFile ? (a).localeCompare(b) :
    !aIsFile && !bIsFile ? (contents[a] as Folder).name.localeCompare((contents[b] as Folder).name) :
    aIsFile ? 1 : -1
})

interface SubDirectoryProps {
  projectTitle: string
  folder: Folder
  indent: number
}

const SubDirectory = ({ projectTitle, folder, indent }: SubDirectoryProps) => {
  const { currentFolder, currentProject, toggleGallFolder, setCurrentFolder } = useZigguratStore()

  const { name, expanded, contents } = folder
  const selected = currentFolder === name && currentProject === projectTitle
  const displayName = name.split('/').slice(-1)[0]

  return (
    <Col style={{ padding: '0px 4px', fontSize: 14 }} onClick={() => setCurrentFolder(name)}>
      <Row between style={{ padding: 2, cursor: 'pointer',  }} onClick={(e) => {
        if (!(expanded && !selected))
          toggleGallFolder(projectTitle, name)
      }}>
        <Row>
          <Button onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleGallFolder(projectTitle, name)
          }} variant="unstyled" iconOnly icon={expanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />} />
          <Text style={{ marginLeft: 4, textDecorationLine: selected ? 'underline' : undefined }}>{displayName}</Text>
        </Row>
      </Row>
      {expanded && (
        <Col style={{ paddingLeft: indent * 9 }}>
          {sortFolderContents(contents).map((item) => {
            if (typeof contents[item] === 'string') {
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
  const { deleteProject, setProjectExpanded, setCurrentProject } = useZigguratStore()
  const [showButtons, setShowButtons] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)

  const { title, folder, expanded } = project

  const downloadZip = useCallback(async () => {
    downloadProjectZip(project)
  }, [project])

  return (
    <Col style={{ padding: '0px 4px', fontSize: 14 }} onMouseEnter={() => setShowButtons(true)} onMouseLeave={() => setShowButtons(false)} onClick={() => setCurrentProject(title)}>
      <Row between style={{ padding: 2, marginBottom: 2, cursor: 'pointer',  }} onClick={() => setProjectExpanded(title, !expanded)}>
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
              <Button style={BUTTON_STYLE} variant="unstyled" iconOnly icon={<FaDownload size={14} />} onClick={downloadZip} />
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
        <Col className='ml1'>
          {sortFolderContents(folder.contents)
          .map((item) => {
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
