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
}
