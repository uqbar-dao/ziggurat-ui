import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import useContractStore from '../../store/contractStore'
import Col from '../spacing/Col'
import Row from '../spacing/Row'
import Link from '../nav/Link'

import './OpenFileHeader.scss'

export const OpenFileHeader = () => {
  const { pathname } = useLocation()
  const { projects, currentProject, openFiles } = useContractStore()
  const openFileList = useMemo(() => openFiles[currentProject] || [], [currentProject, openFiles])
  const project = useMemo(() => projects[currentProject], [currentProject, projects])

  return (
    <Row className='open-file-header' style={{ justifyContent: 'space-between', background: 'lightgray' }}>
      <Col>
        <Row>
          {openFileList.map((f: string) => (
            <Link key={f} className={`tab ${pathname.includes(`/${project?.title}/${f}`) ? 'selected' : ''}`} href={`/${project?.title}/${f}`}>{f}</Link>
          ))}
        </Row>
      </Col>
    </Row>
  )
}
