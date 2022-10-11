import React, { useState } from 'react'
import Col from '../../components/spacing/Col'
import Button from '../../components/form/Button';
import { TestResult } from '../../types/ziggurat/TestData';
import { getGrainDiff } from '../../utils/tests';
import Text from '../../components/text/Text';
import { displayPubKey } from '../../utils/account';
import Modal from '../../components/popups/Modal';
import Entry from '../../components/spacing/Entry';
import Field from '../../components/spacing/Field';
import { STATUS_CODES_RAW } from '../../utils/constants';
import Divider from '../../components/spacing/Divider';
import HexNum from '../../components/text/HexNum';

const TestResultDisplay = ({ result, expectedError }: { result?: TestResult, expectedError: number }) => {
  const [showAllResultsModal, setShowAllResultsModal] = useState(false)

  return (
    <Entry>
      <Field name='Gas Used'>
        <Text ml1>{String(result?.fee)}</Text>
      </Field>
      {!!result && result.success === false && (
        <Entry>
          {result?.errorcode !== expectedError && (
            <Field name='Status Code'>{`expected: ${STATUS_CODES_RAW[expectedError]}, got: ${STATUS_CODES_RAW[result.errorcode]}`} </Field>
          )}
          {Object.keys(result?.grains)
            .filter(id => !result.grains[id].match)
            .map((id, index, arr) => {
              const grain = result.grains[id]
              const errorMsg = (grain.expected === null && grain.match === null) 
                ? 'Grain was not expected to change.' 
                : (grain.expected && !grain.made)
                  ? 'Grain changes did not match expectations.'
                  : ''

              if (errorMsg) {
                return (
                  <Entry className='ml1' divide={index < arr.length - 1} key={id}>
                    <h4>Failure #{index+1}</h4>
                    <Field name='ID'> <HexNum num={id} displayNum={displayPubKey(id)} copy copyText={id} /></Field>
                    <Field name='Error'>{errorMsg}</Field>
                  </Entry>
                )
              }
              
              const diff = getGrainDiff(grain.expected, grain.made)
              return (
                <Entry className='ml1' divide key={id}>
                  <h4>Failure #{index+1}</h4>
                  <Field name='ID'> <HexNum num={id} displayNum={displayPubKey(id)} copy copyText={id} /></Field>
                  {Object.keys(diff).map(field => (
                    <Entry key={field}>
                      <Field mono name='Field'>{field} </Field>
                      <Field mono name='Expected'>{String(diff[field].expected)} </Field>
                      <Field mono name='Actual'>{String(diff[field].result)} </Field>
                    </Entry>
                  ))}
                </Entry>
              )
            })
          }
        </Entry>
      )}
      <Button style={{ margin: '8px 0 0 16px' }} onClick={() => setShowAllResultsModal(true)} small>Show full test output</Button> 
      <Modal title='Full Test Results' show={showAllResultsModal} hide={() => setShowAllResultsModal(false)}>
        {result?.grains && Object.keys(result.grains).length ? (
          Object.keys(result.grains).map(id => (
            <Entry key={id}>
              <Field name='Grain ID'>{id}</Field>
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