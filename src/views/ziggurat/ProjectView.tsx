import React, { useCallback, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/addon/display/placeholder'
import useZigguratStore from '../../stores/zigguratStore'
import Col from '../../components/spacing/Col'
import Row from '../../components/spacing/Row'
import Card from '../../components-indexer/card/Card'
import Text from '../../components/text/Text'
import { genHref } from '../../utils/nav'
import Loader from '../../components/popups/Loader'

import './ProjectView.scss'
import useDocumentTitle from '../../hooks/useDocumentTitle'

const ProjectView = () => {
  const { projectTitle } = useParams()
  const nav = useNavigate()
  const { zigguratTitleBase, projects, openFiles, currentProject, setOpenFiles, setCurrentProject } = useZigguratStore()

  const project = useMemo(() => projects[projectTitle || ''], [projectTitle, projects])

  const recentlyOpen = openFiles.filter(({ project }) => project === projectTitle).map(({ file }) => file)
  const primaryFiles = project?.user_files || []
  useDocumentTitle(`${zigguratTitleBase} ${projectTitle}`)

  useEffect(() => {
    if (projectTitle && projectTitle !== currentProject) {
      setCurrentProject(projectTitle)
    }
  }, []) // eslint-disable-line

  const goToFile = useCallback((file: string) => () => {
    if (!openFiles.find((of) => of.project === projectTitle && of.file === file)) {
      setOpenFiles(openFiles.concat([{ project: projectTitle!, file }]))
    }
    nav(genHref(projectTitle!, file))
  }, [projectTitle, openFiles, setOpenFiles, nav])

  if (!recentlyOpen || !project) {
    return (
      <Col className='project-view' style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Loader dark size='large' />
      </Col>
    );
  }

  return (
    <Col className='project-view'>
      <h3>{projectTitle}</h3>
      {recentlyOpen.length > 0 && (
        <>
          <h4>Recent Files</h4>
          <Row className='files'>
            {recentlyOpen.map(file => (
              <Card className='file-card' key={file} onClick={goToFile(file)}>
                <Text>{file}</Text>
              </Card>
            ))}
          </Row>
        </>
      )}
      {primaryFiles.length > 0 && (
        <>
          <h4>Main Files</h4>
          <Row className='files'>
            {primaryFiles.map(file => (
              <Card className='file-card' key={file} onClick={goToFile(file)}>
                <Text>{file}</Text>
              </Card>
            ))}
          </Row>
        </>
      )}
    </Col>
  )
}

export default ProjectView
