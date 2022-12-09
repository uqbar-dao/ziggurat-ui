import React from 'react'
import { FaChevronDown, FaChevronRight, FaRegStar, FaStar } from 'react-icons/fa';

import useZigguratStore from '../../stores/zigguratStore'
import Button from '../../components/form/Button';
import Col from '../../components/spacing/Col'
import Row from '../../components/spacing/Row'
import Text from '../../components/text/Text'
import { BUTTON_STYLE, FileLink } from './FileLink';
import { Project } from '../../types/ziggurat/Project';
import { Folder, FolderContents } from '../../types/ziggurat/Folder';

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
  const { currentFolder, currentProject, toggleProjectFolder, setCurrentFolder, addUserfile } = useZigguratStore()

  const { name, expanded, contents } = folder
  const selected = currentFolder === name && currentProject === projectTitle
  const displayName = name.split('/').slice(-1)[0]

  return (
    <Col style={{ padding: '0px 4px', fontSize: 14 }} onClick={() => setCurrentFolder(name)}>
      <Row between style={{ padding: 2, cursor: 'pointer',  }} onClick={(e) => {
        if (!(expanded && !selected))
          toggleProjectFolder(projectTitle, name)
      }}>
        <Row>
          <Button onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleProjectFolder(projectTitle, name)
          }} variant="unstyled" iconOnly icon={expanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />} />
          <Text style={{ marginLeft: 4, textDecorationLine: selected ? 'underline' : undefined }}>{displayName}</Text>
        </Row>
      </Row>
      {expanded && (
        <Col style={{ paddingLeft: indent * 9 }}>
          {sortFolderContents(contents).map((item) => {
            if (typeof contents[item] === 'string') {
              return <FileLink key={item} project={projectTitle} file={item} />
            }
            return <SubDirectory key={item} projectTitle={projectTitle} folder={contents[item] as Folder} indent={1} />
          })}
        </Col>
      )}
    </Col>
  )
}

interface ProjectDirectoryProps {
  project: Project
}

export const ProjectDirectory = ({ project }: ProjectDirectoryProps) => {
  const { setProjectExpanded, setCurrentProject, setUserfilesExpanded, deleteUserfile, addUserfile } = useZigguratStore()

  const { title, folder, expanded, userfilesExpanded } = project

  return (
    <Col style={{ padding: '0px 4px', fontSize: 14 }} onClick={() => setCurrentProject(title)}>
      {project.user_files && <Col>
        {project?.user_files?.map((uf, i) => <FileLink project={title} file={uf} key={i} starred />)}
      </Col>}
      <Row between style={{ position: 'relative', padding: 2, marginBottom: 2, cursor: 'pointer',  }} onClick={() => setProjectExpanded(title, !expanded)}>
        <Row>
          <Button style={BUTTON_STYLE} variant="unstyled" iconOnly icon={expanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />} />
          <Text style={{ marginLeft: 4, marginBottom: 2, fontSize: 16 }}>Files</Text>
        </Row>
      </Row>
      {expanded && (
        <Col className='ml1'>
          {sortFolderContents(folder.contents)
          .map((item) => {
            if (typeof folder.contents[item] === 'string') {
              return <FileLink key={item} project={title} file={item} />
            }
            return <SubDirectory key={item} projectTitle={title} folder={folder.contents[item] as Folder} indent={1} />
          })}
        </Col>
      )}
    </Col>
  )
}
