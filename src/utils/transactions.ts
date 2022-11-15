import { Transaction } from "../types/wallet/Transaction";

interface TransactionGroups {
  pending: Transaction[]
  finished: Transaction[]
  rejected: Transaction[]
}

export const processTransactions = ({ unfinished, finished }: any) => [
  ...Object.values(finished) // finished are grouped into keys by `from`
].map((txs: any) => Object.values(txs).map((tx: any) => ({ 
  ...tx.transaction, ...tx.output
}))).concat(Object.values(unfinished)).flat() // unfinished are not grouped into keys by `from` 

export const groupTransactions = (txs: Transaction[]) => txs.reduce<TransactionGroups>((acc, cur) => {
  if (cur.status === 103) {
    acc.rejected.push(cur)
  } else if (cur.status < 200) {
    acc.pending.push(cur)
  } else if (cur.status >= 200) {
    acc.finished.push(cur)
  }

  return acc
}, { pending: [], finished: [], rejected: [] })
