import React, { useCallback, useMemo, useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd';
import { FaPlay } from 'react-icons/fa';
import { isMobileCheck } from '../../utils/dimensions'
import Col from '../../components-zig/spacing/Col'
import Row from '../../components-zig/spacing/Row'
import useZigguratStore from '../../stores/zigguratStore';
import Modal from '../../components-zig/popups/Modal';
import Button from '../../components-zig/form/Button';
import { formValuesForGrain, formValuesFromGrain, grainFromForm, updateField, validateFormValues } from '../../utils/form';
import { TestList } from '../../components-zig/tests/TestList';
import { GrainList } from '../../components-zig/tests/GrainList';
import { TestGrain, } from '../../types/ziggurat/TestGrain';
import { Test } from '../../types/ziggurat/TestData';
import { TestModal } from '../../components-zig/tests/TestModal';
import { FormValues } from '../../types/ziggurat/FormValues';
import { OpenFileHeader } from '../../components-zig/nav/OpenFileHeader';
import { DEFAULT_BUDGET, DEFAULT_RATE } from '../../utils/constants';
import { Tooltip } from '../../components-zig/popups/Tooltip';
import { GrainModal } from '../../components-zig/tests/GrainModal';
import Text from '../../components-zig/text/Text'
import { BLANK_TEST_FORM, TestFormField, TestFormValues } from '../../types/ziggurat/TestForm';

import './TestView.scss'

export interface TestViewProps {}

export const TestView = () => {
  const { contracts, currentProject, setLoading, addTest, updateTest, addGrain, runTest, runTests, addTestExpectation } = useZigguratStore()

  const [showTestModal, setShowTestModal] = useState(false)
  const [testExpectation, setTestExpecation] = useState('')
  const [showGrainModal, setShowGrainModal] = useState(false)
  const [showRunModal, setShowRunModal] = useState(false)
  const [grainFormValues, setGrainFormValues] = useState<FormValues>({})
  const [testFormValues, setTestFormValues] = useState<TestFormValues>(BLANK_TEST_FORM)
  const [edit, setEdit] = useState<Test | TestGrain | undefined>()

  const project = useMemo(() => contracts[currentProject], [contracts, currentProject])

  const isMobile = isMobileCheck()

  const populateGrainForm = useCallback((grain?: TestGrain) => {
    if (grain) {
      setGrainFormValues(formValuesFromGrain(grain))
      setEdit(grain)
    } else {
      setGrainFormValues(formValuesForGrain())
    }
    setShowGrainModal(true)
  }, [setEdit, setGrainFormValues, setShowGrainModal])

  const editTest = useCallback((test: Test) => {
    setTestFormValues({ name: test.name || '', action: test.action_text, expectedError: String(test.expected_error || 0) })
    setEdit(test)
    setShowTestModal(true)
  }, [setTestFormValues, setShowTestModal])

  const updateGrainFormValue = useCallback((key: string, value: string) => {
    const newValues = { ...grainFormValues }
    updateField(newValues[key], value)
    setGrainFormValues(newValues)
  }, [grainFormValues, setGrainFormValues])

  const updateTestFormValue = useCallback((key: TestFormField, value: string) => {
    const newValues = { ...testFormValues }
    newValues[key] = value
    setTestFormValues(newValues)
  }, [testFormValues, setTestFormValues])

  const submitTest = useCallback(async () => {
    setLoading('Saving test...')

    if (!edit) {
      await addTest(testFormValues.name, testFormValues.action.replace(/\n/g, ' '), Number(testFormValues.expectedError))
    } else {
      await updateTest(edit.id, testFormValues.name, testFormValues.action.replace(/\n/g, ' '), Number(testFormValues.expectedError))
    }
    
    setShowTestModal(false)
    setTestFormValues(BLANK_TEST_FORM)
    setEdit(undefined)
    setLoading(undefined)
  }, [testFormValues, edit, addTest, updateTest, setLoading])

  const submitGrain = useCallback(async () => {
    const validationError = validateFormValues(grainFormValues)
    if (validationError)
      return window.alert(validationError)

    const newGrain = grainFromForm(grainFormValues)

    const targetProject = contracts[currentProject]
    if (targetProject && !testExpectation) {
      if (targetProject?.state[newGrain.id] && !edit) {
        return window.alert('You already have a grain with this ID, please change the ID.')
      }
    }

    setLoading('Saving grain...')
    if (testExpectation) {
      await addTestExpectation(testExpectation, newGrain)
    } else {
      await addGrain(newGrain)
    }

    setShowGrainModal(false)
    setGrainFormValues({})
    setEdit(undefined)
    setLoading(undefined)
  }, [edit, currentProject, contracts, grainFormValues, testExpectation, addTestExpectation, addGrain, setLoading])

  const handleDragAndDropGrain = useCallback(({ source, destination }) => {
    if (!destination)
      return;

    if (source.droppableId === 'grains') {
      if (destination.droppableId === 'grains') {
        const newGrains = [ ...Object.values(contracts[currentProject].state) ]
        const reorderedItem = newGrains.splice(source.index, 1)[0];
        newGrains.splice(destination.index, 0, reorderedItem);
        
        // TODO: update the grain order (is this even possible now?)
      }
    }
  }, [contracts, currentProject]);

  const hideTestModal = () => {
    if (window.confirm('Are you sure you want to discard your changes?')) {
      setTestFormValues(BLANK_TEST_FORM)
      setShowTestModal(false)
      setEdit(undefined)
    }
  }

  const hideGrainModal = () => {
    if (window.confirm('Are you sure you want to discard your changes?')) {
      setGrainFormValues({})
      setShowGrainModal(false)
      setEdit(undefined)
      setTestExpecation('')
    }
  }

  const showTestExpectationModal = useCallback((testId: string) => (grain?: TestGrain) => {
    setTestExpecation(testId)
    populateGrainForm(grain)
  }, [setTestExpecation, populateGrainForm])

  const runAllTests = useCallback((runSequentially: boolean) => () => {
    const testsToRun = (Object.values(project.tests) || [])
      .filter(({ selected }) => selected)
      .map(({ id }) => id)
    setShowRunModal(false)
    
    if (testsToRun.length) {
      setLoading('Running tests...')
      if (runSequentially) {
        runTests(testsToRun.map(id => ({ id, rate: DEFAULT_RATE, bud: DEFAULT_BUDGET })))
      } else {
        testsToRun.map(id => runTest({ id, rate: DEFAULT_RATE, bud: DEFAULT_BUDGET }))
      }
      setLoading(undefined)
    } else {
      window.alert('Please select some tests to run.')
    }
  }, [project, runTest, runTests, setLoading, setShowRunModal])

  const isEdit = Boolean(edit)

  return (
    <DragDropContext onDragEnd={handleDragAndDropGrain}>
      <OpenFileHeader />
      <Row className='tests' style={{ flexDirection: isMobile ? 'column' : 'row' }}>
        <Col style={{ height: isMobile ? 600 : '100%', width: isMobile ? '100%' : '50%' }}>
          <Row className='section-header'>
            <Row>
              <Row className='title' style={{ marginRight: 8 }}>Test Actions</Row>
            </Row>
            <Row>
              <Button mr1 variant='unstyled' onClick={() => setShowRunModal(true)}>
                <FaPlay size={'0.75em'} style={{marginRight: '0.5em'}} />
                Run
              </Button>
              <Button mr1 variant='unstyled' className='action' onClick={() => setShowTestModal(true)}>+ Add Test</Button>
            </Row>
          </Row>
          <TestList editTest={editTest} showTestExpectationModal={showTestExpectationModal} />
        </Col>
        <Col style={{ height: isMobile ? 600 : '100%', width: isMobile ? '100%' : '50%', borderLeft: '1px solid lightgray' }}>
          <Row className='section-header'>
            <Row className='title'>Chain State (Granary)</Row>
            <Button mr1 variant='unstyled' className='action' onClick={() => populateGrainForm()}>+ Add Grain</Button>
          </Row>
          <GrainList grains={Object.values(project?.state || {})} editGrain={populateGrainForm} />
        </Col>

        <TestModal {...{ showTestModal, hideTestModal, isEdit, testFormValues, updateTestFormValue, submitTest }} />

        <GrainModal {...{ showGrainModal, hideGrainModal, isEdit, grainFormValues, updateGrainFormValue, setGrainFormValues, submitGrain, testExpectation }} />

        <Modal show={showRunModal} hide={() => setShowRunModal(false)}>
          <h3 style={{ marginTop: 0 }}>Run selected tests:</h3>
          <Tooltip tip='Test results will affect subsequent tests'>
            <Button style={{ width: 180, justifyContent: 'center' }} onClick={runAllTests(true)}>Sequentially</Button>
          </Tooltip>
          <Tooltip tip='Each test will run separately'>
            <Button style={{ width: 180, justifyContent: 'center', marginTop: 16 }} onClick={runAllTests(false)}>Independently</Button>
          </Tooltip>
        </Modal>
      </Row>
    </DragDropContext>
  )
}
