import { Location } from "./Location"
import { Town } from "./Town"
import { Transaction } from "./Transaction"

export interface Batches {
  [batch: string]: Batch
}

export interface Batch {
  id: string
  location: Location
  timestamp: number
  batch: {
    transactions: Transaction[]
    town: Town
  }
}

export interface NewBatch {
  'batch-order': string[]
}
