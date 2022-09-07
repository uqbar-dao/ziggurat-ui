export interface CustomTransactions {
  [key: string]: Transaction
}

export interface TransactionArgs {
  [key: string]: {
    [key: string]: string | number
  }
}

export interface Transaction {
  hash: string
  town: string
  nonce: number
  rate: number
  budget: number
  to: string
  from: string
  status: number
  created?: Date
  modified?: Date
  args: TransactionArgs | string
}
