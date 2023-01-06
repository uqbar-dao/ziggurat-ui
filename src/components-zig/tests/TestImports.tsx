import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import Button from "../../components/form/Button";
import Input from "../../components/form/Input";
import Dropdown from "../../components/popups/Dropdown";
import Col from "../../components/spacing/Col";
import Divider from "../../components/spacing/Divider";
import Field from "../../components/spacing/Field";
import Text from '../../components/text/Text'
import { Test } from "../../types/ziggurat/Repl";
import { TestImport } from "./TestImport";
import TestStepRow from "./TestStepRow";

interface TestImportsProps extends React.HTMLAttributes<HTMLDivElement> {
  test: Test
  onAddImport: (test: Test, face: string, path: string) => Promise<void>
}

export const TestImports: React.FC<TestImportsProps> = ({ test, onAddImport, ...props }) => { 
  const [newFace, setNewFace] = useState('')
  const [newPath, setNewPath] = useState('')
  
  return (<Field name='Imports' className='imports wrap' {...props}>
    {Object.entries(test.test_imports).sort(([a, c], [b, d]) => a < b ? -1 : 1)
    .map(([face, path], j) => <TestImport face={face} path={path || ''} test={test} key={j} />)}
    <Field name='Add Import' className='ml1 mt1 w100 add-import'>
      <Input className='mr1' placeholder='face' value={newFace} onChange={(e) => setNewFace(e.currentTarget.value)} />
      <Input placeholder='path' value={newPath} onChange={(e) => setNewPath(e.currentTarget.value)} />
      <Button variant='slim' style={{ marginLeft: 'auto', border: '1px solid transparent' }}
      iconOnly icon={<FaPlus />} disabled={!Boolean(newFace) || !Boolean(newPath)}
      onClick={async () => {
        try {
          await onAddImport(test, newFace, newPath)
          setNewFace('')
          setNewPath('')
        } catch {
          alert(`Error saving ${newFace}: ${newPath}.`)
        }
      }} />
    </Field>
  </Field>)}