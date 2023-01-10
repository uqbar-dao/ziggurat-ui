import React, { useMemo, useState } from "react";
import { FaCheck, FaRegTrashAlt } from "react-icons/fa";
import Button from "../../components/form/Button";
import Input from "../../components/form/Input";
import Dropdown from "../../components/popups/Dropdown";
import Row from "../../components/spacing/Row";
import Text from '../../components/text/Text'
import { convertSteps } from "../../stores/subscriptions/project";
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

  const onUpdate = async (file: string) => {
    const finalFace = face !== newFace ? newFace : face
    setIsOpen(false)
    setLoading(`Updating import '${finalFace}: ${file}...'`)
    const nimports: Imports = { 
      ...test.test_imports,
      [face]: undefined,
      [finalFace]: file.replace(/\/hoon$/g, '') }
    try {
      await updateTest(test.id, test.name, nimports, convertSteps(test.test_steps))
    } catch {
      alert('Error updating import. Does the file exist?')
    } finally {
      setLoading()
    }
  }

  const onDelete = async () => {
    const nimports: Imports = { ...test.test_imports, [newFace]: undefined }
    try {
      setLoading(`Deleting import ${newFace}...`)
      await updateTest(test.id, test.name, nimports, convertSteps(test.test_steps))
    } catch {
      alert('Error deleting import.')
    } finally {
      setLoading()
    }
  }
  
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
      .map(file => <option value={file} key={file} onClick={() => onUpdate(file)}>{file}</option>)}
    </Dropdown>
    <Row className='buttons'>
      {newFace !== face && <Button variant='slim' iconOnly icon={<FaCheck/>} onClick={() => onUpdate(newPath)} />}
      {newFace !== 'zig' && <Button variant='slim' iconOnly icon={<FaRegTrashAlt />} onClick={() => onDelete()} />}
    </Row>
  </Row>)
}