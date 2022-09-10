import React, { useCallback, useMemo, useState } from 'react'
import { FaPen, FaTrash, FaChevronDown, FaChevronUp, FaPlay } from 'react-icons/fa';
import Col from '../../components/spacing/Col'
import Row from '../../components/spacing/Row'
import useZigguratStore from '../../stores/zigguratStore';
import Button from '../../components/form/Button';
import { Test, TestResult } from '../../types/ziggurat/TestData';
import Input from '../../components/form/Input';
import { DEFAULT_BUDGET, DEFAULT_RATE, getStatus, STATUS_CODES, STATUS_CODES_RAW } from '../../utils/constants';
import { getGrainDiff, parseAction } from '../../utils/tests';
import Text from '../../components/text/Text';
import { TestGrain } from '../../types/ziggurat/TestGrain';
import { GrainList } from './GrainList';
import { displayPubKey } from '../../utils/account';
import Modal from '../../components/popups/Modal';
import TestStatus from './TestStatus'
import { TestListProps} from './TestList'
import Entry from '../../components/spacing/Entry';
import Field from '../../components/spacing/Field';
import Divider from '../../components/spacing/Divider';



const TestResultDisplay = ({ result, expectedError }: { result?: TestResult, expectedError: number }) => {
  const [showAllResultsModal, setShowAllResultsModal] = useState(false)

  return (
    <Entry>
      <Field name='Gas Used'>
        <Text ml1>{String(result?.fee)}</Text>
      </Field>
      <Field name='Failures'>

      {!!result && result.success === false && (
        <Col>
          {result?.errorcode !== expectedError && (
            <Field name='Status Code'>{`expected: ${STATUS_CODES_RAW[expectedError]}, got: ${STATUS_CODES_RAW[result.errorcode]}`} </Field>
          )}
          {Object.keys(result?.grains).filter(id => result.grains[id].match === false)
            .map(id => {
              if (result.grains[id].expected && !result.grains[id].made) {
                return (
                  <Entry divide key={id}>
                    <Field name='ID'>{displayPubKey(id)} </Field>
                    <Field name='Error'>No grain matching that expectation</Field>
                  </Entry>
                )
              }
              const diff = getGrainDiff(result.grains[id].expected, result.grains[id].made)
              return (
                <Entry divide key={id}>
                  <Field name='ID'>{displayPubKey(id)} </Field>
                  {Object.keys(diff).map(field => (
                    <Entry key={field}>
                      <Field name='Field'>{field} </Field>
                      <Field name='Expected'>{String(diff[field].expected)} </Field>
                      <Field name='Actual'>{String(diff[field].result)} </Field>
                    </Entry>
                  ))}
                </Entry>
              )
            })
          }
        </Col>
      )}
      </Field>
      <Button onClick={() => setShowAllResultsModal(true)} small>Show full test output</Button> 
      <Modal title='Full Test Results' show={showAllResultsModal} hide={() => setShowAllResultsModal(false)}>
        {result?.grains && Object.keys(result.grains).length ? (
          Object.keys(result.grains).map(id => (
            <Entry key={id}>
              <Field name='Grain ID'>{displayPubKey(id)}</Field>
              <Field name='Match'>{JSON.stringify(result.grains[id].match)}</Field>
              <Field name='Expected'>{JSON.stringify(result.grains[id].expected)}</Field>
              <Field name='Result'>{JSON.stringify(result.grains[id].made)}</Field>
            </Entry>
          ))
        ) : (
          <Text>This test did not modify chain state.</Text>
        )}
      </Modal>
    </Entry>
  )
}

export default TestResultDisplay