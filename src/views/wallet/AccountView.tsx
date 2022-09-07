import React from 'react'
import { useParams } from 'react-router-dom'
import AccountDisplay from '../../components-wallet/accounts/AccountDisplay'
import Container from '../../components/spacing/Container'
import useWalletStore from '../../stores/walletStore'

const AccountView = () => {
  const { account } = useParams()
  const { accounts } = useWalletStore()

  const displayAccount = accounts.find(({ address }) => address === account)

  return (
    <Container>
      <h2>Account</h2>
      {displayAccount && <AccountDisplay account={displayAccount} full />}
    </Container>
  )
}

export default AccountView
