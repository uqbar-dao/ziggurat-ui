import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useWalletStore, AccountBalance, SendModal, SendFormType } from '@uqbar/wallet-ui'
import Entry from '../../components/spacing/Entry'
import PageHeader from '../../components/page/PageHeader'
import Container from '../../components/spacing/Container'
import Row from '../../components/spacing/Row'
import Text from '../../components/text/Text'
import { displayPubKey } from '../../utils/account';
import { unwatchTabClose, watchTabClose } from '../../utils/nav'
import Button from '../../components/form/Button'

import './AssetsView.scss'

const PLACEHOLDER = 'All addresses'

const AssetsView = () => {
  const nav = useNavigate()
  const { unsignedTransactionHash } = useParams()
  const { assets, accounts, importedAccounts, loadingText, unsignedTransactions } = useWalletStore()
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>()
  const [sendFormType, setSendFormType] = useState<SendFormType | undefined>()
  const [id, setId] = useState<string | undefined>()
  const [nftId, setNftIndex] = useState<number | undefined>()
  const [customFrom, setCustomFrom] = useState<string | undefined>()

  const accountsList = useMemo(() => {
    return Array.from(new Set(Object.keys(assets).concat((accounts as any[]).concat(importedAccounts).map(a => a.rawAddress))))
  }, [assets, accounts, importedAccounts])

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
    if (unsignedTransactionHash) {
      const txn = unsignedTransactions[unsignedTransactionHash]
      if (txn) {
        const itemId = Object.values(txn.action)[0]?.item
        const isToken = Boolean(Object.values(txn.action)[0]?.amount)

        watchTabClose()
        
        if (itemId) {
          setId(itemId)
          setSendFormType(isToken ? 'tokens' : 'nft')
        } else {
          setSendFormType('custom')
        }
      }
    }
  }, [unsignedTransactionHash, unsignedTransactions]) // eslint-disable-line react-hooks/exhaustive-deps

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
              {accountsList.map(rawAddress => (
                <option value={rawAddress} key={rawAddress}>
                  {displayPubKey(rawAddress)}
                </option>
              ))}
            </select>
          </Row>
      </PageHeader>
      <Entry title='Accounts'>
        {(!accountsList.length && !loadingText) && (
          <>
            <Text className='mt1'>You do not have any Uqbar accounts yet.</Text>
            <Button onClick={() => nav('/accounts?create=true')} mr1 mt1 wide>
              Create Account
            </Button>
          </>
        )}
        {(selectedAddress ? [selectedAddress] : accountsList).map(a => (
          <AccountBalance
            key={a}
            pubKey={a}
            selectToken={setTokenToSend}
            setCustomFrom={setCustomFromAddress}
            balances={(assets && assets[a] && Object.values(assets[a])) || []}
            selectPubkey={(pubKey: string) => nav(`/accounts/${pubKey}`)}
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
        unsignedTransactionHash={unsignedTransactionHash}
      />
    </Container>
  )
}

export default AssetsView
