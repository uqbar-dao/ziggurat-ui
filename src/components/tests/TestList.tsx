import React, { useCallback, useMemo, useState } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { FaPen, FaTrash, FaChevronDown, FaChevronUp, FaCopy } from 'react-icons/fa';
import Col from '../spacing/Col'
import Row from '../spacing/Row'
import useContractStore from '../../store/contractStore';
import Button from '../form/Button';
import { Test } from '../../types/TestData';
import Input from '../form/Input';
import Loader from '../popups/Loader';
import { getStatus } from '../../utils/constants';

export const DROPPABLE_DIVIDER = '___'

interface TestEntryProps extends TestListProps {
  test: Test
  testIndex: number
}

export const TestEntry = ({ test, testIndex, editTest }: TestEntryProps) => {
  const { deleteTest } = useContractStore()
  const [expandInput, setExpandInput] = useState(false)
  const [expandOutput, setExpandOutput] = useState(false)

  const testStyle = {
    justifyContent: 'space-between',
    margin: 8,
    padding: 8,
    border: '1px solid black',
    borderRadius: 4,
  }

  // TODO: modify the test at the store level
  const toggleTestFocus = useCallback(() => {
    test.focus = !test.focus
  }, [test])

  const toggleTestExclude = useCallback(() => {
    test.exclude = !test.exclude
  }, [test])

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
          {test.name ? test.name : `Action: ${test.action.split(' ')[0].slice(1)}`}
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
            {test.action}
          </Col>
        )}
      </Col>
      {test.last_result !== undefined && <Col className="output" style={{ flex: 1, marginTop: 4, paddingTop: 8, borderTop: '1px solid gray' }}>
        <Row style={{ marginBottom: 4 }}>
          {!!test.last_result && (<Button
            onClick={() => setExpandOutput(!expandOutput)}
            variant='unstyled'
            style={{ marginRight: 8, marginTop: 2, alignSelf: 'flex-start' }}
            iconOnly
            icon={expandOutput ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
          />)}
          {test.last_result ? 'Expected' : ''} Output: {test.errorcode === -1 ? <Loader size='small' style={{ marginLeft: 8 }} dark /> : getStatus(test.errorcode)}
        </Row>
        {expandOutput && (
          <Col>
            {JSON.stringify(test.last_result) || 'null'}
          </Col>
        )}
      </Col>}
    </Col>
  )
}

interface TestListProps {
  editTest: (test: Test, copyFormat?: boolean) => void
}

export const TestList = ({ editTest }: TestListProps) => {
  const { projects, currentProject } = useContractStore()
  const project = useMemo(() => projects[currentProject], [currentProject, projects])

  return (
    <Col className="test-list">
      {Object.values(project.tests).map((test, i) => <TestEntry key={test.id} test={test} testIndex={i} editTest={editTest} />)}
    </Col>
  )
}
