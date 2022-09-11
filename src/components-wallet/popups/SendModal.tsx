import React, { useCallback, useState } from 'react'
import Button from '../../components/form/Button'
import Link from '../nav/Link'
import Loader from '../../components/popups/Loader'
import Col from '../../components/spacing/Col'
import Row from '../../components/spacing/Row'
import Text from '../../components/text/Text'
import { abbreviateHex } from '../../utils/format'
import CopyIcon from '../../components/text/CopyIcon';
import { getStatus } from '../../utils/constants'
import SendTransactionForm, { BLANK_FORM_VALUES, SendFormField, SendFormType } from '../forms/SendTransactionForm'
import Modal, { ModalProps } from '../../components/popups/Modal'
import useWalletStore from '../../stores/walletStore'

import './SendModal.scss'

interface SendModalProps extends ModalProps {
  id?: string
  from?: string
  nftId?: number
  formType?: SendFormType
  show: boolean
  title: string
  hide: () => void
}

const SendModal = ({
  id = '',
  from = '',
  nftId,
  show,
  formType,
  title,
  hide,
}: SendModalProps) => {
  const { mostRecentTransaction: txn } = useWalletStore()
  const [submitted, setSubmitted] = useState(false)
  const [formValues, setFormValues] = useState(BLANK_FORM_VALUES)

  const setFormValue = useCallback((key: SendFormField, value: string) => {
    const newValues = { ...formValues }
    newValues[key] = value
    setFormValues(newValues)
  }, [formValues, setFormValues])

  const hideModal = useCallback(() => {
    hide();
    setSubmitted(false);
    setFormValues(BLANK_FORM_VALUES)
  }, [hide, setSubmitted, setFormValues])

  return (
    <Modal 
      title={title}
      show={show} 
      hide={hideModal}
      style={{ width: '40%', minWidth: 350 }}
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
                {(txn.status === 100 || txn.status === 101) && <Loader style={{ marginRight: 16 }} />}
                <Text mono>{getStatus(txn.status)}</Text>
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
        <SendTransactionForm {...{ setSubmitted, id, nftId, formType, from, formValues, setFormValue, setFormValues }} />
      )}
    </Modal>
  )
}

export default SendModal
