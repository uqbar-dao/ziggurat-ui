import React, { useCallback, useMemo, useState } from 'react'
import { FaPen, FaTrash, FaChevronDown, FaChevronUp, FaPlay } from 'react-icons/fa';
import Col from '../../components/spacing/Col'
import Row from '../../components/spacing/Row'
import useZigguratStore from '../../stores/zigguratStore';
import Button from '../../components/form/Button';
import { Test, TestResult } from '../../types/ziggurat/TestData';
import Input from '../../components/form/Input';
import { DEFAULT_BUDGET, DEFAULT_RATE, getStatus, STATUS_CODES } from '../../utils/constants';
import { getGrainDiff, parseAction } from '../../utils/tests';
import Text from '../../components/text/Text';
import { TestGrain } from '../../types/ziggurat/TestGrain';
import { GrainList } from './GrainList';
import { displayPubKey } from '../../utils/account';
import Modal from '../../components/popups/Modal';

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
