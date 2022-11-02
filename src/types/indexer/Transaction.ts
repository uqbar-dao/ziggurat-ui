import { Txn } from "./Txn"
import { Location } from "./Location"

export interface HashTransaction {
  txn: Txn,
  hash: string
}

export interface Transaction {
  transaction: Txn
  location: Location
  hash: string
  timestamp: number
  output: Output
}

export interface Output {
  burned: any
  errorcode: number
  events: any[]
  gas: number
  modified: any
}
