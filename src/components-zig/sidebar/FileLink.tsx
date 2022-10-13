import  { useCallback, useState } from 'react'
import { FaCodeBranch, FaFile, FaFileImage, FaKickstarterK, FaMoneyBill, FaPencilRuler,  FaShip, FaTrash } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import useZigguratStore from '../../stores/zigguratStore'
import Button from '../../components/form/Button';
import { Tooltip } from '../../components/popups/Tooltip';
import Row from '../../components/spacing/Row'
import Link from '../nav/Link';
import { genHref } from '../../utils/nav';
import { getFilename } from '../../utils/gall';

export const BUTTON_STYLE = { marginLeft: 6, padding: 2 }

interface FileLinkProps {
  project: string
  file: string
  isGall?: boolean
}

export const FileLink = ({ project, file, isGall = false }: FileLinkProps) => {
  const { pathname } = useLocation()
  const { currentProject, openFiles, setCurrentProject, setOpenFiles, deleteFile, contracts } = useZigguratStore()
  const [showButtons, setShowButtons] = useState(false)
  const isTests = file === 'tests'
  const fileName = isGall ? getFilename(file) :
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
  const tar = contracts[project] && contracts[project].modifiedFiles
    && contracts[project].modifiedFiles.has
    && contracts[project].modifiedFiles.has(file) ? '*' : ''

  return (
    <Row style={{ paddingLeft: 8, position: 'relative' }} onMouseEnter={() => setShowButtons(true)} onMouseLeave={() => setShowButtons(false)}>
      {fileName.endsWith('.hoon') ? <FaCodeBranch style={{ transform: 'scale(1, -1)'}} />
       : fileName.endsWith('tests') ? <FaPencilRuler />
       : fileName.endsWith('.bill') ? <FaMoneyBill />
       : fileName.endsWith('.ship') ? <FaShip />
       : fileName.endsWith('.kelvin') ? <FaKickstarterK />
       : fileName.match(/\.((pn|jp(e)?)g|gif|tif(f)?|webp|bmp|ico)$/) ? <FaFileImage />
       : <FaFile />}
      <Link onClick={selectFile} underline={pathname === href} href={href} style={{ padding: 2 }}>
        {tar} {fileName}
      </Link>
      {showButtons && !isTests && file !== project && (
        <Tooltip style={{ position: 'absolute', right: 0, top: 0 }} tip="delete">
          <Button style={BUTTON_STYLE} variant="unstyled" iconOnly icon={<FaTrash size={14} />} onClick={() => deleteFile(project, file)} />
        </Tooltip>
      )}
    </Row>
  )
}
