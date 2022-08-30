import React, { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useContractStore from '../../store/contractStore'
import Row from '../spacing/Row'
import Link from '../nav/Link'
import Button from '../form/Button'

import './OpenFileHeader.scss'

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
    <Row className='open-file-header' style={{ justifyContent: 'space-between', background: 'lightgray', height: 32, overflowX: 'scroll', width: '100%' }}>
      {openFiles.map(({ project, file }) => {
        const prependProject = openFiles.find(of => of.project !== project && of.file === file)

        return (
          <Link key={project + file} className={`tab ${pathname.includes(`/${project}/${file}`) ? 'selected' : ''}`} href={`/${project}/${file}`}>
            <div style={{ fontSize: 12, whiteSpace: 'nowrap', marginTop: 2 }}>
              {file}{prependProject ? ` - ${project}` : ''}
            </div>
            <Button
              variant='unstyled'
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                removeFile(project, file)
              }}
              style={{ fontSize: 10, marginLeft: 6, marginTop: 4 }}
            >
              &#10005;
            </Button>
          </Link>
        )
      })}
    </Row>
  )
}
