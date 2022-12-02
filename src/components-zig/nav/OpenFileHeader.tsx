import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useZigguratStore from '../../stores/zigguratStore'
import Row from '../../components/spacing/Row'
import Link from './Link'
import Button from '../../components/form/Button'
import Text from '../../components/text/Text'
import { genHref } from '../../utils/nav'
import { FaPlus } from 'react-icons/fa'

import './OpenFileHeader.scss'

export const OpenFileHeader = () => {
  const { pathname } = useLocation()
  const nav = useNavigate()
  const { projects, openFiles, setOpenFiles, setCurrentProject } = useZigguratStore()

  const removeFile = useCallback((p: string, f: string) => {
    const newOpenFiles = openFiles.filter(({ project, file }) => !(p === project && f === file) )
    const href = genHref(p, f)

    if (pathname === href) {
      if (newOpenFiles.length) {
        const { project, file } = newOpenFiles[0]
        nav(genHref(project, file))
      } else {
        nav('/')
      }
    }
    setOpenFiles(newOpenFiles)
  }, [openFiles, setOpenFiles, nav, pathname])

  return (
    <Row className='open-file-header'>
      {openFiles.map(({ project, file }) => {
        const onRemoveFile = (e: React.MouseEvent) => {
          e.preventDefault()
          e.stopPropagation()
          removeFile(project, file)
        }

        const prependProject = openFiles.find(of => of.project !== project && of.file === file)
        const href = genHref(project, file)
        const fileName = file.split('/').slice(-2).join('.') // /file/txt -> file.txt
        const tar = projects[project] && projects[project].modifiedFiles
          && projects[project].modifiedFiles.has
          && projects[project].modifiedFiles.has(file) ? '* ' : ' '

        return (
          <Link key={project + file} 
                className={`tab ${pathname.includes(href) ? 'selected' : ''}`} 
                href={href} 
                onAuxClick={(event) => {
                  if (event.button === 1)
                    onRemoveFile(event)
                }}
                onClick={(event) => {
                  setCurrentProject(project)
                }}>
            <Row between style={{ width: '100%' }}> 
              <Text className='tabName'>
                {tar}
                {fileName}{prependProject ? ` - ${project}` : ''}
              </Text>
              <Button className='close'
                variant='unstyled'
                onClick={(e) => onRemoveFile(e)}
              >
                <FaPlus style={{ transform: 'rotate(45deg)'}} />
              </Button>
            </Row>
          </Link>
        )
      })}
    </Row>
  )
}
