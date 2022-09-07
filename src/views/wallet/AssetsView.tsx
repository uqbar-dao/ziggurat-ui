import React, { useMemo, useState } from 'react'
import AccountBalance from '../../components-wallet/assets/AccountBalance'
import Entry from '../../components-wallet/form/Entry'
import PageHeader from '../../components-wallet/page/PageHeader'
import SendModal from '../../components-wallet/popups/SendModal'
import Col from '../../components-wallet/spacing/Col'
import Container from '../../components-wallet/spacing/Container'
import Row from '../../components-wallet/spacing/Row'
import Text from '../../components-wallet/text/Text'
import useWalletStore from '../../store/walletStore'
import { displayPubKey } from '../../utils/account';

import './AssetsView.scss'

const PLACEHOLDER = 'All addresses'

const AssetsView = () => {
  const { assets, accounts, loadingText, metadata } = useWalletStore()
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>()
  const [id, setId] = useState<string | undefined>()
  const [nftId, setNftIndex] = useState<number | undefined>()
  const accountsList = useMemo(() => selectedAddress ? [selectedAddress] : Object.keys(assets), [assets, selectedAddress])

  const selectAddress = (e: any) => {
    setSelectedAddress(e.target.value === PLACEHOLDER ? undefined : e.target.value)
  }

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
          <Text style={{ marginTop: 16 }}>You do not have any Uqbar accounts yet.</Text>
        )}
        {accountsList.map(a => (
          <AccountBalance
            key={a}
            pubKey={a}
            showAddress={!selectedAddress}
            setId={setId}
            setNftIndex={setNftIndex}
            balances={Object.values(assets[a]).filter(({ data }) => metadata[data.metadata])}
          />
        ))}
      </Entry>
      <SendModal
        title={'Send' + (nftId !== undefined ? ' NFT' : ' Tokens')}
        show={Boolean(id)}
        id={id}
        nftId={nftId}
        formType={nftId !== undefined ? 'nft' : 'tokens'}
        children={null}
        hide={() => {
          setId(undefined)
          setNftIndex(undefined)
        }}
      />
    </Container>
  )
}

export default AssetsView
