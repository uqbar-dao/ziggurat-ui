import Col from "../../components/spacing/Col"
import Row from "../../components/spacing/Row"
import { TransactionArgs } from "../../types/wallet/Transaction"


interface ActionDisplayProps {
  action: string | TransactionArgs
}

export const ActionDisplay = ({ action }: ActionDisplayProps) => {
  if (typeof action === 'string') {
    return <Row>Action: {action}</Row>
  }

  const actionTitle = Object.keys(action)[0]

  return (
    <Col>
      <Row>
        <Row style={{ fontWeight: 'bold' }}>Action:</Row>
        <Row style={{ marginLeft: 8 }}>{actionTitle}</Row>
      </Row>
      {Object.keys(action[actionTitle]).map(field => (
        <Col style={{ marginLeft: 8 }} key={field}>
          <Row style={{ fontWeight: 'bold' }}>{field}:</Row>
          <Row style={{ wordBreak: 'break-word' }}>{action[actionTitle][field]}</Row>
        </Col>
      ))}
    </Col>
  )
}
