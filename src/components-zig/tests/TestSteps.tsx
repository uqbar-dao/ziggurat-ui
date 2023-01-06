import React, { useState } from "react";
import Dropdown from "../../components/popups/Dropdown";
import Col from "../../components/spacing/Col";
import Divider from "../../components/spacing/Divider";
import Field from "../../components/spacing/Field";
import Text from '../../components/text/Text'
import useZigguratStore from "../../stores/zigguratStore";
import { longSteps, readSteps, StringTestStep, writeSteps } from "../../types/ziggurat/Repl";
import { Test } from "../../types/ziggurat/Repl";
import TestStepRow from "./TestStepRow";

interface TestStepsProps extends React.HTMLAttributes<HTMLDivElement> {
  test: Test
}

export const TestSteps: React.FC<TestStepsProps> = ({ test, ...props }) => {
  const [open, setOpen] = useState(false)
  const { setLoading, updateTest } = useZigguratStore()

  const addStepToTest = async (test: Test, step: StringTestStep) => {
    setLoading(`Adding ${longSteps[step].name} to test...`)
    try {
      await updateTest(test.id, test.name, test.test_imports, [...test.test_steps, { [step]: longSteps[step].default } ])
    } catch {
      alert('Error adding step to test.')
    } finally {
      setLoading()
      setOpen(false)
    }
  }


  return (<><Field name='Steps' className='mt1'>
    <Col className='w100'>
      {Boolean(test.test_steps.length) 
        ? test.test_steps.map((step, j) => <TestStepRow index={j} test={test} step={step} key={j} />)
        : <Text>None</Text>}
    </Col>
  </Field>
  <Field name='Add Step' className='ml1 mt1'>
    <Dropdown value={'Select step type...'} open={Boolean(open)} toggleOpen={() => setOpen(!open)}>
      <Text bold>Read</Text>
      {readSteps.map(s => <option key={s} onClick={() => addStepToTest(test, s)}>{longSteps[s].name}</option>)}
      <Divider />
      <Text bold>Write</Text>
      {writeSteps.map(s => <option key={s} onClick={() => addStepToTest(test, s)}>{longSteps[s].name}</option>)}
    </Dropdown>
  </Field></>)
}