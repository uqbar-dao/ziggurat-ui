import React, { useMemo, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import Button from "../../components/form/Button";
import Input from "../../components/form/Input";
import Dropdown from "../../components/popups/Dropdown";
import Row from "../../components/spacing/Row";
import Text from '../../components/text/Text'
import useZigguratStore from "../../stores/zigguratStore";
import { Test } from "../../types/ziggurat/Repl";
import { Imports } from "../../types/ziggurat/TestData";

interface TestImportProps extends React.HTMLAttributes<HTMLDivElement> {
  test: Test
  face: string
  path: string
}

export const TestImport: React.FC<TestImportProps> = ({ test, face, path, ...props }) => {
  const { projects, currentProject, tests, updateTest, setLoading } = useZigguratStore()
  const [isOpen, setIsOpen] = useState(false)
  const [newFace, setNewFace] = useState(face)
  const [newPath, setNewPath] = useState(path)
  
  useMemo(() => {
    setNewFace(face)
    setNewPath(path) 
  }, [face, path])

  return (<Row className='import w100' {...props}>
    <Text mr1 ml1>Face</Text>
    <Input disabled={newFace === 'zig'} value={newFace} onChange={(e) => setNewFace(e.currentTarget.value)} />
    <Text mr1 ml1>Path</Text>
    <Dropdown style={{ pointerEvents: newFace==='zig' ? 'none' : 'inherit' }} open={Boolean(isOpen)} toggleOpen={() => setIsOpen(!Boolean(isOpen))} value={newPath}>
      {projects[currentProject]?.dir.filter(file => file.endsWith('hoon'))
      .map(file => <option value={file} key={file} onClick={async (e) => {
        setIsOpen(false)
        setLoading(`Updating import ${face}: ${newPath} -> ${file}...`)
        const nimports: Imports = { ...test.test_imports, [newFace]: file.replace(/\/hoon$/g, '') }
        try {
          await updateTest(test.id, test.name, nimports, test.test_steps)
        } catch {
          alert('Error updating import. Does the file exist?')
        } finally {
          setLoading()
        }
      }}>{file}</option>)}
    </Dropdown>
    <Row className='buttons'>
      {newFace !== 'zig' && <Button variant='slim' iconOnly icon={<FaRegTrashAlt />} onClick={async () => {
        const nimports: Imports = { ...test.test_imports, [newFace]: undefined }
        await updateTest(test.id, test.name, nimports, test.test_steps)
      }} />}
    </Row>
  </Row>)
}