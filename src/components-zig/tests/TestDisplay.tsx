import Col from "../../components/spacing/Col"
import Row from "../../components/spacing/Row"
import HexNum from "../../components/text/HexNum"
import Text from "../../components/text/Text"
import Button from "../../components/form/Button"
import Field from "../../components/spacing/Field"
import Input from "../../components/form/Input"
import { FaRegTrashAlt, FaPlay, FaRegSave } from "react-icons/fa"
import { Test as RTest } from "../../types/ziggurat/Repl"
import useZigguratStore from "../../stores/zigguratStore"
import { convertSteps } from "../../stores/subscriptions/project"
import Dropdown from "../../components/popups/Dropdown"
import { TestImports } from "./TestImports"
import { TestSteps } from "./TestSteps"
import { useState } from "react"

interface TestDisplayProps {
  test: RTest
}

export const TestDisplay: React.FC<TestDisplayProps> = ({ test, ...props }) => {
  const { setLoading, updateTest, deleteTest, runTest, setTests, dirtyTests, tests, projects, currentProject, } = useZigguratStore()

  const onAddImport = async (test: RTest, face: string, path: string) => {
    if (Object.keys(test.test_imports).indexOf(face) > -1) { 
      alert('Cannot import the same face twice.')
      return
    }

    try {
      setLoading(`Adding import '${face}: ${path}'...`)
      await updateTest(test.id, test.name, { ...test.test_imports, [face]: path }, convertSteps(test.test_steps))
    } catch (e) {
      const msg = 'Error adding import. Please ensure the file path is correct.'
      alert(msg)
    } finally {
      setLoading()
    }
  }
  
  const onDeleteTest = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this test?')) {
      return
    }

    setLoading('Deleting test...')
    try {
      await deleteTest(id)
    } catch {
      debugger
    } finally {
      setLoading()
    }
  }

  const onChangeTestFile = async (test: RTest, file: string) => {
    setLoading('Updating test file...')
    // can't update a test to have a test file. need to delete and recreate, or, restrict test file adds to new test
    try {
      // await updateTest()
    } catch {

    } finally {
      setLoading()
    }
  }

  const onRunTest = async (id: string) => {
    setLoading('Running test...')
    try {
      const result = await runTest(id)
    } catch {
      debugger
    } finally {
      // await test run completion, do not set loading
    }
  }

  const onSaveTest = async () => {
    setLoading('Saving test...')
    try {
      const result = await updateTest(test.id, test.name, test.test_imports, convertSteps(test.test_steps))
    } catch (e) {
      debugger
      alert ('Error saving test.')
    } finally {
      setLoading()
    }
  }

  return (<Col className='test' {...props}>
  <Row>
    <HexNum num={test.id} displayNum={test.name} />
    <Row className='buttons'>
      <Button variant='slim' icon={<FaRegTrashAlt />} iconOnly onClick={() => onDeleteTest(test.id)} />
      {dirtyTests.includes(test.id) && <Button variant='slim' icon={<FaRegSave />} iconOnly onClick={() => onSaveTest()} />}
      {!dirtyTests.includes(test.id) && <Button variant='slim' icon={<FaPlay />} iconOnly onClick={() => onRunTest(test.id)} />}
    </Row>
  </Row>
  <Field name='Name'>
    <Input value={test.name} onChange={(e) => setTests(tests.map(t => ({ ...t,
      name: (t.name === test.name ? e.currentTarget.value : t.name)
    })))} />
  </Field>
  {test.test_steps.length === 0 && <Field name='File' className='w100'>
    <Text>Import steps from file:</Text>
    {(test.test_steps.length === 0) && <Dropdown value={test.test_steps_file === '/' 
      ? 'None (use manual steps)' 
      : test.test_steps_file} open={Boolean(test.filePathDropOpen)}
    style={{ marginLeft: 'auto' }}
    toggleOpen={() => setTests(tests.map(t => ({ 
      ...t, filePathDropOpen: t.name === test.name ? !t.filePathDropOpen : false 
    })))}>
    <option onClick={(e) => {
      console.log(e)
      setTests(tests.map(t => ({ ...t, 
        filePathDropOpen: false,
        filePath: t.name === test.name ? undefined : t.test_steps_file
    })))}} key={'null'}>None (use manual steps)</option>
    {projects[currentProject]?.dir.map(file => <option key={file}
      onClick={(e) => {
        setTests(tests.map(t => ({ ...t, 
          filePathDropOpen: false,
          filePath: t.name === test.name ? e.currentTarget.value : t.test_steps_file
      })))}} value={file}>{file}</option>)}
    </Dropdown>}
  </Field>}
  <TestImports onAddImport={onAddImport} test={test} />
  {(test.test_steps_file === '/') && <TestSteps test={test} />}
</Col>)
}