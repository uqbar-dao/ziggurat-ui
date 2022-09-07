import React from 'react'
import { Transaction } from '../../types/wallet/Transaction';
import { getStatus } from '../../utils/constants';
import { abbreviateHex } from '../../utils/format';
import Field from '../form/Field';
import Link from '../nav/Link';
import Col from '../spacing/Col';
import Text from '../text/Text';
import CopyIcon from './CopyIcon';
import './TransactionShort.scss'

interface TransactionShortProps extends React.HTMLAttributes<HTMLDivElement> {
  txn: Transaction
}

const TransactionShort: React.FC<TransactionShortProps> = ({
  txn,
  ...props
}) => {
  return (
    <Col {...props} className={`transaction-short ${props.className || ''}`}>
        <Field name='Hash:'>
          <Link href={`/transactions/${txn.hash}`}>
            <Text mono>{abbreviateHex(txn.hash)}</Text>
          </Link>
          <CopyIcon text={txn.hash} />
        </Field>
        <Field name='Status:'>
          <Text mono>{getStatus(txn.status)}</Text>
          {txn.created && <Text style={{ marginLeft: 'auto' }} mono>{txn.created.toDateString()}</Text>}
        </Field>
    </Col>
  )
}

export default TransactionShort
