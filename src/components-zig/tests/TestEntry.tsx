import React, { useCallback, useState } from 'react'
import { FaChevronRight, FaChevronDown, FaPlay, FaRegEdit, FaRegTrashAlt, FaSpinner } from 'react-icons/fa';
import Col from '../../components/spacing/Col'
import Row from '../../components/spacing/Row'
import useZigguratStore from '../../stores/zigguratStore';
import Button from '../../components/form/Button';
import { Test } from '../../types/ziggurat/TestData';
import Input from '../../components/form/Input';
import { DEFAULT_BUDGET, DEFAULT_RATE,  STATUS_CODES_RAW } from '../../utils/constants';
import {  parseAction } from '../../utils/tests';
import Text from '../../components/text/Text';
import { ItemList } from './ItemList';
import TestStatus from './TestStatus'
import { TestListProps } from './TestList'
import Entry from '../../components/spacing/Entry';
import Field from '../../components/spacing/Field';
import TestResultDisplay from './TestResultDisplay';
import classNames from 'classnames';
import Checkbox from '../forms/Checkbox';

import './TestEntry.scss'

interface TestEntryProps extends TestListProps {
  test: Test
}

export const TestEntry = ({ test, editTest, showTestExpectationModal }: TestEntryProps) => {
  const { currentProject, toggleTest, deleteTest, runTest } = useZigguratStore()
  const [running, setRunning] = useState(false)
  const our: string = (window as any)?.api?.ship || ''
  const lsPrefix = `zs-${our}-${test.id}`
  // TODO: surely there is a better way to do this.
  const [expandInput, _setExpandInput] = useState(localStorage.getItem(lsPrefix+'expandInput') === 'true')
  const [expandOutput, _setExpandOutput] = useState(localStorage.getItem(lsPrefix+'expandOutput') === 'true')
  const [expandExpectations, _setExpandExpectations] = useState(localStorage.getItem(lsPrefix+'expandExpectations') === 'true')

  const setExpandInput = (b:boolean) => {
    localStorage.setItem(lsPrefix+'expandInput', `${b}`)
    _setExpandInput(b)
  }
  const setExpandOutput = (b:boolean) => {
    localStorage.setItem(lsPrefix+'expandOutput', `${b}`)
    _setExpandOutput(b)
  }
  const setExpandExpectations = (b:boolean) => {
    localStorage.setItem(lsPrefix+'expandExpectations', `${b}`)
    _setExpandExpectations(b)
  }

  const runSingleTest = useCallback(() => {
    setRunning(true)
    runTest({ id: test.id, rate: DEFAULT_RATE, bud: DEFAULT_BUDGET })
    .then(() => {
      setRunning(false)
    })
  }, [test, runTest])

  return (
    <Col className={'test-entry ' + classNames({ selected: test.selected, running })}>
      <Row className='overlay'>
        <FaSpinner className='spinner' />
      </Row>
      <Row between className='test-title'>
        <Row>
          <Checkbox label={test.name ? test.name : parseAction(test)} isSelected={!!test.selected} onCheckboxChange={() => toggleTest(currentProject, test.id)} />
        </Row>
        <Row>
          <Button icon={<FaPlay size={12} />} iconOnly small onClick={runSingleTest} />
          <Button onClick={() => editTest(test)} iconOnly small icon={<FaRegEdit size={14} />} />
          <Button onClick={() => { 
            if(window.confirm('Are you sure you want to remove this test?')) deleteTest(test.id) 
          }} icon={<FaRegTrashAlt size={14} />} iconOnly small />
        </Row>
      </Row>
      <Entry divide>
        <Row>
          <Button
            onClick={() => setExpandInput(!expandInput)}
            variant='unstyled'
            iconOnly small 
            icon={expandInput ? <FaChevronDown size={16} /> : <FaChevronRight size={16} />}
          />
          <Field name='Input'>
            {test.action_text.slice(1).split(' ')[0]}
          </Field>
        </Row>
        {expandInput && (
          <Entry>
            <Field name='Expected Status'>
              {STATUS_CODES_RAW[test.expected_error] || 'None provided'}
            </Field>
            <Field name='Data'>
              <Col>
                {test.action_text.slice(1, -1).split(' ').map((line) => (
                  <Text mono breakAll key={line} style={{marginBottom: '0.25em'}}>{line}</Text>
                  ))}
              </Col>
            </Field>
          </Entry>
        )}
      </Entry>
      {test.result &&  (
        <Entry divide className='output' >
          <Row>
            {!!test.result && (<Button
              onClick={() => setExpandOutput(!expandOutput)}
              variant='unstyled'
              iconOnly 
              icon={expandOutput ? <FaChevronDown size={16} /> : <FaChevronRight size={16} />}
            />)}
            <Field name='Result' className='center'>
              <TestStatus errorCode={test?.result?.errorcode} success={test?.result?.success} expectedError={test.expected_error} />
            </Field>
          </Row>
          {expandOutput && <TestResultDisplay result={test.result} expectedError={test.expected_error} />}
        </Entry>
      )}
     
      <Entry className='expectations'>
        <Row>
          <Button
            onClick={() => setExpandExpectations(!expandExpectations)}
            variant='unstyled'
            iconOnly
            icon={expandExpectations ? <FaChevronDown size={16} /> : <FaChevronRight size={16} />}
          />
          <Field name='Expectations'>
            ({Object.keys(test.expected).length})
          </Field>
          <Button style={{ marginLeft: 'auto' }} onClick={() => showTestExpectationModal(test.id)()} small>
            + Add
          </Button>
        </Row>
        {expandExpectations && <ItemList isExpectationsList={true} testId={test.id} items={Object.values(test?.expected || {})} editItem={showTestExpectationModal(test.id)} />}
      </Entry>
    </Col>
  )
}