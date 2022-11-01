import React from 'react'
import { useParams } from 'react-router-dom'
import AccountDisplay from '../../components-wallet/accounts/AccountDisplay'
import BackLink from '../../components-wallet/nav/BackLink'
import PageHeader from '../../components/page/PageHeader'
import Container from '../../components/spacing/Container'
import Entry from '../../components/spacing/Entry'
import useWalletStore from '../../stores/walletStore'

const AccountView = () => {
  const { account } = useParams()
  const { accounts } = useWalletStore()

  const displayAccount = accounts.find(({ rawAddress }) => rawAddress === account)

  return (
    <Container>
      <PageHeader title='Account'>
      </PageHeader>
      <Entry>
        {displayAccount && <AccountDisplay account={displayAccount} full />}
        <BackLink />
      </Entry>
    </Container>
  )
}

export default AccountView
