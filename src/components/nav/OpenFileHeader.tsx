import React, { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useContractStore from '../../store/contractStore'
import Col from '../spacing/Col'
import Row from '../spacing/Row'
import Link from '../nav/Link'

import './OpenFileHeader.scss'
import Text from '../text/Text'
import Button from '../form/Button'

export const OpenFileHeader = () => {
  const { pathname } = useLocation()
  const nav = useNavigate()
  const { openFiles, setOpenFiles } = useContractStore()

  const removeFile = useCallback((p: string, f: string) => {
    const newOpenFiles = openFiles.filter(({ project, file }) => !(p === project && f === file) )
    if (pathname === `/${p}/${f}`) {
      if (newOpenFiles.length) {
        const { project, file } = newOpenFiles[0]
        nav(`/${project}/${file}`)
      } else {
        nav('/')
      }
    }
    setOpenFiles(newOpenFiles)
  }, [openFiles, setOpenFiles, nav, pathname])

  return (
    <Row className='open-file-header' style={{ justifyContent: 'space-between', background: 'lightgray', height: 28 }}>
      <Col>
        <Row>
          {openFiles.map(({ project, file }) => (
            <Link key={project + file} className={`tab ${pathname.includes(`/${project}/${file}`) ? 'selected' : ''}`} href={`/${project}/${file}`}>
              <Text>{file}</Text>
              <Button
                variant='unstyled'
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  removeFile(project, file)
                }}
                style={{ fontSize: 10, position: 'absolute', right: 6, top: 10 }}
              >
                &#10005;
              </Button>
            </Link>
          ))}
        </Row>
      </Col>
    </Row>
  )
}
