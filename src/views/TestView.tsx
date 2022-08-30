import React, { useCallback, useMemo, useState } from 'react'
import Iframe from 'react-iframe';
import { DragDropContext } from 'react-beautiful-dnd';
import { FaPlay } from 'react-icons/fa';
import { isMobileCheck } from '../utils/dimensions'
import Col from '../components/spacing/Col'
import Row from '../components/spacing/Row'
import useContractStore from '../store/contractStore';
import Modal from '../components/popups/Modal';
import Button from '../components/form/Button';
import Input from '../components/form/Input';
import { formValuesForGrain, formValuesFromGrain, grainFromForm, updateField, validateFormValues } from '../utils/form';
import { TestList } from '../components/tests/TestList';
import { GrainList } from '../components/tests/GrainList';
import { TestGrain, } from '../types/TestGrain';
import { Test } from '../types/TestData';
import { TestModal } from '../components/tests/TestModal';
import { FormValues } from '../types/FormValues';
import { OpenFileHeader } from '../components/nav/OpenFileHeader';

import './TestView.scss'
import { DEFAULT_BUDGET, DEFAULT_RATE } from '../utils/constants';

export interface TestViewProps {}

export const TestView = () => {
  const { projects, currentProject, focusedTests, setLoading, addTest, updateTest, addGrain, runTests } = useContractStore()

  const [showTestModal, setShowTestModal] = useState(false)
  const [showGrainModal, setShowGrainModal] = useState(false)
  const [grainFormValues, setGrainFormValues] = useState<FormValues>({})
  const [testFormValues, setTestFormValues] = useState<{ [key: string]: string }>({ name: '', action: '' })
  const [grainType, setGrainType] = useState('')
  const [edit, setEdit] = useState<Test | TestGrain | undefined>()

  const project = useMemo(() => projects[currentProject], [projects, currentProject])

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
    setTestFormValues({ name: test.name || '', action: test.action_text })
    setEdit(test)
    setShowTestModal(true)
  }, [setTestFormValues, setShowTestModal])

  const updateGrainFormValue = useCallback((key: string, value: string) => {
    const newValues = { ...grainFormValues }
    updateField(newValues[key], value)
    setGrainFormValues(newValues)
  }, [grainFormValues, setGrainFormValues])

  const updateTestFormValue = useCallback((key: string, value: string) => {
    const newValues = { ...testFormValues }
    newValues[key] = value
    setTestFormValues(newValues)
  }, [testFormValues, setTestFormValues])

  const submitTest = useCallback((isUpdate = false) => async () => {
    setLoading('Saving test...')

    if (!edit) {
      await addTest(testFormValues.name, testFormValues.action)
    } else {
      await updateTest(edit.id, testFormValues.name, testFormValues.action)
    }
    
    setShowTestModal(false)
    setTestFormValues({})
    setEdit(undefined)
    setLoading(undefined)
  }, [testFormValues, edit, addTest, updateTest, setLoading])

  const submitGrain = useCallback((isUpdate = false) => async () => {
    const validationError = validateFormValues(grainFormValues)

    if (validationError) {
      return window.alert(validationError)
    }

    const newGrain = grainFromForm(grainFormValues)

    const targetProject = projects[currentProject]
    if (targetProject) {
      if (targetProject?.state[newGrain.id] && !edit) {
        return window.alert('You already have a grain with this ID, please change the ID.')
      }
    }

    setLoading('Saving grain...')
    await addGrain(newGrain)

    setGrainType('')
    setShowGrainModal(false)
    setGrainFormValues({})
    setEdit(undefined)
    setLoading(undefined)
  }, [edit, currentProject, projects, grainFormValues, addGrain, setLoading])

  const handleDragAndDropGrain = useCallback(({ source, destination }) => {
    if (!destination)
      return;

    if (source.droppableId === 'grains') {
      if (destination.droppableId === 'grains') {
        const newGrains = [ ...Object.values(projects[currentProject].state) ]
        const reorderedItem = newGrains.splice(source.index, 1)[0];
        newGrains.splice(destination.index, 0, reorderedItem);
        
        // TODO: update the grain order (is this even possible now?)
      }
    }
  }, [projects, currentProject]);

  const hideTestModal = () => {
    if (window.confirm('Are you sure you want to discard your changes?')) {
      setTestFormValues({})
      setShowTestModal(false)
      setEdit(undefined)
    }
  }

  const hideGrainModal = () => {
    if (window.confirm('Are you sure you want to discard your changes?')) {
      setGrainFormValues({})
      setShowGrainModal(false)
      setEdit(undefined)
      setGrainType('')
    }
  }

  const runSelectedTests = useCallback(() => {
    let testsToRun = Object.keys(focusedTests).filter(key => focusedTests[key].focus)

    if (!testsToRun.length) {
      const excluded = Object.keys(focusedTests).filter(key => focusedTests[key].exclude)
      testsToRun = Object.values(project.tests).map(({ id }) => id).filter(id => !excluded.includes(id))
    }

    if (testsToRun.length) {
      runTests(testsToRun.map(id => ({ id, rate: DEFAULT_RATE, bud: DEFAULT_BUDGET })))
    } else {
      window.alert('You have excluded all tests.')
    }
  }, [project, focusedTests, runTests])

  const isEdit = Boolean(edit)

  return (
    <DragDropContext onDragEnd={handleDragAndDropGrain}>
      <OpenFileHeader />
      <Row className="tests" style={{ flexDirection: isMobile ? 'column' : 'row' }}>
        <Col style={{ height: isMobile ? 600 : '100%', width: isMobile ? '100%' : '50%' }}>
          <Row className="section-header">
            <Row>
              <Row className="title" style={{ marginRight: 8 }}>Tests</Row>
              <Button onClick={runSelectedTests} variant='unstyled' iconOnly icon={<FaPlay size={14} />} />
            </Row>
            <Row className="action" onClick={() => setShowTestModal(true)}>+ Add Test</Row>
          </Row>
          <TestList editTest={editTest} />
        </Col>
        <Col style={{ height: isMobile ? 600 : '100%', width: isMobile ? '100%' : '50%', borderLeft: '1px solid lightgray' }}>
          <Row className="section-header">
            <Row className="title">Test Granary</Row>
            <Row>
              <Row className="action" onClick={() => setShowGrainModal(true)}>Refresh</Row>
              <Row className="action" onClick={() => populateGrainForm()}>+ Add Grain</Row>
            </Row>
          </Row>
          <GrainList editGrain={populateGrainForm} />
        </Col>

        <TestModal {...{ showTestModal, hideTestModal, isEdit, testFormValues, setTestFormValues, updateTestFormValue, submitTest }} />

        <Modal show={showGrainModal} hide={hideGrainModal}>
          <Col style={{ minWidth: 320, maxHeight: 'calc(100vh - 80px)', overflow: 'scroll' }}>
            <h3 style={{ marginTop: 0 }}>{isEdit ? 'Update' : 'Add New'} Grain</h3>
            {Object.keys(grainFormValues).map((key) => (
              <Row key={key}>
                <Input
                  disabled={key === 'id' && isEdit}
                  onChange={(e) => updateGrainFormValue(key, e.target.value)}
                  value={grainFormValues[key].value}
                  label={`${key} (${JSON.stringify(grainFormValues[key].type).replace(/"/g, '')})`}
                  placeholder={key}
                  containerStyle={{ marginTop: 4, width: '100%' }}
                />
              </Row>
            ))}
            <Button onClick={submitGrain(isEdit)} style={{ alignSelf: 'center', marginTop: 16 }}>{isEdit ? 'Update' : 'Add'} Grain</Button>
          </Col>
        </Modal>
      </Row>
    </DragDropContext>
  )
}
