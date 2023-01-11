import { FaArrowDown, FaArrowUp, FaRegTrashAlt } from "react-icons/fa"
import Button from "../../components/form/Button"
import Col from "../../components/spacing/Col"
import Entry from "../../components/spacing/Entry"
import Row from "../../components/spacing/Row"
import Text from '../../components/text/Text'
import Input from '../../components/form/Input'
import { BETestStep, longSteps, readSteps, StringTestStep, Test, TestBaseStep, TestReadStep, TestStep, testSteps, TestWriteStep } from "../../types/ziggurat/Repl"
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
  const { updateTest, dirtifyTest } = useZigguratStore()
  
  const onRemoveExpectation = async () => {
    try {
      (test.test_steps[stepIndex] as TestWriteStep).expected.splice(expectationIndex, 1)
      await updateTest(test.id, test.name, test.test_imports, convertSteps(test.test_steps))
    } catch (e) {
      alert('Error removing expectation.')
      debugger
    } finally {
      //
    }
  }

  const onModifyStepValue = (steppe: any, keyye: string, valle: string) => {
    dirtifyTest(test.id)
    steppe[keyye] = valle;
    (test.test_steps[stepIndex] as TestWriteStep).expected[expectationIndex] = steppe
  }

  const onModifyInnerStepValue = (steppe: any, keyye: string, innerKey: string, valle: string) => {
    dirtifyTest(test.id)
    steppe[keyye][innerKey] = valle;
    (test.test_steps[stepIndex] as TestWriteStep).expected[expectationIndex] = steppe
  }

  return <Row className="expectation" style={{ marginTop: expectationIndex > 0 ? '0.5em' : 0, alignItems: 'flex-start' }}>
    <Col>
      {Object.entries(step).reverse().map(([key, val], i) => <Field name={key} key={i}>
        {key === 'type' ? <Text>expectation: {val}</Text>
        : (typeof val === 'string' || !Boolean(val)) ? <Input onChange={(e) => onModifyStepValue(step, key, e.currentTarget.value)} placeholder='none' defaultValue={val as any} /> 
        : <Col>{Object.entries(val as any).map(([_key, _val], k) => <Field key={k} name={_key}>
          <Input placeholder='none' onChange={(e) => onModifyInnerStepValue(step, key, _key, e.currentTarget.value)} defaultValue={_val as any} />
        </Field>)}</Col>}
      </Field>)}
    </Col>
    <Row className='buttons'>
      <Button variant='slim' iconOnly icon={<FaRegTrashAlt />} onClick={() => onRemoveExpectation()} />
    </Row>
  </Row>

}
  
interface TestStepRowProps extends React.HTMLAttributes<HTMLDivElement> {
  test: Test
  step: TestStep
  index: number
}

const TestStepRow: React.FC<TestStepRowProps> = ({ test, step, index, ...props }) => {
  const { dirtifyTest, updateTest, setLoading } = useZigguratStore()
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

  const onMoveTestStep = async (targetIndex: number, sourceIndex: number) => {
    setLoading('Moving test step...')
    try {
      [test.test_steps[targetIndex], test.test_steps[sourceIndex]] = [test.test_steps[sourceIndex], test.test_steps[targetIndex]]
      await updateTest(test.id, test.name, test.test_imports, convertSteps(test.test_steps))
    } catch (e) {
      debugger
      alert('Error moving test step.')
    } finally {
      setLoading()
    }
  }

  const onModifyStepValue = (steppe: any, keyye: string, valle: string) => {
    dirtifyTest(test.id)
    steppe[keyye] = valle
    test.test_steps[index] = steppe
  }

  const onModifyInnerStepValue = (steppe: any, keyye: string, innerKey: string, valle: string) => {
    dirtifyTest(test.id)
    steppe[keyye][innerKey] = valle
    test.test_steps[index] = steppe
  }

  return (<Col className={classNames('test-step')} {...props}>
    <Row style={{ flexGrow: 1, marginLeft: '-1em' }}>
      <Text className="mr1">{index+1}.</Text>
      <Text>{longSteps[step.type]?.name || 'Unknown'}</Text>
      <Row className='buttons'>
        <Button onClick={() => onMoveTestStep(index-1, index)} variant='slim' iconOnly icon={<FaArrowUp />} 
        style={{ visibility: (index > 0) ? 'visible' : 'hidden' }} />
        <Button onClick={() => onMoveTestStep(index+1, index)} variant='slim' iconOnly icon={<FaArrowDown />} 
        style={{ visibility: (index < test.test_steps.length - 1) ? 'visible' : 'hidden' }}  />
        <Button variant='slim' iconOnly icon={<FaRegTrashAlt />} onClick={() => onRemoveStep()} />
      </Row>
    </Row>

    {Object.entries(step).reverse().map(([key, val], keyIndex) => key === 'type' ? <span key={keyIndex}></span>
      : <Field name={key} key={keyIndex}>
      {Array.isArray(val) ? <Col>
        {val.map((expectationStep, j) => <Expectation test={test} step={expectationStep} expectationIndex={j} stepIndex={index} key={j} />)}
        {val.length === 0 && <Text className="italic">no expectations</Text>}
        <Field name='add'>
          <Dropdown value={'Select step type...'} open={Boolean(isExpectTypeOpen)} toggleOpen={() => setIsExpectTypeOpen(!isExpectTypeOpen)}>
            {readSteps.map(s => <option key={s} onClick={() => addExpectation(s)}> {longSteps[s].name} </option>)}
          </Dropdown> </Field>
        <Divider className="mt1" /> </Col> 
      : (typeof val === 'string' || !Boolean(val)) ? 
        <Input placeholder='none' onChange={(e) => onModifyStepValue(step, key, e.currentTarget.value)} defaultValue={val as any} /> 
      : <Col>{Object.entries(val as any).map(([_key, _val], k) => <Field key={k} name={_key}>
        <Input placeholder="none" onChange={(e) => onModifyInnerStepValue(step, key, _key, e.currentTarget.value)} defaultValue={_val as any} />
      </Field>)}</Col>}
    </Field>)}
    <Divider />
  </Col>)
}

export default TestStepRow