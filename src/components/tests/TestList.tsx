import React, { useCallback, useMemo, useState } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { FaPen, FaTrash, FaChevronDown, FaChevronUp, FaCopy, FaPlay } from 'react-icons/fa';
import Col from '../spacing/Col'
import Row from '../spacing/Row'
import useContractStore from '../../store/contractStore';
import Button from '../form/Button';
import { Test, TestResult } from '../../types/TestData';
import Input from '../form/Input';
import { DEFAULT_BUDGET, DEFAULT_RATE, getStatus } from '../../utils/constants';
import { getGrainDiff, parseAction } from '../../utils/tests';
import Text from '../text/Text';
import { TestGrain } from '../../types/TestGrain';
import { GrainList } from './GrainList';
import Modal from '../popups/Modal';

import './TestList.scss'
import { displayPubKey } from '../../utils/account';

export const DROPPABLE_DIVIDER = '___'

interface TestListProps {
  editTest: (test: Test, copyFormat?: boolean) => void
  showTestExpectationModal: (testId: string) => (grain?: TestGrain) => void
}

interface TestEntryProps extends TestListProps {
  test: Test
}

const TestStatus = ({ errorCode, success }: { errorCode: number, success?: boolean | null }) =>
  <Text style={{ marginLeft: 4, color: errorCode === 0 && (success || success === null)  ? 'green' : 'red', fontWeight: 'bold' }}>
    {getStatus(errorCode)}{errorCode === 0 && typeof success === 'boolean' ? ` - ${success ? 'passed' : 'did not pass'}` : ''}
  </Text>

const ResultRow = ({ label, value, }: { label: string, value: string }) =>
  <Row>
    <Text style={{ width: 84, marginBottom: 2 }}>{label}:</Text>
    <Text>{value}</Text>
  </Row>

const TestResultDisplay = ({ result }: { result?: TestResult }) => {
  // console.log(result)
  return (
    <Col>
      <ResultRow label='Gas Used' value={String(result?.fee)} />
      {!!result && !result.success && (
        <Col>
          <Text style={{ width: 120, marginBottom: 2 }}>Test Failures:</Text>
          {Object.keys(result?.grains).filter(id => result.grains[id].match === false)
            .map(id => {
              const diff = getGrainDiff(result.grains[id].expected, result.grains[id].made)
              return (
                <Col key={id}>
                  <Row>
                    <Text style={{ width: 84, marginBottom: 2 }}>ID: </Text>
                    <Text>{displayPubKey(id)}</Text>
                  </Row>
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
    </Col>
  )
}

export const TestEntry = ({ test, editTest, showTestExpectationModal }: TestEntryProps) => {
  const { currentProject, toggleTest, deleteTest, runTest } = useContractStore()
  const [expandInput, setExpandInput] = useState(false)
  const [expandOutput, setExpandOutput] = useState(false)
  const [expandExpectations, setExpandExpectations] = useState(false)
  const [showResultsModal, setShowResultsModal] = useState(false)

  const testStyle = {
    justifyContent: 'space-between',
    margin: 8,
    padding: 8,
    border: '1px solid black',
    borderRadius: 4,
  }

  const runSingleTest = useCallback(() => runTest({ id: test.id, rate: DEFAULT_RATE, bud: DEFAULT_BUDGET }), [test, runTest])

  // TODO: add button to show the modal and to edit existing grains
  console.log(test.result.grains)

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
      <Col style={{ width: '100%', paddingTop: 6, paddingBottom: 4 }}>
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
          <Col style={{ width: '100%', marginBottom: 6 }}>
            {test.action_text.slice(1, -1).split(' ').map((line) => (
              <Text key={line} style={{ wordBreak: 'break-all', marginTop: 4 }}>{line}</Text>
            ))}
          </Col>
        )}
      </Col>
      {test.result !== undefined && (
        <Col className="output" style={{ flex: 1, marginTop: 4, paddingTop: 8, borderTop: '1px solid gray' }}>
          <Row style={{ marginBottom: 4 }}>
            {!!test.result && (<Button
              onClick={() => setExpandOutput(!expandOutput)}
              variant='unstyled'
              style={{ marginRight: 8, marginTop: 2, alignSelf: 'flex-start' }}
              iconOnly
              icon={expandOutput ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
            />)}
            {/* isRunning ? <Loader size='small' style={{ marginLeft: 8 }} dark /> :  */}
            <Row onClick={() => setShowResultsModal(true)} className='result'>
              <Text style={{ width: 56 }}>Result:</Text>
              <TestStatus errorCode={test?.result?.errorcode} success={test?.result?.success} />
            </Row>
          </Row>
          {expandOutput && <TestResultDisplay result={test.result} />}
        </Col>
      )}
      <Col className="expectations" style={{ flex: 1, marginTop: 4, paddingTop: 8, borderTop: '1px solid gray' }}>
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
      </Col>
      <Modal show={showResultsModal} hide={() => setShowResultsModal(false)}>
        {JSON.stringify(test.result?.grains)}
      </Modal>
    </Col>
  )
}

export const TestList = ({ editTest, showTestExpectationModal }: TestListProps) => {
  const { projects, currentProject } = useContractStore()
  const project = useMemo(() => projects[currentProject], [currentProject, projects])

  if (!project || !project.tests) {
    return null
  }

  return (
    <Col className="test-list">
      {Object.values(project.tests).map(test => <TestEntry key={test.id} {...{test, editTest, showTestExpectationModal}} />)}
    </Col>
  )
}
