import React, { useCallback, useEffect, useMemo, useState } from 'react'
import AccountBalance from '../../components-wallet/assets/AccountBalance'
import Entry from '../../components/spacing/Entry'
import PageHeader from '../../components/page/PageHeader'
import SendModal from '../../components-wallet/popups/SendModal'
import Container from '../../components/spacing/Container'
import Row from '../../components/spacing/Row'
import Text from '../../components/text/Text'
import useWalletStore from '../../stores/walletStore'
import { displayPubKey } from '../../utils/account';
import { useNavigate, useParams } from 'react-router-dom'
import { SendFormType } from '../../components-wallet/forms/SendTransactionForm'

import './AssetsView.scss'
import { unwatchTabClose, watchTabClose } from '../../utils/nav'

const PLACEHOLDER = 'All addresses'

const AssetsView = () => {
  const nav = useNavigate()
  const { unsignedTransactionHash } = useParams()
  const { assets, accounts, loadingText, metadata, unsignedTransactions, setPathname } = useWalletStore()
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>()
  const [sendFormType, setSendFormType] = useState<SendFormType | undefined>()
  const [id, setId] = useState<string | undefined>()
  const [nftId, setNftIndex] = useState<number | undefined>()
  const [customFrom, setCustomFrom] = useState<string | undefined>()

  const accountsList = useMemo(() => selectedAddress ? [selectedAddress] : Object.keys(assets), [assets, selectedAddress])
  const selectAddress = (e: any) => {
    setSelectedAddress(e.target.value === PLACEHOLDER ? undefined : e.target.value)
  }
  const setCustomFromAddress = useCallback((address: string) => {
    setCustomFrom(address)
    setSendFormType('custom')
  }, [setCustomFrom, setSendFormType])

  const setTokenToSend = useCallback((tokenId: string, nftIndex?: number) => {
    setId(tokenId)
    setNftIndex(nftIndex)
    setSendFormType(nftIndex ? 'nft' : 'tokens')
  }, [setNftIndex, setSendFormType])

  const modalTitle = sendFormType === 'custom' ?
    'Send Custom Transaction' :
    sendFormType === 'nft' ?
    'Send NFT' :
    'Send Tokens'

  useEffect(() => {
    setPathname('/wallet')

    if (unsignedTransactionHash) {
      const txn = unsignedTransactions[unsignedTransactionHash]
      if (txn) {
        const grainId = Object.values(txn.action)[0]?.grain
        const isToken = Boolean(Object.values(txn.action)[0]?.amount)

        watchTabClose()
        
        if (grainId) {
          setId(grainId)
          setSendFormType(isToken ? 'tokens' : 'nft')
        } else {
          setSendFormType('custom')
        }
      }
    }
  }, [unsignedTransactionHash, unsignedTransactions])


  const hideModal = useCallback(() => {
    nav('/')
    setSendFormType(undefined)
    setId(undefined)
    setNftIndex(undefined)
    setCustomFrom(undefined)
    unwatchTabClose()
  }, [nav, setSendFormType, setId, setNftIndex, setCustomFrom])

  return (
    <Container className='assets-view'>
      <PageHeader title='Assets' >
          <Row style={{marginLeft: 'auto'}}>
            <label style={{ marginRight: 8 }}>Address:</label>
            <select className='address-selector' value={selectedAddress} onChange={selectAddress}>
              <option>{PLACEHOLDER}</option>
              {accounts.map(({ address, rawAddress }) => (
                <option value={rawAddress} key={address}>
                  {displayPubKey(address)}
                </option>
              ))}
            </select>
          </Row>
      </PageHeader>
      <Entry title='Accounts'>
        {(!accountsList.length && !loadingText) && (
          <Text className='mt1'>You do not have any Uqbar accounts yet.</Text>
        )}
        {accountsList.map(a => (
          <AccountBalance
            key={a}
            pubKey={a}
            showAddress={!selectedAddress}
            selectToken={setTokenToSend}
            setCustomFrom={setCustomFromAddress}
            balances={Object.values(assets[a]).filter(({ data }) => metadata[data.metadata])}
          />
        ))}
      </Entry>
      <SendModal
        title={modalTitle}
        show={Boolean(sendFormType)}
        id={id}
        nftId={nftId}
        from={customFrom}
        formType={sendFormType}
        children={null}
        hide={hideModal}
      />
    </Container>
  )
}

export default AssetsView
