import React, { useCallback, useEffect }  from 'react'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/addon/display/placeholder'
import Col from '../../components/spacing/Col'
import Link from '../../components-zig/nav/Link';

import './WelcomeView.scss'
import useZigguratStore from '../../stores/zigguratStore'
import { OpenFile } from '../../types/ziggurat/OpenFile'
import { useNavigate } from 'react-router-dom'
import { genHref } from '../../utils/nav'
import Card from '../../components-indexer/card/Card'
import Text from '../../components/text/Text'
import Row from '../../components/spacing/Row'

const WelcomeView = ({ hide = false }: { hide?: boolean }) => {
  const { openFiles, projects, setCurrentProject } = useZigguratStore()
  const nav = useNavigate()

  const goToFile = useCallback(({ project, file }: OpenFile) => () => {
    setCurrentProject(project)
    nav(genHref(project, file))
  }, [nav, setCurrentProject])

  const selectProject = useCallback((project: string) => () => {
    setCurrentProject(project)
    nav(`/${project}`)
  }, [nav, setCurrentProject])

  useEffect(() => {
    setCurrentProject('')
  }, []) // eslint-disable-line

  return (
    <Col className='welcome-view'>
      <h3 style={{ marginTop: 0 }}>Welcome to Ziggurat!</h3>
      <Link href="/new">+ Create a new project</Link>
      {Object.keys(projects).length > 0 && <>
        <h4 style={{ marginTop: 32 }}>Open an Existing Project:</h4>
        <Row style={{ flexWrap: 'wrap', marginBottom: -16 }}>
          {Object.keys(projects).map(project => (
            <Card className='file-card' key={project} onClick={selectProject(project)}>
              <Text>{project}</Text>
            </Card>
          ))}
        </Row>
      </>}
      {openFiles?.length > 0 && (
        <>
          <h4 style={{ marginTop: 32 }}>Recently Viewed Files:</h4>
          <Row style={{ flexWrap: 'wrap' }}>
            {openFiles.map(({ project, file }) => (
              <Card className='file-card' key={project + file} onClick={goToFile({ project, file })}>
                <Text>{project} - {file}</Text>
              </Card>
            ))}
          </Row>
        </>
      )}
    </Col>
  )
}

export default WelcomeView
