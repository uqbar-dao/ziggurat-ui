import React, { useCallback, useMemo, useState } from 'react'
import { FaPen, FaTrash, FaChevronDown, FaChevronUp, FaPlay } from 'react-icons/fa';
import Col from '../spacing/Col'
import Row from '../spacing/Row'
import useProjectStore from '../../ui-ziggurat/store/projectStore';
import Button from '../form/Button';
import { Test, TestResult } from '../../types/ziggurat/TestData';
import Input from '../form/Input';
import { DEFAULT_BUDGET, DEFAULT_RATE, getStatus, STATUS_CODES } from '../../utils/constants';
import { getGrainDiff, parseAction } from '../../utils/tests';
import Text from '../text/Text';
import { TestGrain } from '../../types/ziggurat/TestGrain';
import { GrainList } from './GrainList';
import { displayPubKey } from '../../utils/account';
import Modal from '../popups/Modal';

import './TestList.scss'
import Entry from '../form/Entry';
import Divider from '../spacing/Divider';
import Field from '../form/Field';

export const DROPPABLE_DIVIDER = '___'

interface TestListProps {
  editTest: (test: Test, copyFormat?: boolean) => void
  showTestExpectationModal: (testId: string) => (grain?: TestGrain) => void
}

interface TestEntryProps extends TestListProps {
  test: Test
}

interface TestStatusProps { errorCode: number, success?: boolean | null, expectedError: number }

const TestStatus = ({ errorCode, success, expectedError }: TestStatusProps) => {
  const correctStatus = errorCode === expectedError
  const statusInfo = correctStatus && typeof success === 'boolean' ?
    ` - ${success ? 'passed' : 'did not pass'}` :
    !correctStatus && errorCode !== undefined ? ' - wrong status code' :
    ''

  return (
    <Text style={{ marginLeft: 4, color: correctStatus && (success || success === null)  ? 'green' : 'red', fontWeight: 'bold' }}>
      {getStatus(errorCode)}{statusInfo}
    </Text>
  )
}
  

const ResultRow = ({ label, value, }: { label: string, value: string }) =>
  <Row style={{ alignItems: 'flex-start' }}>
    <div style={{ width: 100, marginBottom: 2 }}>{label}:</div>
    <div style={{ wordBreak: 'break-word', width: 'calc(100% - 100px)' }}>{value}</div>
  </Row>

const TestResultDisplay = ({ result, expectedError }: { result?: TestResult, expectedError: number }) => {
  const [showAllResultsModal, setShowAllResultsModal] = useState(false)

  return (
    <Col>
      <ResultRow label='Gas Used' value={String(result?.fee)} />
      {!!result && result.success === false && (
        <Col>
          <Text style={{ width: 120, marginBottom: 2 }}>Test Failures:</Text>
          {result?.errorcode !== expectedError && (
            <ResultRow label="Status Code" value={`expected: ${STATUS_CODES[expectedError]}, got: ${STATUS_CODES[result.errorcode]}`} />
          )}
          {Object.keys(result?.grains).filter(id => result.grains[id].match === false)
            .map(id => {
              if (result.grains[id].expected && !result.grains[id].made) {
                return (
                  <Col key={id}>
                    <ResultRow label='ID' value={displayPubKey(id)} />
                    <ResultRow label='Error' value='No grain matching that expectation' />
                  </Col>
                )
              }
              const diff = getGrainDiff(result.grains[id].expected, result.grains[id].made)
              return (
                <Col key={id}>
                  <ResultRow label='ID' value={displayPubKey(id)} />
                  {Object.keys(diff).map(field => (
                    <Col key={field}>
                      <ResultRow label='Field' value={field} />
                      <ResultRow label='Expected' value={String(diff[field].expected)} />
                      <ResultRow label='Actual' value={String(diff[field].result)} />
                    </Col>
                  ))}
                </Col>
              )
            })
          }
        </Col>
      )}
      <Button onClick={() => setShowAllResultsModal(true)} variant="dark" style={{ fontSize: 14, padding: '2px 6px', margin: '6px 0' }}>Show full test output</Button>
      <Modal show={showAllResultsModal} hide={() => setShowAllResultsModal(false)}>
        <h3>Full Test Results</h3>
        {result?.grains && Object.keys(result.grains).length ? (
          Object.keys(result.grains).map(id => (
            <Col key={id}>
              <ResultRow label='Grain ID' value={displayPubKey(id)} />
              <ResultRow label='Match' value={JSON.stringify(result.grains[id].match)} />
              <ResultRow label='Expected' value={JSON.stringify(result.grains[id].expected)} />
              <ResultRow label='Result' value={JSON.stringify(result.grains[id].made)} />
            </Col>
          ))
        ) : (
          <Text>This test did not modify chain state.</Text>
        )}
      </Modal>
    </Col>
  )
}

export const TestEntry = ({ test, editTest, showTestExpectationModal }: TestEntryProps) => {
  const { currentProject, toggleTest, deleteTest, runTest } = useProjectStore()
  const [expandInput, setExpandInput] = useState(false)
  const [expandOutput, setExpandOutput] = useState(false)
  const [expandExpectations, setExpandExpectations] = useState(false)

  const testStyle = {
    justifyContent: 'space-between',
    margin: 8,
    padding: 8,
    border: '1px solid black',
    borderRadius: 4,
  }

  const runSingleTest = useCallback(() => runTest({ id: test.id, rate: DEFAULT_RATE, bud: DEFAULT_BUDGET }), [test, runTest])

  return (
    <Col className="test-list" style={{ ...testStyle, position: 'relative' }}>
      <Row style={{ justifyContent: 'space-between', borderBottom: '1px solid gray', paddingBottom: 2, marginBottom: 4 }}>
        <Row style={{ marginBottom: 4, marginLeft: -4 }}>
          <Row>
            <Input type="checkbox" checked={!!test.selected} onChange={() => toggleTest(currentProject, test.id)} />
            <div>Selected</div>
          </Row>
          <Button style={{ marginLeft: 8 }} variant="unstyled" icon={<FaPlay size={12} />} iconOnly onClick={runSingleTest} />
        </Row>
        <Row style={{ marginRight: 4, marginTop: -4 }}>
          {/* <Button
            onClick={() => editTest(test, true)}
            variant='unstyled'
            iconOnly
            icon={<FaCopy size={14} />}
          /> */}
          <Button
            onClick={() => editTest(test)}
            variant='unstyled'
            iconOnly
            icon={<FaPen size={14} />}
            style={{ marginLeft: 8 }}
          />
          <Button
            onClick={() => { if(window.confirm('Are you sure you want to remove this test?')) deleteTest(test.id) }}
            variant='unstyled'
            style={{ marginLeft: 8 }}
            icon={<FaTrash size={14} />}
            iconOnly
          />
        </Row>
      </Row>
      <Entry>
        <Row style={{ marginBottom: 4 }}>
          <Button
            onClick={() => setExpandInput(!expandInput)}
            variant='unstyled'
            style={{ marginRight: 8, marginTop: 2, alignSelf: 'flex-start' }}
            iconOnly
            icon={expandInput ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
          />
          {test.name ? test.name : parseAction(test)}
        </Row>
        {expandInput && (
          <Entry>
            <Field name='Expected Status Code'>
              {STATUS_CODES[test.expected_error]}
            </Field>
            {test.action_text.slice(1, -1).split(' ').map((line) => (
              <Text key={line} style={{ wordBreak: 'break-all', marginTop: 4 }}>{line}</Text>
            ))}
          </Entry>
        )}
      </Entry>
      <Divider/>
      {test.result !== undefined && (
        <Entry className="output" >
          <Row style={{ marginBottom: 4 }}>
            {!!test.result && (<Button
              onClick={() => setExpandOutput(!expandOutput)}
              variant='unstyled'
              style={{ marginRight: 8, marginTop: 2, alignSelf: 'flex-start' }}
              iconOnly
              icon={expandOutput ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
            />)}
            {/* isRunning ? <Loader size='small' style={{ marginLeft: 8 }} dark /> :  */}
            <Field name='Result'>
              <TestStatus errorCode={test?.result?.errorcode} success={test?.result?.success} expectedError={test.expected_error} />
            </Field>
          </Row>
          {expandOutput && <TestResultDisplay result={test.result} expectedError={test.expected_error} />}
        </Entry>
      )}
      <Divider/>
      <Entry className="expectations">
        <Row style={{ marginBottom: 4, justifyContent: 'space-between' }}>
          <Row>
            <Button
              onClick={() => setExpandExpectations(!expandExpectations)}
              variant='unstyled'
              style={{ marginRight: 8, marginTop: 2, alignSelf: 'flex-start' }}
              iconOnly
              icon={expandExpectations ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
            />
            {/* isRunning ? <Loader size='small' style={{ marginLeft: 8 }} dark /> :  */}
            Expectations: ({Object.keys(test.expected).length})
          </Row>
          <Button onClick={() => showTestExpectationModal(test.id)()} variant='dark' style={{ fontSize: 14, padding: '2px 8px' }}>
            + Add
          </Button>
        </Row>
        {expandExpectations && <GrainList testId={test.id} grains={Object.values(test?.expected || {})} editGrain={showTestExpectationModal(test.id)} />}
      </Entry>
    </Col>
  )
}

export const TestList = ({ editTest, showTestExpectationModal }: TestListProps) => {
  const { contracts, currentProject } = useProjectStore()
  const project = useMemo(() => contracts[currentProject], [currentProject, contracts])

  if (!project || !project.tests) {
    return null
  }

  return (
    <Col className="test-list">
      {Object.values(project.tests).map(test => <TestEntry key={test.id} {...{test, editTest, showTestExpectationModal}} />)}
    </Col>
  )
}
