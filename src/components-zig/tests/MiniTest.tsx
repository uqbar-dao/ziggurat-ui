import { FaPlay, FaRegPlusSquare } from "react-icons/fa";
import Button from "../../components/form/Button";
import Row from "../../components/spacing/Row";
import useZigguratStore from "../../stores/zigguratStore";
import { Test } from "../../types/ziggurat/Repl";

interface MiniTestProps extends React.HTMLAttributes<HTMLDivElement> {
  test: Test
}

export const MiniTest: React.FC<MiniTestProps> = ({ test, ...props }) => {
  const { dirtyTests, setLoading, runTest, queueTest } = useZigguratStore()
  const isDirty = dirtyTests.includes(test.id)

  const onRunTest = async (id: string) => {
    setLoading('Running test...')
    try {
      const result = await runTest(id)
    } catch {
      debugger
    } finally {
      // await test run completion, do not set loading
    }
  }
  
   const onQueueTest = async (id: string) => {
    setLoading('Queueing test...')
    try {
      const result = await queueTest(id)
    } catch (e) {
      debugger
    } finally {
      setLoading()
    }
  }
  
  
  return (<Row className='test'>
    {test.name}
    <Row className='buttons'>
      <Button variant='slim' disabled={isDirty} iconOnly icon={<FaRegPlusSquare />} 
      onClick={() => onQueueTest(test.id)} />
      <Button variant='slim' disabled={isDirty} iconOnly icon={<FaPlay />}  
      onClick={() => onRunTest(test.id)} />
    </Row>
  </Row>)
}