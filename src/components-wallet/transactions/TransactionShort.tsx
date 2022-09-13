import React from 'react'
import { Transaction } from '../../types/wallet/Transaction';
import { getStatus } from '../../utils/constants';
import { abbreviateHex } from '../../utils/format';
import Field from '../../components/spacing/Field';
import Link from '../nav/Link';
import Col from '../../components/spacing/Col';
import Text from '../../components/text/Text';
import CopyIcon from '../../components/text/CopyIcon';
import './TransactionShort.scss'
import Button from '../../components/form/Button';
import { FaRegTrashAlt } from 'react-icons/fa';
import useWalletStore from '../../stores/walletStore';
import { useNavigate } from 'react-router-dom';
import HexNum from '../../components/text/HexNum';

interface TransactionShortProps extends React.HTMLAttributes<HTMLDivElement> {
  txn: Transaction
  isUnsigned?: boolean
}

const TransactionShort: React.FC<TransactionShortProps> = ({
  txn,
  isUnsigned = false,
  ...props
}) => {
  const { deleteUnsignedTransaction, setPathname } = useWalletStore()
  const nav = useNavigate()

  return (
    <Col {...props} className={`transaction-short ${props.className || ''}`}>
      <Field name='Hash:'>
        <Link href={`/transactions/${txn.hash}`}>
          <HexNum mono num={txn.hash} displayNum={abbreviateHex(txn.hash)} />
        </Link>
        <CopyIcon text={txn.hash} />
      </Field>
      <Field name='Status:'>
        <Text mono>{getStatus(txn.status)}</Text>
        {txn.created && <Text style={{ marginLeft: 'auto' }} mono>{typeof txn.created === 'string' ? txn.created : txn.created.toDateString()}</Text>}
      </Field>
      {isUnsigned && (
        <Button small style={{ marginTop: 8 }} onClick={() => {setPathname('/'); nav(`/${txn.hash}`)}} dark>
          Sign & Submit
        </Button>
      )}
      {isUnsigned && (
        <Button style={{ position: 'absolute', top: 8, right: 8 }} icon={<FaRegTrashAlt />} iconOnly
          onClick={() => deleteUnsignedTransaction(txn.from, txn.hash)} variant='unstyled'
        />
      )}
    </Col>
  )
}

export default TransactionShort
