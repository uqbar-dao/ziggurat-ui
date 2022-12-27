import React, { useCallback, useMemo, useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd';
import { FaPlay, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { isMobileCheck } from '../../utils/dimensions'
import Col from '../../components/spacing/Col'
import Row from '../../components/spacing/Row'
import useZigguratStore from '../../stores/zigguratStore';
import Modal from '../../components/popups/Modal';
import Button from '../../components/form/Button';
import { formValuesForItem, formValuesFromItem, itemFromForm, updateField, validateFormValues } from '../../utils/form';
import { TestList } from '../../components-zig/tests/TestList';
import { ItemList } from '../../components-zig/tests/ItemList';
import { TestItem } from '../../types/ziggurat/TestItem';
import { Test } from '../../types/ziggurat/TestData';
import { TestModal } from '../../components-zig/tests/TestModal';
import { FormValues } from '../../types/ziggurat/FormValues';
import { OpenFileHeader } from '../../components-zig/nav/OpenFileHeader';
import { DEFAULT_BUDGET, DEFAULT_RATE } from '../../utils/constants';
import { ItemModal } from '../../components-zig/tests/ItemModal';
import Text from '../../components/text/Text'
import { BLANK_TEST_FORM, TestFormField, TestFormValues } from '../../types/ziggurat/TestForm';
import Field from '../../components/spacing/Field';
import Entry from '../../components/spacing/Entry';

import './ContractTestView.scss'
import useDocumentTitle from '../../hooks/useDocumentTitle';

export interface ContractTestViewProps {}

export const ContractTestView = () => {
  const { zigguratTitleBase, projects, currentProject, setLoading, addTest, updateTest, addItem, runTest, runTests, addTestExpectation } = useZigguratStore()

  const [showTestModal, setShowTestModal] = useState(false)
  const [testExpectation, setTestExpecation] = useState('')
  const [showItemModal, setShowItemModal] = useState(false)
  const [showRunModal, setShowRunModal] = useState(false)
  const [itemFormValues, setItemFormValues] = useState<FormValues>(formValuesForItem())
  const [testFormValues, setTestFormValues] = useState<TestFormValues>(BLANK_TEST_FORM)
  const [edit, setEdit] = useState<Test | TestItem | undefined>()

  const project = useMemo(() => projects[currentProject], [projects, currentProject])

  const isMobile = isMobileCheck()

  const populateItemForm = useCallback((item?: TestItem) => {
    if (item) {
      setItemFormValues(formValuesFromItem(item))
      setEdit(item)
    }
    setShowItemModal(true)
  }, [setEdit, setItemFormValues, setShowItemModal])

  const editTest = useCallback((test: Test) => {
    setTestFormValues({ name: test.name || '', action: test.action_text, expectedError: String(test.expected_error || 0) })
    setEdit(test)
    setShowTestModal(true)
  }, [setTestFormValues, setShowTestModal])

  const updateItemFormValue = useCallback((key: string, value: string) => {
    const newValues = { ...itemFormValues }
    updateField(newValues[key], value)
    setItemFormValues(newValues)
  }, [itemFormValues, setItemFormValues])

  const updateTestFormValue = useCallback((key: TestFormField, value: string) => {
    const newValues = { ...testFormValues }
    newValues[key] = value
    setTestFormValues(newValues)
  }, [testFormValues, setTestFormValues])

  const submitTest = useCallback(async () => {
    setLoading('Saving test...')

    try {
      if (!edit) {
        await addTest(testFormValues.name, testFormValues.action.replace(/\n/g, ' '), Number(testFormValues.expectedError))
      } else {
        await updateTest(edit.id, testFormValues.name, testFormValues.action.replace(/\n/g, ' '), Number(testFormValues.expectedError))
      }
      setShowTestModal(false)
      setTestFormValues(BLANK_TEST_FORM)
      setEdit(undefined)
    } catch (e) {
      toast.error('Error saving test')
    }
    
    setLoading(undefined)
  }, [testFormValues, edit, addTest, updateTest, setLoading])

  const submitItem = useCallback(async () => {
    const validationError = validateFormValues(itemFormValues)
    if (validationError)
      return window.alert(validationError)
      
    const newItem = itemFromForm({ ...itemFormValues })

    setLoading('Saving item...')
    try {
      if (testExpectation) {
        await addTestExpectation(testExpectation, newItem)
      } else {
        await addItem(newItem, Boolean(edit))
      }
      setShowItemModal(false)
      setItemFormValues(formValuesForItem())
      setEdit(undefined)
    } catch (e) {
      toast.error('Error saving item')
    }
    setLoading(undefined)
  }, [edit, itemFormValues, testExpectation, addTestExpectation, addItem, setLoading])

  const handleDragAndDropItem = useCallback(({ source, destination }) => {
    if (!destination)
      return;

    if (source.droppableId === 'items') {
      if (destination.droppableId === 'items') {
        const newItems = [ ...Object.values(projects[currentProject].state) ]
        const reorderedItem = newItems.splice(source.index, 1)[0];
        newItems.splice(destination.index, 0, reorderedItem);
        
        // TODO: update the item order (is this even possible now?)
      }
    }
  }, [projects, currentProject]);

  const hideTestModal = () => {
    if (edit) {
      if (window.confirm('Are you sure you want to discard your changes?')) {
        setTestFormValues(BLANK_TEST_FORM)
        setShowTestModal(false)
        setEdit(undefined)
      }
    } else {
      setShowTestModal(false)
    }
  }

  const hideItemModal = () => {
    if (edit) {
      if (window.confirm('Are you sure you want to discard your changes?')) {
        setItemFormValues(formValuesForItem())
        setShowItemModal(false)
        setEdit(undefined)
        setTestExpecation('')
      }
    } else {
      setShowItemModal(false)
    }
  }

  const showTestExpectationModal = useCallback((testId: string) => (item?: TestItem) => {
    setTestExpecation(testId)
    populateItemForm(item)
  }, [setTestExpecation, populateItemForm])

  const runAllTests = useCallback((runSequentially: boolean) => () => {
    const testsToRun = (Object.values(project.tests) || [])
      .filter(({ selected }) => selected)
      .map(({ id }) => id)
    setShowRunModal(false)
    
    if (testsToRun.length) {
      setLoading('Running tests...')
      if (runSequentially) {
        runTests(testsToRun.map(id => ({ id, rate: DEFAULT_RATE, bud: DEFAULT_BUDGET })))
        .finally(() => {
          setLoading(undefined)
        })
      } else {
        Promise.all(testsToRun.map(id => runTest({ id, rate: DEFAULT_RATE, bud: DEFAULT_BUDGET })))
        .finally(() => {
          setLoading(undefined)
        })
      }
    } else {
      window.alert('Please select some tests to run.')
    }
  }, [project, runTest, runTests, setLoading, setShowRunModal])

  const isEdit = Boolean(edit)

  useDocumentTitle(`${zigguratTitleBase} Contract Tests`)
  return (
    <DragDropContext onDragEnd={handleDragAndDropItem}>
      <OpenFileHeader />
      <Row className='tests' style={{ flexDirection: isMobile ? 'column' : 'row' }}>
        <Col className='test-actions' style={{ height: isMobile ? 600 : '100%', width: isMobile ? '100%' : '50%' }}>
          <Row className='section-header'>
            <Row>
              <Text mr1 className='title'>Test Actions</Text>
            </Row>
            <Row>
              <Button className='action mr1' small onClick={() => setShowTestModal(true)}>+ Add Test</Button>
              <Button dark small className='run-all' onClick={() => setShowRunModal(true)}>
                <FaPlay size={'0.75em'} />
                Run
              </Button>
            </Row>
          </Row>
          <TestList editTest={editTest} showTestExpectationModal={showTestExpectationModal} />
        </Col>
        <Col className='granary' style={{ height: isMobile ? 600 : '100%', width: isMobile ? '100%' : '50%',  }}>
          <Row className='section-header'>
            <Text className='title'>Chain State</Text>
            <Button small className='action' onClick={() => populateItemForm()}>+ Add Data</Button>
          </Row>
          <ItemList items={Object.values(project?.state || {})} editItem={populateItemForm} />
        </Col>

        <TestModal {...{ showTestModal, hideTestModal, isEdit, testFormValues, updateTestFormValue, submitTest }} />

        <ItemModal {...{ showItemModal, hideItemModal, isEdit, itemFormValues, updateItemFormValue, setItemFormValues, submitItem, testExpectation }} />

        <Modal title='Run Selected Tests' show={showRunModal} hide={() => setShowRunModal(false)}>
          <Entry>
            <Field name='Parallel'>
              <Text>Each test will run separately.</Text>
            </Field>
          </Entry>
          <Entry>
            <Field name='Sequential'>
              <Text>Tests will run in order. Initial results will affect subsequent tests.</Text>
            </Field>
          </Entry>
          <Entry>
            <Row evenly>
              <Button wide onClick={runAllTests(false)}>Run Parallel</Button>
              <Button wide dark onClick={runAllTests(true)}>Run Sequential</Button>
            </Row>
          </Entry>
        </Modal>
        <div className='under-construction'>
          <Row className='header'>
            <FaExclamationTriangle />
            <Text>Under Construction</Text>
          </Row>
          <p>Contract tests are currently a work in progress.</p>
        </div>
      </Row>
    </DragDropContext>
  )
}
