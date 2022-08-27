import React, { useCallback, useMemo, useState } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { FaPen, FaTrash, FaChevronDown, FaChevronUp, FaCopy } from 'react-icons/fa';
import Col from '../spacing/Col'
import Row from '../spacing/Row'
import useContractStore from '../../store/contractStore';
import Button from '../form/Button';
import { Test } from '../../types/TestData';
import { EMPTY_PROJECT } from '../../types/Project';
import { Molds } from '../../types/Molds';
import { Values } from './ValuesDisplay';
import Input from '../form/Input';
import { truncateString } from '../../utils/format';
import Loader from '../popups/Loader';
import { getStatus } from '../../utils/constants';

export const DROPPABLE_DIVIDER = '___'

interface TestEntryProps extends TestListProps {
  test: Test
  testIndex: number
  molds: Molds
}

export const TestEntry = ({ test, testIndex, editTest, molds }: TestEntryProps) => {
  // need to handle action recursively
  const { currentProject, testOutput, removeTest, updateTest } = useContractStore()
  const [expandInput, setExpandInput] = useState(false)
  const [expandOutput, setExpandOutput] = useState(false)

  const testStyle = {
    justifyContent: 'space-between',
    margin: 8,
    padding: 8,
    border: '1px solid black',
    borderRadius: 4,
  }

  const toggleTestFocus = useCallback(() => {
    updateTest({ ...test, focus: !test.focus })
  }, [test, updateTest])

  const toggleTestExclude = useCallback(() => {
    updateTest({ ...test, exclude: !test.exclude })
  }, [test, updateTest])

  const output = testOutput.find(({ id, project }) => id === test.id && project === currentProject)

  return (
    <Col className="action" style={{ ...testStyle, position: 'relative' }}>
      <Row style={{ justifyContent: 'space-between', borderBottom: '1px solid gray', paddingBottom: 2, marginBottom: 4 }}>
        <Row style={{ marginBottom: 4, marginLeft: -4 }}>
          <Row>
            <Input type="checkbox" checked={Boolean(test.focus)} onChange={toggleTestFocus} />
            <div>Focus</div>
          </Row>
          <Row style={{ marginLeft: 4 }}>
            <Input type="checkbox" checked={Boolean(test.exclude)} onChange={toggleTestExclude} />
            <div>Exclude</div>
          </Row>
        </Row>
        <Row style={{ marginRight: 4, marginTop: -4 }}>
          <Button
            onClick={() => editTest(test, true)}
            variant='unstyled'
            iconOnly
            icon={<FaCopy size={14} />}
          />
          <Button
            onClick={() => editTest(test)}
            variant='unstyled'
            iconOnly
            icon={<FaPen size={14} />}
            style={{ marginLeft: 8 }}
          />
          <Button
            onClick={() => { if(window.confirm('Are you sure you want to remove this test?')) removeTest(testIndex) }}
            variant='unstyled'
            style={{ marginLeft: 8 }}
            icon={<FaTrash size={16} />}
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
          Action: {test.input.value.split(' ')[0].slice(1)}
        </Row>
        {expandInput && (
          <Col style={{ width: '100%', marginBottom: 6 }}>
            {/* display the formValues */}
            {/* {Object.keys(test.input.formValues).map(key => {
              const value = test.input.formValues[key].value

              return (
                <Row style={{ marginTop: 4 }} key={key}>
                  <div style={{ width: 110 }}>{key}:</div>
                  <div>{value.length > 11 ? truncateString(value) : value}</div>
                </Row>
              )
            })} */}
            {test.input.value}
          </Col>
        )}
      </Col>
      {output !== undefined && <Col className="output" style={{ flex: 1, marginTop: 4, paddingTop: 8, borderTop: '1px solid gray' }}>
        <Row style={{ marginBottom: 4 }}>
          {!!test.output && (<Button
            onClick={() => setExpandOutput(!expandOutput)}
            variant='unstyled'
            style={{ marginRight: 8, marginTop: 2, alignSelf: 'flex-start' }}
            iconOnly
            icon={expandOutput ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
          />)}
          {test.output ? 'Expected' : ''} Output: {output.status === -1 ? <Loader size='small' style={{ marginLeft: 8 }} dark /> : getStatus(output.status)}
        </Row>
        {expandOutput && (
          <Col>
            {JSON.stringify(test.output) || 'null'}
          </Col>
        )}
      </Col>}
    </Col>
  )
}

interface TestListProps {
  editTest: (test: Test, copyFormat?: boolean) => void
  molds: Molds
}

export const TestList = ({ editTest, molds }: TestListProps) => {
  const { projects, currentProject } = useContractStore()
  const project = useMemo(() => projects.find(p => p.title === currentProject), [currentProject, projects])
  const { testData } = useMemo(() => project || EMPTY_PROJECT, [project])

  return (
    <Col className="test-list">
      {testData.tests.map((test, i) => <TestEntry key={test.id} test={test} testIndex={i} editTest={editTest} molds={molds} />)}
    </Col>
  )
}
