import React, { useCallback, useMemo, useState } from 'react'
import Iframe from 'react-iframe';
import { DragDropContext } from 'react-beautiful-dnd';
import { FaMinusCircle, FaPlay } from 'react-icons/fa';
import { isMobileCheck } from '../../utils/dimensions'
import Col from '../spacing/Col'
import Row from '../spacing/Row'
import useContractStore from '../../store/contractStore';
import Modal from '../popups/Modal';
import Button from '../form/Button';
import Input from '../form/Input';
import { copyFormValues, generateFormValues, grainFromForm, testFromForm, GRAIN_FORM_VALUES_COMMON, updateField, validateFormValues } from '../../utils/form';
import { Select } from '../form/Select';
import { DROPPABLE_DIVIDER, TestList } from './TestList';
import { GrainList } from './GrainList';
import { TestGrain, } from '../../types/TestGrain';
import { Test } from '../../types/TestData';
import { EMPTY_PROJECT } from '../../types/Project';
import { genRanHex } from '../../utils/number';
import { UqbarType, UQBAR_TYPES } from '../../types/UqbarType';
import { TestModal } from './TestModal';
import { FormValues } from '../../types/FormValues';

import './Tests.scss'
import { addHexDots } from '../../utils/format';

const WEBTERM_PATH = '/apps/webterm'
const GRAIN_FORM_COMMON_LENGTH = Object.keys(GRAIN_FORM_VALUES_COMMON).length

export interface TestViewProps {}

export const TestView = () => {
  const { projects, currentProject, setLoading, addTest, updateTest, addGrain, updateGrain, setGrains, runTests } = useContractStore()

  const project = useMemo(() => projects.find(p => p.title === currentProject), [currentProject, projects])
  const { testData, molds } = useMemo(() => project || EMPTY_PROJECT, [project])

  const [showTestModal, setShowTestModal] = useState(false)
  const [showGrainModal, setShowGrainModal] = useState(false)
  const [grainFormValues, setGrainFormValues] = useState<FormValues>({})
  const [testFormValues, setTestFormValues] = useState<FormValues>({ testString: { type: 'none', value: '' } })
  const [grainType, setGrainType] = useState('')
  const [actionType, setActionType] = useState('')
  const [newGrainField, setNewGrainField] = useState('')
  const [newGrainFieldType, setNewGrainFieldType] = useState(`@t`)
  const [edit, setEdit] = useState<Test | TestGrain | undefined>()

  const isMobile = isMobileCheck()

  const grainFieldPlaceHolder = useMemo(() => `field${Object.keys(grainFormValues).length}`, [grainFormValues])

  const selectRice = useCallback((rice, grain?, copy?) => {
    setGrainFormValues(generateFormValues({ type: 'grain', name: rice, data: molds.rice[rice], edit: grain, copy }))
    setGrainType(rice)
  }, [molds.rice, setGrainFormValues, setGrainType])

  const editGrain = useCallback((grain: TestGrain, copyFormat?: boolean) => {
    selectRice(grain.label, grain, copyFormat)
    setShowGrainModal(true)
    if (!copyFormat) {
      setEdit(grain)
    }
  }, [selectRice, setShowGrainModal])

  const selectAction = useCallback((action: string, test?: Test, copy?: boolean) => {
    if (test)
      setTestFormValues(copyFormValues({ testString: test.input }))
    if (!copy)
      setEdit(test)
    setActionType(action)
  }, [setTestFormValues])

  const editTest = useCallback((test: Test, copyFormat?: boolean) => {
    selectAction(test.input.value, test, copyFormat)
    setShowTestModal(true)
  }, [selectAction, setShowTestModal])

  const updateGrainFormValue = useCallback((key: string, value: string) => {
    const newValues = { ...grainFormValues }
    updateField(newValues[key], value)
    setGrainFormValues(newValues)
  }, [grainFormValues, setGrainFormValues])

  const updateTestFormValue = useCallback((key: string, value: string) => {
    const newValues = { ...testFormValues }
    newValues[key].value = value
    setTestFormValues(newValues)
  }, [testFormValues, setTestFormValues])

  const addGrainField = useCallback(() => {
    const newValues = { ...grainFormValues }
    newValues[newGrainField] = { value: '', type: newGrainFieldType as UqbarType }
    setGrainFormValues(newValues)
    setNewGrainField('')
  }, [newGrainField, newGrainFieldType, grainFormValues, setGrainFormValues])

  const removeGrainField = useCallback((key: string) => () => {
    const newValues = { ...grainFormValues }
    delete newValues[key]
    setGrainFormValues(newValues)
  }, [grainFormValues, setGrainFormValues])

  const submitTest = useCallback((isUpdate = false) => async () => {
    setLoading('Saving test...')
    const validationError = validateFormValues(testFormValues)

    if (validationError) {
      return window.alert(validationError)
    }

    if (isUpdate && edit) {
      const oldTest = edit as any
      const newTest = testFromForm(testFormValues, actionType, oldTest.id)
      // newTest.input.cart = oldTest.input.cart
      // Object.keys(oldTest.input.action).forEach(key => {
      //   if (testFormValues[key] && testFormValues[key].type.includes('%grain')) {
      //     newTest.input.action[key] = oldTest.input.action[key]
      //   }
      // })
      await updateTest(newTest)
    } else {
      await addTest(testFromForm(testFormValues, actionType, addHexDots(genRanHex(20))))
    }
    setActionType('')
    setShowTestModal(false)
    setTestFormValues({})
    setEdit(undefined)
    setLoading(undefined)
  }, [testFormValues, edit, actionType, addTest, updateTest, setLoading])

  const submitGrain = useCallback((isUpdate = false) => async () => {
    setLoading('Saving grain...')
    const validationError = validateFormValues(grainFormValues)

    if (validationError) {
      return window.alert(validationError)
    }

    const newGrain = grainFromForm(grainFormValues, grainType)

    if (isUpdate) {
      await updateGrain(newGrain)
    } else {
      const targetProject = projects.find(({ title }) => title === currentProject)
      if (targetProject) {
        if (targetProject.testData.grains.find(({ id }) => id === newGrain.id)) {
          return window.alert('You already have a grain with this ID, please change the ID')
        }
      }

      await addGrain(newGrain)
    }
    setGrainType('')
    setShowGrainModal(false)
    setGrainFormValues({})
    setEdit(undefined)
    setLoading(undefined)
  }, [currentProject, projects, grainType, grainFormValues, addGrain, updateGrain, setLoading])

  const handleDragAndDropGrain = useCallback(({ source, destination }) => {
    if (!destination)
      return;

    if (source.droppableId === 'grains') {
      if (destination.droppableId === 'grains') {
        const newGrains = [ ...testData.grains ]
        const reorderedItem = newGrains.splice(source.index, 1)[0];
        newGrains.splice(destination.index, 0, reorderedItem);
        return setGrains(newGrains)
      }
      // if the source is "grains", then add to the destination action or cart as appropriate
      // const [id, iden]: string[] = destination.droppableId.split(DROPPABLE_DIVIDER)
      // const test = testData.tests.find((t) => t.id === id)
      // if (test) {
      //   const newTest = { ...test }
      //   const field: any = newTest.input.action[iden]

      //   if (field instanceof Array) {
      //     if (!field.find((g: string) => g === testData.grains[source.index].id)) {
      //       // replace the grain entirely if the type is not a %set, %list, %map
      //       const typeInfo = molds.actions[newTest.input.action.type as string][iden] as (string | string[])
      //       if (typeInfo === '%grain' || (typeInfo.includes('%grain') && typeInfo.includes('%unit'))) {
      //         newTest.input.action[iden] = [testData.grains[source.index].id]
      //       } else {
      //         field.push(testData.grains[source.index].id)
      //       }
      //     }
      //   } else {
      //     if (!newTest.input.cart.grains.find((g) => g === testData.grains[source.index].id)) {
      //       newTest.input.cart.grains.push(testData.grains[source.index].id)
      //     }
      //   }
      //   updateTest(newTest)
      // }
    } else {
      // if the source is not "grains", then remove from the source action or cart as appropriate

    }
  }, [testData, molds, updateTest, setGrains]);

  const hideTestModal = () => {
    if (window.confirm('Are you sure you want to discard your changes?')) {
      setTestFormValues({})
      setShowTestModal(false)
      setEdit(undefined)
      setActionType('')
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

  const isEdit = Boolean(edit)

  return (
    <DragDropContext onDragEnd={handleDragAndDropGrain}>
      <Row className="tests" style={{ flexDirection: isMobile ? 'column' : 'row' }}>
        <Col style={{ height: isMobile ? 600 : '100%', width: isMobile ? '100%' : '50%' }}>
          <Row className="section-header">
            <Row>
              <Row className="title" style={{ marginRight: 8 }}>Tests</Row>
              <Button onClick={runTests} variant='unstyled' iconOnly icon={<FaPlay size={14} />} />
            </Row>
            <Row className="action" onClick={() => setShowTestModal(true)}>+ Add Test</Row>
          </Row>
          <TestList editTest={editTest} molds={molds} />
        </Col>
        <Col style={{ height: isMobile ? 600 : '100%', width: isMobile ? '100%' : '50%' }}>
          <Col style={{ height: isMobile ? 400 : '70%', width: '100%', borderLeft: '1px solid lightgray' }}>
            <Row className="section-header">
              <Row className="title">Test Granary</Row>
              <Row>
                <Row className="action" onClick={() => setShowGrainModal(true)}>Refresh</Row>
                <Row className="action" onClick={() => setShowGrainModal(true)}>+ Add Grain</Row>
              </Row>
            </Row>
            <GrainList editGrain={editGrain} />
          </Col>
          <Iframe url={WEBTERM_PATH} height={isMobile? '200px' : '30%'} width='100%' />
        </Col>

        <TestModal {...{ showTestModal, hideTestModal, actionType, selectAction, isEdit, molds, testFormValues, setTestFormValues, updateTestFormValue, submitTest }} />

        <Modal show={showGrainModal} hide={hideGrainModal}>
          <Col style={{ minWidth: 320, maxHeight: 'calc(100vh - 80px)', overflow: 'scroll' }}>
            <h3 style={{ marginTop: 0 }}>{isEdit ? 'Update' : 'Add New'} Grain</h3>
            {/* <Select onChange={(e) => selectRice(e.target.value)} value={grainType} disabled={isEdit}>
              <option>Select a Grain Type</option>
              {Object.keys(molds.rice).map(key => (
                <option key={key} value={key}>{key}</option>
              ))}
            </Select> */}
            {Object.keys(grainFormValues).map((key, index) => (
              <Row key={key}>
                <Input
                  disabled={key === 'id' && isEdit}
                  onChange={(e) => updateGrainFormValue(key, e.target.value)}
                  value={grainFormValues[key].value}
                  label={`${key} (${JSON.stringify(grainFormValues[key].type).replace(/"/g, '')})`}
                  placeholder={key}
                  containerStyle={{ marginTop: 4, width: '100%' }}
                />
                {index >= GRAIN_FORM_COMMON_LENGTH && (
                  <Button onClick={removeGrainField(key)} style={{ marginTop: 24, marginLeft: 8 }} variant="unstyled" iconOnly icon={<FaMinusCircle />} />
                )}
              </Row>
            ))}

            {/* <Col style={{ marginTop: 12, borderTop: '1px solid black', paddingTop: 12 }}>
              <Text>Custom fields should match the grain type in 'types', order matters!</Text>
              <Text>For more complex types (map, list, unit) use 'none'</Text>
              <Row style={{ marginTop: 12 }}>
                <Input
                  onChange={(e) => setNewGrainField(e.target.value)}
                  value={newGrainField}
                  placeholder={grainFieldPlaceHolder}
                  containerStyle={{ width: 'calc(100% - 176px)' }}
                />
                <Select onChange={(e) => setNewGrainFieldType(e.target.value)}
                  value={newGrainFieldType}
                  style={{ marginLeft: 8, width: 60, padding: '6px' }}>
                  {UQBAR_TYPES.map(t => (
                    <option key={t}>{t}</option>
                  ))}
                </Select>
                <Button onClick={addGrainField} style={{ marginLeft: 8, padding: '4px 8px', width: 100, justifyContent: 'center' }} variant="dark">Add Field</Button>
              </Row>
            </Col> */}

            <Button onClick={submitGrain(isEdit)} style={{ alignSelf: 'center', marginTop: 16 }}>{isEdit ? 'Update' : 'Add'} Grain</Button>
          </Col>
        </Modal>
      </Row>
    </DragDropContext>
  )
}
