import React, {  useMemo,  } from 'react'
import Col from '../../components/spacing/Col'
import useZigguratStore from '../../stores/zigguratStore';
import { Test, TestResult } from '../../types/ziggurat/TestData';
import { TestGrain } from '../../types/ziggurat/TestGrain';

import './TestList.scss'
import { TestEntry } from './TestEntry';

export const DROPPABLE_DIVIDER = '___'

export interface TestListProps {
  editTest: (test: Test, copyFormat?: boolean) => void
  showTestExpectationModal: (testId: string) => (grain?: TestGrain) => void
}

export const TestList = ({ editTest, showTestExpectationModal }: TestListProps) => {
  const { contracts, currentProject } = useZigguratStore()
  const project = useMemo(() => contracts[currentProject], [currentProject, contracts])

  if (!project || !project.tests) {
    return null
  } 

  return (
    <Col className='test-list'>
      {Object.values(project.tests).map(test => <TestEntry key={test.id} {...{test, editTest, showTestExpectationModal}} />)}
    </Col>
  )
}
