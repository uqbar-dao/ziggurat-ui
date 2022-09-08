import { GetState, SetState } from "zustand";
import { Assets } from "../../types/wallet/Assets";
import { Transaction } from "../../types/wallet/Transaction";
import { showNotification } from "../../utils/notification";
import { WalletStore } from "../walletStore";
import { TokenMetadataStore } from "../../types/wallet/TokenMetadata";
import { Token } from "../../types/wallet/Token";
import { SUCCESSFUL_STATUS, UNSIGNED_STATUS } from "../../utils/constants";

export const handleBookUpdate = (get: GetState<WalletStore>, set: SetState<WalletStore>) => (balanceData: Assets) => {
  console.log('ASSETS:', balanceData)
  const assets: Assets = {}

  Object.keys(balanceData).forEach(holder => {
    assets[holder] = Object.keys(balanceData[holder]).reduce((acc, cur) => {
      acc[cur] = { ...balanceData[holder][cur], holder }
      return acc
    }, {} as { [key: string]: Token })
  })

  set({ assets })
}

export const handleMetadataUpdate = (get: GetState<WalletStore>, set: SetState<WalletStore>) => (metadata: TokenMetadataStore) => {
  console.log('METADATA', metadata)
  set({ metadata })
}

export const handleTxnUpdate = (get: GetState<WalletStore>, set: SetState<WalletStore>) => async (rawTxn: { [key: string]: Transaction }) => {
  const txnHash = Object.keys(rawTxn)[0]
  const txn = { ...rawTxn[txnHash], hash: txnHash, modified: new Date(), status: Number(rawTxn[txnHash].status) }
  console.log('TXN UPDATE:', txn)
  const { transactions } = get()

  const exists = transactions.find(({ hash }) => txn.hash === hash)

  if (exists) {
    if (exists.status !== SUCCESSFUL_STATUS && txn.status === SUCCESSFUL_STATUS) {
      showNotification(`Transaction confirmed!`)
    }

    const newTransactions = transactions.map(t => ({ ...t, modified: t.hash === txn.hash ? new Date() : t.modified, status: Number(t.hash === txn.hash ? txn.status : t.status) }))
    set({ transactions: newTransactions, mostRecentTransaction: { ...exists, ...txn } })
  } else if (txn.hash && txn.status !== UNSIGNED_STATUS) {
    // TODO: make sure sent-to-us will show up in getTransactions
    set({ transactions: [{ ...txn, created: new Date(), modified: new Date() } as Transaction].concat(transactions), mostRecentTransaction: txn })
  }
}
