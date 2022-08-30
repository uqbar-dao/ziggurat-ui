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
import { TestFocus } from '../../types/TestFocus';
import { parseAction } from '../../utils/tests';
import Text from '../text/Text';

export const DROPPABLE_DIVIDER = '___'

interface TestEntryProps extends TestListProps {
  test: Test
}

export const TestEntry = ({ test, editTest }: TestEntryProps) => {
  const { focusedTests, currentProject, setFocusedTests, deleteTest } = useContractStore()
  const [expandInput, setExpandInput] = useState(false)
  const [expandOutput, setExpandOutput] = useState(false)

  const testFocus = useMemo(() => (focusedTests[currentProject] && focusedTests[currentProject][test.id]) || {}, [currentProject, test, focusedTests])

  const testStyle = {
    justifyContent: 'space-between',
    margin: 8,
    padding: 8,
    border: '1px solid black',
    borderRadius: 4,
  }

  const toggleTestFocus = useCallback((key: 'focus' | 'exclude') => () => {
    const newFocusedTests = { ...focusedTests }
    if (!newFocusedTests[currentProject]) {
      newFocusedTests[currentProject] = {}
    }
    if (!newFocusedTests[currentProject][test.id]) {
      const focus: TestFocus = {}
      focus[key] = true
      newFocusedTests[currentProject][test.id] = focus
    } else {
      const targetFocus = newFocusedTests[currentProject][test.id]
      targetFocus[key] = !targetFocus[key]
      if (targetFocus[key]) {
        if (key === 'exclude' && targetFocus.focus) {
          targetFocus.focus = false
        } else if (key === 'focus' && targetFocus.exclude) {
          targetFocus.exclude = false
        }
      }
    }
    setFocusedTests(newFocusedTests)
  }, [test, focusedTests, currentProject, setFocusedTests])

  return (
    <Col className="action" style={{ ...testStyle, position: 'relative' }}>
      <Row style={{ justifyContent: 'space-between', borderBottom: '1px solid gray', paddingBottom: 2, marginBottom: 4 }}>
        <Row style={{ marginBottom: 4, marginLeft: -4 }}>
          <Row>
            <Input type="checkbox" checked={Boolean(testFocus?.focus)} onChange={toggleTestFocus('focus')} />
            <div>Focus</div>
          </Row>
          <Row style={{ marginLeft: 4 }}>
            <Input type="checkbox" checked={Boolean(testFocus?.exclude)} onChange={toggleTestFocus('exclude')} />
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
      {test.last_result !== undefined && <Col className="output" style={{ flex: 1, marginTop: 4, paddingTop: 8, borderTop: '1px solid gray' }}>
        <Row style={{ marginBottom: 4 }}>
          {!!test.last_result && (<Button
            onClick={() => setExpandOutput(!expandOutput)}
            variant='unstyled'
            style={{ marginRight: 8, marginTop: 2, alignSelf: 'flex-start' }}
            iconOnly
            icon={expandOutput ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
          />)}
          {/* isRunning ? <Loader size='small' style={{ marginLeft: 8 }} dark /> :  */}
          Output: {getStatus(test.errorcode)}
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
      {Object.values(project.tests).map(test => <TestEntry key={test.id} test={test} editTest={editTest} />)}
    </Col>
  )
}
