import React, { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useProjectStore from '../../ui-ziggurat/store/projectStore'
import Row from '../spacing/Row'
import Link from './Link'
import Button from '../form/Button'

import './OpenFileHeader.scss'
import { genHref } from '../../utils/nav'

export const OpenFileHeader = () => {
  const { pathname } = useLocation()
  const nav = useNavigate()
  const { openFiles, gallApps, currentProject, setOpenFiles, setCurrentProject } = useProjectStore()

  const removeFile = useCallback((p: string, f: string) => {
    const newOpenFiles = openFiles.filter(({ project, file }) => !(p === project && f === file) )
    const isGall = Boolean(gallApps[currentProject])
    const href = genHref(p, f, isGall)

    if (pathname === href) {
      if (newOpenFiles.length) {
        const { project, file } = newOpenFiles[0]
        nav(genHref(project, file, Boolean(gallApps[project])))
      } else {
        nav('/')
      }
    }
    setOpenFiles(newOpenFiles)
  }, [openFiles, setOpenFiles, nav, pathname, gallApps, currentProject])

  return (
    <Row className='open-file-header' style={{ background: 'lightgray', height: 32, overflowX: 'scroll', width: '100%' }}>
      {openFiles.map(({ project, file }) => {
        const prependProject = openFiles.find(of => of.project !== project && of.file === file)
        const isGall = Boolean(gallApps[project])
        const href = genHref(project, file, isGall)
        const fileName = isGall ? file.split('/').slice(-2).join('.') : file

        return (
          <Link key={project + file} className={`tab ${pathname.includes(href) ? 'selected' : ''}`} href={href} onClick={() => setCurrentProject(project)}>
            <div style={{ fontSize: 12, whiteSpace: 'nowrap', marginTop: 2 }}>
              {fileName}{prependProject ? ` - ${project}` : ''}
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
