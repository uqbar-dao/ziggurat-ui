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
  contract: string
  from: string
  status: number
  created?: Date
  modified?: Date
  action: TransactionArgs | string
}

export interface Transactions {
  [hash: string]: Transaction
}
