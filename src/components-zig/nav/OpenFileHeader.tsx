import React, { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useZigguratStore from '../../stores/zigguratStore'
import Row from '../../components/spacing/Row'
import Link from './Link'
import Button from '../../components/form/Button'

import './OpenFileHeader.scss'
import { genHref } from '../../utils/nav'
import { FaPlus } from 'react-icons/fa'

export const OpenFileHeader = () => {
  const { pathname } = useLocation()
  const nav = useNavigate()
  const { openFiles, gallApps, currentProject, setOpenFiles, setCurrentProject } = useZigguratStore()

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
    <Row className='open-file-header'>
      {openFiles.map(({ project, file }) => {
        const prependProject = openFiles.find(of => of.project !== project && of.file === file)
        const isGall = Boolean(gallApps[project])
        const href = genHref(project, file, isGall)
        const fileName = isGall ? file.split('/').slice(-2).join('.') : file

        return (
          <Link key={project + file} className={`tab ${pathname.includes(href) ? 'selected' : ''}`} href={href} onClick={() => setCurrentProject(project)}>
            <div className='tabName'>
              {fileName}{prependProject ? ` - ${project}` : ''}
            </div>
            <Button className='close'
              variant='unstyled'
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                removeFile(project, file)
              }}
            >
              <FaPlus style={{ transform: 'rotate(45deg)'}} />
            </Button>
          </Link>
        )
      })}
    </Row>
  )
}
