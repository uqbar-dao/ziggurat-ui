import React, { useCallback, useState } from 'react'
import { FaTrash } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import useProjectStore from '../../ui-ziggurat/store/projectStore'
import Button from '../form/Button';
import { Tooltip } from '../popups/Tooltip';
import Row from '../spacing/Row'
import Link from '../nav/Link';
import { genHref } from '../../utils/nav';

export const BUTTON_STYLE = { marginLeft: 6, padding: 2 }

interface FileLinkProps {
  project: string
  file: string
  isGall?: boolean
}

export const FileLink = ({ project, file, isGall = false }: FileLinkProps) => {
  const { pathname } = useLocation()
  const { currentProject, openFiles, setCurrentProject, setOpenFiles, deleteFile } = useProjectStore()
  const [showButtons, setShowButtons] = useState(false)
  const isTests = file === 'tests'
  const fileName = isGall ? file.split('/').slice(-2).join('.') :
    !isTests ? `${file}.hoon` :
    file

  const selectFile = useCallback(() => {
    if (!openFiles.find((of) => of.project === project && of.file === file)) {
      setOpenFiles(openFiles.concat([{ project, file }]))
    }
    if (project !== currentProject) {
      setCurrentProject(project)
    }
  }, [project, currentProject, file, openFiles, setOpenFiles, setCurrentProject])

  const href = genHref(project, file, isGall)

  return (
    <Row style={{ paddingLeft: 8, position: 'relative' }} onMouseEnter={() => setShowButtons(true)} onMouseLeave={() => setShowButtons(false)}>
      <Link onClick={selectFile} underline={pathname === href} href={href} style={{ padding: 2 }}>
        {fileName}
      </Link>
      {showButtons && !isTests && file !== project && (
        <Tooltip style={{ position: 'absolute', right: 0, top: 0 }} tip="delete">
          <Button style={BUTTON_STYLE} variant="unstyled" iconOnly icon={<FaTrash size={14} />} onClick={() => deleteFile(project, file)} />
        </Tooltip>
      )}
    </Row>
  )
}
