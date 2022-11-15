import React from 'react'
import { Transaction } from '../../types/wallet/Transaction';
import { getRawStatus, getStatus } from '../../utils/constants';
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
import Row from '../../components/spacing/Row';
import Pill from '../../components/text/Pill';
import moment from 'moment';

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
        <Row between>
          <Row>
            <Link href={`/transactions/${txn.hash}`}>
              <HexNum mono num={txn.hash} displayNum={abbreviateHex(txn.hash)} />
            </Link>
            <CopyIcon text={txn.hash} />
            <Pill label={'Nonce'} value={''+txn.nonce} />
            <Pill label={'Status'} value={getStatus(txn.status)} />
            {txn.created ? <Pill label='Created' 
              value={(typeof txn.created === 'string') ? txn.created
              : moment(txn.created).format()} /> 
            : <></>}
          </Row>
          <Row>
            {isUnsigned && (
              <Button style={{ marginLeft: 8, justifySelf: 'flex-end' }} small 
                onClick={() => {setPathname('/'); nav(`/${txn.hash}`)}} dark
              >
                Sign & Submit
              </Button>
            )}
            {isUnsigned && (
              <Button style={{ marginLeft: 8, justifySelf: 'flex-end' }} small 
                onClick={() => window.confirm('Are you sure you want to delete this transaction?') 
                  && deleteUnsignedTransaction(txn.from, txn.hash)}
              >
                Delete
              </Button>
            )}
          </Row>
        </Row>
      </Col>
  )
}

export default TransactionShort
