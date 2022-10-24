import { Txn } from "./Txn"
import { Location } from "./Location"

export interface HashTransaction {
  txn: Txn,
  hash: string
}

export interface Transaction {
  txn: Txn
  location: Location
  hash: string
  timestamp: number
}
