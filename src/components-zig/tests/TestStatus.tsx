
import Text from '../../components/text/Text'
import {  getRawStatus,  } from '../../utils/constants';

interface TestStatusProps { errorCode: number, success?: boolean | null, expectedError: number }

const TestStatus = ({ errorCode, success, expectedError }: TestStatusProps) => {
  const correctStatus = errorCode === expectedError
  const statusInfo = correctStatus && typeof success === 'boolean' ?
    ` - ${success ? 'passed' : 'did not pass'}` :
    !correctStatus && errorCode !== undefined ? ' - wrong status code' :
    ''

  return (
    <Text style={{ marginLeft: 4, color: correctStatus && (success || success === null)  ? 'green' : 'red', fontWeight: 'bold' }}>
      {getRawStatus(errorCode)}{statusInfo}
    </Text>
  )
}

export default TestStatus