import { FaArrowDown, FaArrowUp, FaRegTrashAlt } from "react-icons/fa"
import Button from "../../components/form/Button"
import Col from "../../components/spacing/Col"
import Entry from "../../components/spacing/Entry"
import Row from "../../components/spacing/Row"
import Text from '../../components/text/Text'
import Input from '../../components/form/Input'
import { BETestStep, longSteps, readSteps, StringTestStep, Test, TestReadStep, TestStep, testSteps, TestWriteStep } from "../../types/ziggurat/Repl"
import useZigguratStore from "../../stores/zigguratStore"
import Field from "../../components/spacing/Field"
import Dropdown from "../../components/popups/Dropdown"
import { useState } from "react"
import classNames from "classnames"
import Divider from "../../components/spacing/Divider"
import { convertSteps } from "../../stores/subscriptions/project"

interface ExpectationProps extends React.HTMLAttributes<HTMLDivElement> {
  test: Test
  step: TestStep
  stepIndex: number
  expectationIndex: number
}

const Expectation: React.FC<ExpectationProps> = ({ test, step, stepIndex, expectationIndex }) => {
  const { updateTest } = useZigguratStore()
  
  const onRemoveExpectation = async () => {
    try {
      (test.test_steps[stepIndex] as TestWriteStep).expected.splice(expectationIndex, 1)
      await updateTest(test.id, test.name, test.test_imports, convertSteps(test.test_steps))
    } catch (e) {
      debugger
    }
  }

  return <Row className="expectation" style={{ marginTop: expectationIndex > 0 ? '0.5em' : 0 }}>
    <Col>
      {Object.entries(step).reverse().map(([key, val], i) => <Field name={key} key={i}>
        {key === 'type' ? <Text>expectation: {val}</Text>
        : !Boolean(val) ? <Input onChange={() => {}} placeholder='none' defaultValue={val as any} /> 
        : <Col>{Object.entries(val as any).map(([_key, _val], k) => <Field key={k} name={_key}>
          <Input  onChange={() => {}} defaultValue={_val as any} />
        </Field>)}</Col>}
      </Field>)}
    </Col>
    <Row className='buttons'>
      <Button variant='slim' iconOnly icon={<FaRegTrashAlt />} onClick={() => onRemoveExpectation()} />
    </Row>
  </Row>

}
  
interface TestStepProps extends React.HTMLAttributes<HTMLDivElement> {
  test: Test
  step: TestStep
  index: number
}

const TestStepRow: React.FC<TestStepProps> = ({ test, step, index, ...props }) => {
  const { tests, setTests, updateTest, setLoading } = useZigguratStore()
  const [isStepTypeOpen, setIsStepTypeOpen] = useState(false)
  const [isExpectTypeOpen, setIsExpectTypeOpen] = useState(false)

  const onRemoveStep = async () => {
    setLoading('Removing test step...')
    try {
      test.test_steps.splice(index, 1)
      await updateTest(test.id, test.name, test.test_imports, convertSteps(test.test_steps))
    } catch (e) {
      debugger
      alert('Error removing step.')
    } finally {
      setLoading()
    }
  }

  const addExpectation = async (expectationStepType: StringTestStep) => {
    try {
      if (('expected' in step)) {
        if (!Array.isArray(step.expected)) return
        step.expected.push(longSteps[expectationStepType].default as TestReadStep)
        test.test_steps[index] = step
        setLoading(`Adding ${longSteps[expectationStepType].name} expectation to step ${index+1}...`)
        await updateTest(test.id, test.name, test.test_imports, convertSteps(test.test_steps))
      }
    } catch {
      debugger
      alert('Error adding step to test.')
    } finally {
      setLoading()
      setIsExpectTypeOpen(false)
    }
  }

  return (<Col className={classNames('test-step')} {...props}>
    <Row style={{ flexGrow: 1, marginLeft: '-1em' }}>
      <Text className="mr1">{index+1}.</Text>
      {<Dropdown value={longSteps[step.type]?.name || 'Unknown'} toggleOpen={() => setIsStepTypeOpen(!isStepTypeOpen)} open={isStepTypeOpen}>
        {testSteps.map(stepKey => <option key={stepKey} value={stepKey} onClick={() =>{
          setIsStepTypeOpen(!isStepTypeOpen)
          setTests(tests.map(t => ({ ...t, steps: t.name === test.name ?
            test.test_steps.map((innerStep, i) => (i === index) ?
              { type: stepKey, text: '' }
              : innerStep)
            : t.test_steps })))
        }}>{longSteps[stepKey].name}</option>)}
      </Dropdown>}
      <Row className='buttons'>
        <Button onClick={() => {
          [test.test_steps[index-1], test.test_steps[index]] = [test.test_steps[index], test.test_steps[index-1]]
          setTests(tests)
        }} variant='slim' iconOnly icon={<FaArrowUp />} 
        style={{ visibility: (index > 0) ? 'visible' : 'hidden' }} />
        <Button onClick={() => {
          [test.test_steps[index+1], test.test_steps[index]] = [test.test_steps[index], test.test_steps[index+1]]
          setTests(tests)
        }} variant='slim' iconOnly icon={<FaArrowDown />} 
        style={{ visibility: (index < test.test_steps.length - 1) ? 'visible' : 'hidden' }}  />
        <Button variant='slim' iconOnly icon={<FaRegTrashAlt />} onClick={() => onRemoveStep()} />
      </Row>
    </Row>

    {Object.entries(step).reverse().map(([key, val], keyIndex) => <Field name={key} key={keyIndex}>
      {key === 'type' ? val 
      : Array.isArray(val) ? <Col>
        {val.map((expectationStep, j) => <Expectation test={test} step={expectationStep} expectationIndex={j} stepIndex={index} key={j} />)}
        {val.length === 0 && <Text className="italic">no expectations</Text>}
        <Field name='add'>
          <Dropdown value={'Select step type...'} open={Boolean(isExpectTypeOpen)} toggleOpen={() => setIsExpectTypeOpen(!isExpectTypeOpen)}>
            {readSteps.map(s => <option key={s} onClick={() => addExpectation(s)}>
              {longSteps[s].name}
            </option>)}
          </Dropdown>
        </Field>
        <Divider className="mt1" />
      </Col> : !Boolean(val) ? <Input onChange={() => {}}  defaultValue={val as any} /> 
      : <Col>{Object.entries(val as any).map(([_key, _val], k) => <Field key={k} name={_key}>
        <Input  onChange={() => {}} defaultValue={_val as any} />
      </Field>)}</Col>}
    </Field>)}
    <Divider />
  </Col>)
}

export default TestStepRow