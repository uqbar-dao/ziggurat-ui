import { FaGripVertical, FaRegTrashAlt } from "react-icons/fa"
import Button from "../../components/form/Button"
import Col from "../../components/spacing/Col"
import Entry from "../../components/spacing/Entry"
import Row from "../../components/spacing/Row"
import Text from '../../components/text/Text'
import Input from '../../components/form/Input'
import { Test, TestStep } from "../../types/ziggurat/Repl"
import useZigguratStore from "../../stores/zigguratStore"
import Field from "../../components/spacing/Field"


interface TestStepProps extends React.HTMLAttributes<HTMLDivElement> {
  test: Test,
  step: TestStep,
  index: number
}

const determineTestStepType = (step: TestStep) => {
  if ('until' in step) {
    return { isRead: true, type: 'TestWaitStep'}
  } 

  if (typeof step.payload === 'string') {
    if (Array.isArray(step.expected)) {
      return { isRead: false, type: 'TestCustomWriteStep'}
    } 
    return { isRead: true, type: 'TestCustomReadStep'}
  }
  
  if ('care' in step.payload) {
    return { isRead: true, type: 'TestScryStep'}
  }

  if ('mold-name' in step.payload) {
    return { isRead: true, type: 'TestDbugStep'}
  }

  if ('mark' in step.payload) {
    return { isRead: false, type: 'TestPokeStep'}
  }

  if ('to' in step.payload) {
    if (Array.isArray(step.expected)) {
      return { isRead: false, type: 'TestSubscribeStep'}
    }
    return { isRead: true, type: 'TestReadSubscriptionStep'}
  }

  if ('payload' in step.payload) {
    return { isRead: false, type: 'TestDojoStep'}
  }

  return { isRead: null, type: null }
}

const TestStepRow: React.FC<TestStepProps> = ({ test, step, index, ...props }) => {
  const { isRead, type: stepType } = determineTestStepType(step)
  const { tests, setTests } = useZigguratStore()
  const prvIndex = Math.max(0, index - 1)

  const sameStep = (s1: TestStep, s2: TestStep) => {
    if ('until' in s1) {
      if ('until' in s2) {
        return s1.until == s2.until
      }
      return false
    }

    if ('payload' in s2) {
      return s1.payload === s2.payload && s1.expected == s2.expected
    }
  }

  const onStepKeyChange = (k: string, s: string) => {
    const newSteps: TestStep[] = [
      ...test.steps.slice(prvIndex), 
      { ...step, [k]: s }, 
      ...test.steps.slice(index + 1)
    ]
    setTests(tests.map(t => ({ ...t, steps: t.name === test.name ? newSteps : t.steps })))
  }

  let inner = <Text>{stepType}</Text>
  switch (stepType) {
    case 'TestReadSubscriptionStep':
    case 'TestScryStep':
    case 'TestDbugStep':
    case 'TestCustomReadStep':
      // inner = <Row wrap>
      //   {Object.entries(step).map(([k, v]) => {
      //     console.log(k ,v )
      //   return typeof v ==='object' 
      //     ? <Field name={k} className='wrap'>
      //         {Object.entries(v).map(([k2, v2]) => <Input key={k2} placeholder={k2} value={v2 as any} />)}
      //       </Field>
      //     : <Input key={k} placeholder={k} value={v} 
      //     onChange={(e) => onStepKeyChange(k, e.currentTarget.value)} />
      //     })}
      // </Row>
      break
    case 'TestWaitStep':
      break
    case 'TestPokeStep':
      break
    case 'TestSubscribeStep':
      break
    case 'TestDojoStep':
      break
    case 'TestCustomWriteStep':
      break
    case null:
    default:
      break
  }

  return (<Col className='test-step' {...props}>
    <Row>
      <Button variant='unstyled' className='grip' iconOnly icon={<FaGripVertical />} />
      <Col>
        {inner}
      </Col>
      <Row className='buttons'>
        <Button variant='unstyled' iconOnly icon={<FaRegTrashAlt />} onClick={() => setTests(tests.map(t => ({
          ...t, steps: t.name === test.name ? t.steps.filter(s => !sameStep(s, step)) : t.steps
        })))} />
      </Row>
    </Row>
  </Col>)
}

export default TestStepRow