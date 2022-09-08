import React, { useCallback, useMemo, useState } from 'react'
import { FaPen, FaTrash, FaChevronRight, FaChevronDown, FaPlay } from 'react-icons/fa';
import Col from '../../components/spacing/Col'
import Row from '../../components/spacing/Row'
import useZigguratStore from '../../stores/zigguratStore';
import Button from '../../components/form/Button';
import { Test } from '../../types/ziggurat/TestData';
import Input from '../../components/form/Input';
import { DEFAULT_BUDGET, DEFAULT_RATE,  STATUS_CODES } from '../../utils/constants';
import {  parseAction } from '../../utils/tests';
import Text from '../../components/text/Text';
import { GrainList } from './GrainList';
import TestStatus from './TestStatus'
import { TestListProps} from './TestList'
import Entry from '../../components/spacing/Entry';
import Field from '../../components/spacing/Field';
import TestResultDisplay from './TestResultDisplay';
import classNames from 'classnames';

interface TestEntryProps extends TestListProps {
  test: Test
}


export const TestEntry = ({ test, editTest, showTestExpectationModal }: TestEntryProps) => {
  const { currentProject, toggleTest, deleteTest, runTest } = useZigguratStore()
  const [expandInput, setExpandInput] = useState(false)
  const [expandOutput, setExpandOutput] = useState(false)
  const [expandExpectations, setExpandExpectations] = useState(false)
 

  const runSingleTest = useCallback(() => runTest({ id: test.id, rate: DEFAULT_RATE, bud: DEFAULT_BUDGET }), [test, runTest])

  return (
    <Col className={'test-entry ' + classNames({ selected: test.selected })}>
      <Row between className='test-title'>
        <Row>
          <Input type='checkbox' checked={!!test.selected} onChange={() => toggleTest(currentProject, test.id)} />
          <Text ml1>{test.name ? test.name : parseAction(test)}</Text>
        </Row>
        <Row>
          <Button icon={<FaPlay size={12} />} iconOnly small onClick={runSingleTest} />
          <Button onClick={() => editTest(test)} iconOnly small icon={<FaPen size={14} />} />
          <Button onClick={() => { 
            if(window.confirm('Are you sure you want to remove this test?')) deleteTest(test.id) 
          }} icon={<FaTrash size={14} />} iconOnly small />
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
              {STATUS_CODES[test.expected_error] || 'None provided'}
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
            <Field name='Result'>
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
        {expandExpectations && <GrainList testId={test.id} grains={Object.values(test?.expected || {})} editGrain={showTestExpectationModal(test.id)} />}
      </Entry>
    </Col>
  )
}