import { FaArrowDown, FaArrowUp, FaGripVertical, FaRegTrashAlt } from "react-icons/fa"
import Button from "../../components/form/Button"
import Col from "../../components/spacing/Col"
import Entry from "../../components/spacing/Entry"
import Row from "../../components/spacing/Row"
import Text from '../../components/text/Text'
import Input from '../../components/form/Input'
import { longSteps, SmallTestStep, StringTestStep, Test, TestStep, testSteps } from "../../types/ziggurat/Repl"
import useZigguratStore from "../../stores/zigguratStore"
import Field from "../../components/spacing/Field"
import Dropdown from "../../components/popups/Dropdown"
import { useState } from "react"
import TextArea from "../../components/form/TextArea"


interface TestStepProps extends React.HTMLAttributes<HTMLDivElement> {
  test: Test,
  step: SmallTestStep,
  index: number
}

const determineTestStepType = (step: TestStep) => {
  if ('until' in step) {
    return { isRead: true, type: 'wait'}
  } 

  if (typeof step.payload === 'string') {
    if (Array.isArray(step.expected)) {
      return { isRead: false, type: 'writ'}
    } 
    return { isRead: true, type: 'read'}
  }
  
  if ('care' in step.payload) {
    return { isRead: true, type: 'scry'}
  }

  if ('mold-name' in step.payload) {
    return { isRead: true, type: 'dbug'}
  }

  if ('mark' in step.payload) {
    return { isRead: false, type: 'poke'}
  }

  if ('to' in step.payload) {
    if (Array.isArray(step.expected)) {
      return { isRead: false, type: 'subs'}
    }
    return { isRead: true, type: 'rsub'}
  }

  return { isRead: false, type: 'dojo'}
}

const TestStepRow: React.FC<TestStepProps> = ({ test, step, index, ...props }) => {
  const { type: stepType, text } = step
  const { tests, setTests } = useZigguratStore()
  const [isOpen, setIsOpen] = useState(false)

  return (<Col className='test-step' {...props}>
      <Row style={{ flexGrow: 1 }}>
        <Text className="mr1">{index+1}.</Text>
        {<Dropdown value={longSteps[stepType].name || 'Unknown'} toggleOpen={() => setIsOpen(!isOpen)} open={isOpen}>
          {testSteps.map(stepKey => <option key={stepKey} value={stepKey} onClick={() =>{
            setIsOpen(!isOpen)
            setTests(tests.map(t => ({ ...t, steps: t.name === test.name ?
              test.steps.map((innerStep, i) => (i === index) ?
                { type: stepKey, text: '' }
                : innerStep)
              : t.steps })))
          }}>{longSteps[stepKey].name}</option>)}
        </Dropdown>}
        <Row className='buttons'>
          <Button onClick={() => {
            [test.steps[index-1], test.steps[index]] = [test.steps[index], test.steps[index-1]]
            setTests(tests)
          }} variant='slim' iconOnly icon={<FaArrowUp />} 
          style={{ visibility: (index > 0) ? 'visible' : 'hidden' }} />
          <Button onClick={() => {
            [test.steps[index+1], test.steps[index]] = [test.steps[index], test.steps[index+1]]
            setTests(tests)
          }} variant='slim' iconOnly icon={<FaArrowDown />} 
          style={{ visibility: (index < test.steps.length - 1) ? 'visible' : 'hidden' }}  />
          <Button variant='slim' iconOnly icon={<FaRegTrashAlt />} onClick={() => setTests(tests.map(t => ({
            ...t, steps: t.name === test.name ? t.steps.filter(s => s.text !== step.text) : t.steps
          })))} />
        </Row>
      </Row>

      <TextArea value={text} containerStyle={{ margin: '0.5em' }} 
      placeholder={longSteps[stepType].spec} onChange={(e) => {
        test.steps[index].text = e.currentTarget.value
        setTests(tests)
      }}/>
  </Col>)
}

export default TestStepRow