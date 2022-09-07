import React, { useCallback, useEffect, useState } from 'react'
import Entry from '../../components-wallet/form/Entry'
import PageHeader from '../../components-wallet/page/PageHeader'
import Container from '../../components-wallet/spacing/Container'
import Row from '../../components-wallet/spacing/Row'
import Text from '../../components-wallet/text/Text'
import TransactionShort from '../../components-wallet/transactions/TransactionShort'
import useWalletStore from '../../store/walletStore'
import { displayPubKey } from '../../utils/account'
import { addHexDots } from '../../utils/number'
import { groupTransactions } from '../../utils/transactions'

import './TransactionsView.scss'

const PLACEHOLDER = 'All addresses'

const TransactionsView = () => {
  const { accounts, transactions } = useWalletStore()
  const [filteredTransactions, setFilteredTransactions] = useState(transactions)
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>()

  const filterByAddress = useCallback((address?: string) => {
    if (address) {
      setFilteredTransactions(
        transactions.filter(({ from }) => from === addHexDots(address))
      )
    } else {
      setFilteredTransactions(transactions)
    }
  }, [transactions, setFilteredTransactions])

  const selectAddress = (e: any) => {
    setSelectedAddress(e.target.value === PLACEHOLDER ? undefined : e.target.value)
  }

  useEffect(() => {
    filterByAddress(selectedAddress)
  }, [selectedAddress, transactions, filterByAddress])

  const { pending, rejected, finished } = groupTransactions(filteredTransactions)

  return (
    <Container className='transactions-view'>
      <PageHeader title='Transaction History' className='header'>
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
      <Entry title='Pending'>
        {pending.length ? (
          pending.map(txn => <TransactionShort key={txn.hash} txn={txn} />)
        ) : (
          <Text>None</Text>
        )}
      </Entry>
      <Entry title='Rejected'>
        {rejected.length ? (
          rejected.map(txn => <TransactionShort key={txn.hash} txn={txn} />)
        ) : (
          <Text>None</Text>
        )}
      </Entry>
      <Entry title='Completed'>
        {finished.length ? (
          finished.map(txn => <TransactionShort key={txn.hash} txn={txn} />)
        ) : (
          <Text>None</Text>
        )}
      </Entry>
    </Container>
  )
}

export default TransactionsView
