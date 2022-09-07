import React, { useState } from 'react'
import Button from '../../components/form/Button'
import Link from '../nav/Link'
import Loader from '../../components/popups/Loader'
import Col from '../../components/spacing/Col'
import Row from '../../components/spacing/Row'
import Text from '../../components/text/Text'
import { abbreviateHex } from '../../utils/format'
import CopyIcon from '../../components/text/CopyIcon';
import { getStatus } from '../../utils/constants'
import SendTokenForm from '../forms/SendTokenForm'
import SendCustomTransactionForm from '../forms/SendCustomTransactionForm'
import Modal, { ModalProps } from '../../components/popups/Modal'
import useWalletStore from '../../stores/walletStore'

import './SendModal.scss'

export type SendType = 'tokens' | 'nft' | 'custom';

interface SendModalProps extends ModalProps {
  id?: string
  from?: string
  nftId?: number
  formType: SendType
  title: string,
  show: boolean,
  hide: () => void
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
  const { mostRecentTransaction: txn } = useWalletStore()
  const [submitted, setSubmitted] = useState(false)

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
          <Button style={{ alignSelf: 'center' }} onClick={hideModal}>Done</Button>
        </Col>
      ) : (
        getForm()
      )}
    </Modal>
  )
}

export default SendModal
