import React, { useEffect, useState } from 'react'
import Button from '../form/Button'
import Link from '../nav/Link'
import Loader from './Loader'
import Col from '../spacing/Col'
import Row from '../spacing/Row'
import Text from '../text/Text'
import { abbreviateHex } from '../../utils/format'
import CopyIcon from '../transactions/CopyIcon';
import { getStatus } from '../../utils/constants'
import SendTokenForm from '../forms/SendTokenForm'
import SendCustomTransactionForm from '../forms/SendCustomTransactionForm'
import { Transaction } from '../../types/wallet/Transaction'
import Modal, { ModalProps } from './Modal'

import './SendModal.scss'
import useWalletStore from '../../store/walletStore'

export type SendType = 'tokens' | 'nft' | 'custom';

interface SendModalProps extends ModalProps {
  id?: string
  from?: string
  nftId?: number
  formType: SendType
  title: string
}

const SendModal = ({
  id = '',
  from = '',
  title = 'Send',
  nftId,
  show,
  formType,
  hide
}: SendModalProps) => {
  const { transactions } = useWalletStore()
  const [txn, setTxn] = useState<Transaction | undefined>()
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const targetTxn = txn
      ? transactions.find(({ hash }) => hash === txn.hash)
      : transactions.find(({ status }) => status >= 100)

    if (targetTxn) {
      setTxn(targetTxn)
    }
  }, [transactions]) // eslint-disable-line react-hooks/exhaustive-deps

  const getForm = () => {
    switch (formType) {
      case 'tokens':
        return <SendTokenForm {...{ setSubmitted, id, formType: 'tokens' }} />
      case 'nft':
        return <SendTokenForm {...{ setSubmitted, id, nftId, formType: 'nft' }} />
      case 'custom':
        return <SendCustomTransactionForm {...{ setSubmitted, from }} />
    }
  }

  const hideModal = () => {
    hide();
    setSubmitted(false);
  }

  return (
    <Modal 
      title={title} 
      show={show} 
      hide={hideModal} 
      className='send-view'
    >
      {submitted ? (
        <Col className='submission-confirmation'>
          <h4 style={{ marginTop: 0, marginBottom: 16 }}>Transaction {txn?.status === 0 ? 'Complete' : 'Sent'}!</h4>
          {txn ? (
            <>
              <Row style={{ marginBottom: 8 }}>
                <Text style={{ marginRight: 18 }}>Hash: </Text>
                <Link style={{ maxWidth: 'calc(100% - 100px)', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} href={`/transactions/${txn.hash}`}>
                  <Text mono>{abbreviateHex(txn.hash)}</Text>
                </Link>
                <CopyIcon text={txn.hash} />
              </Row>
              <Row style={{ marginBottom: 16 }}>
                <Text style={{ marginRight: 9 }}>Status: </Text>
                <Text mono>{getStatus(txn.status)}</Text>
                {(txn.status === 100 || txn.status === 101) && <Loader style={{ marginLeft: 16 }} />}
              </Row>
            </>
          ) : (
            <Text style={{ marginBottom: 16 }}>
              Your transaction should show up here in a few seconds. If it does not, please go to
              <Link href="/transactions" style={{ marginLeft: 4 }}>History</Link>
              .
            </Text>
          )}
          <Button onClick={hideModal}>Done</Button>
        </Col>
      ) : (
        getForm()
      )}
    </Modal>
  )
}

export default SendModal
