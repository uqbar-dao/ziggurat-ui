import React from 'react'
import { useParams } from 'react-router-dom'
import { useWalletStore, AccountDisplay } from '@uqbar/wallet-ui'
import BackLink from '../../components-wallet/BackLink'
import PageHeader from '../../components/page/PageHeader'
import Container from '../../components/spacing/Container'
import Entry from '../../components/spacing/Entry'
import useDocumentTitle from '../../hooks/useDocumentTitle'

const AccountView = () => {
  const { account } = useParams()
  const { accounts, walletTitleBase } = useWalletStore()

  const displayAccount = accounts.find(({ rawAddress }) => rawAddress === account)

  useDocumentTitle(`${walletTitleBase} Account ${account}`)
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
