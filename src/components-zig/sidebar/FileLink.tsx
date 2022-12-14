import  { useCallback, useMemo, useState } from 'react'
import { FaCodeBranch, FaFile, FaFileImage, FaKickstarterK, FaMoneyBill, FaPencilRuler,  FaRegStar,  FaShip, FaStar, FaTerminal, FaTrash } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import useZigguratStore from '../../stores/zigguratStore'
import Button from '../../components/form/Button';
import { Tooltip } from '../../components/popups/Tooltip';
import Row from '../../components/spacing/Row'
import Link from '../nav/Link';
import { genHref } from '../../utils/nav';
import { getFilename } from '../../utils/project';

export const BUTTON_STYLE = { marginLeft: 6, padding: 2 }

interface FileLinkProps {
  project: string
  file: string
  starred?: boolean
  noHoverMenu?: boolean
}

export const FileLink = ({ project, file, starred, noHoverMenu }: FileLinkProps) => {
  const { pathname } = useLocation()
  const { currentProject, openFiles, setCurrentProject, setOpenFiles, deleteFile, projects, addUserfile, deleteUserfile } = useZigguratStore()
  const [showButtons, setShowButtons] = useState(false)
  const isTests = useMemo(() => file === 'contract-tests', [file])
  const fileName = useMemo(() => isTests ? 'contract tests' : getFilename(file), [file, isTests])

  const selectFile = useCallback(() => {
    if (!openFiles.find((of) => of.project === project && of.file === file)) {
      setOpenFiles(openFiles.concat([{ project, file }]))
    }
    if (project !== currentProject) {
      setCurrentProject(project)
    }
  }, [project, currentProject, file, openFiles, setOpenFiles, setCurrentProject])

  const href = genHref(project, file)
  const tar = projects[project] && projects[project].modifiedFiles
    && projects[project].modifiedFiles.has
    && projects[project].modifiedFiles.has(file) ? '*' : ''

  return (
    <Row style={{ paddingLeft: 8, position: 'relative' }} onMouseEnter={() => setShowButtons(true)} onMouseLeave={() => setShowButtons(false)}>
      {starred && <Button variant='unstyled' style={{ margin: '0px 4px', padding: 0 }} iconOnly icon={<FaStar />} onClick={() => deleteUserfile(project, file)} />} 
      {fileName.endsWith('.hoon') ? <FaCodeBranch style={{ transform: 'scale(1, -1)'}} />
       : file.match(/^contract-tests$/) ? <FaPencilRuler size={14} />
       : file.match(/^repl$/) ? <FaTerminal size={14} />
       : fileName.endsWith('.bill') ? <FaMoneyBill />
       : fileName.endsWith('.ship') ? <FaShip />
       : fileName.endsWith('.kelvin') ? <FaKickstarterK />
       : fileName.match(/\.((pn|jp(e)?)g|gif|tif(f)?|webp|bmp|ico)$/) ? <FaFileImage />
       : <FaFile />}
      <Link onClick={selectFile} underline={pathname === href} href={href} style={{ padding: 2, paddingLeft: 4 }}>
        {tar} 
        {fileName}
      </Link>
      {!noHoverMenu && showButtons && !isTests && file !== project && (<Row style={{ 
        position: 'absolute', top: 0, right: 4, background: 'white', borderRadius: 4, paddingRight: 5
      }}>
        {!starred && <Tooltip right tip="star">
          <Button style={BUTTON_STYLE} variant="unstyled" iconOnly icon={<FaRegStar size={14} />} onClick={() => addUserfile(project, file)} />
        </Tooltip>}
        <Tooltip right tip="delete">
          <Button style={BUTTON_STYLE} variant="unstyled" iconOnly icon={<FaTrash size={14} />} onClick={() => deleteFile(project, file)} />
        </Tooltip>
      </Row>)}
    </Row>
  )
}
