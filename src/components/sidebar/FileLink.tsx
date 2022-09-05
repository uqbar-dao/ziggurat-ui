import React, { useCallback, useState } from 'react'
import { FaTrash } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import useProjectStore from '../../store/projectStore'
import Button from '../form/Button';
import { Tooltip } from '../popups/Tooltip';
import Row from '../spacing/Row'
import Link from '../nav/Link';

export const BUTTON_STYLE = { marginLeft: 6, padding: 2 }

interface FileLinkProps {
  project: string
  file: string
}

export const FileLink = ({ project, file }: FileLinkProps) => {
  const { pathname } = useLocation()
  const { currentProject, openFiles, setCurrentProject, setOpenFiles, deleteFile } = useProjectStore()
  const [showButtons, setShowButtons] = useState(false)
  const isTests = file === 'tests'

  const selectFile = useCallback(() => {
    if (!openFiles.find((of) => of.project === project && of.file === file)) {
      setOpenFiles(openFiles.concat([{ project, file }]))
    }
    if (project !== currentProject) {
      setCurrentProject(project)
    }
  }, [project, currentProject, file, openFiles, setOpenFiles, setCurrentProject])

  return (
    <Row onMouseEnter={() => setShowButtons(true)} onMouseLeave={() => setShowButtons(false)}>
      <Link onClick={selectFile} underline={pathname === `/${project}/${file}`} href={`/${project}/${file}`} style={{ padding: 2 }}>
        {file}{!isTests ? '.hoon' : ''}
      </Link>
      {showButtons && !isTests && file !== project && (
        <Tooltip tip="delete">
          <Button style={BUTTON_STYLE} variant="unstyled" iconOnly icon={<FaTrash size={14} />} onClick={() => deleteFile(project, file)} />
        </Tooltip>
      )}
    </Row>
  )
}
