import React, {  useMemo,  } from 'react'
import Col from '../../components/spacing/Col'
import useZigguratStore from '../../stores/zigguratStore';
import { Test, TestResult } from '../../types/ziggurat/TestData';
import { TestItem } from '../../types/ziggurat/TestItem';

import './TestList.scss'
import { TestEntry } from './TestEntry';

export const DROPPABLE_DIVIDER = '___'

export interface TestListProps {
  editTest: (test: Test, copyFormat?: boolean) => void
  showTestExpectationModal: (testId: string) => (item?: TestItem) => void
}

export const TestList = ({ editTest, showTestExpectationModal }: TestListProps) => {
  const { projects, currentProject } = useZigguratStore()
  const project = useMemo(() => projects[currentProject], [currentProject, projects])

  if (!project || !project.tests) {
    return null
  } 

  return (
    <Col className='test-list'>
      {Object.keys(project.tests).map(id => <TestEntry key={id} {...{test: { ...project.tests[id], id }, editTest, showTestExpectationModal}} />)}
    </Col>
  )
}
