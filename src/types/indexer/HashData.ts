import { Batch } from "./Batch"
import { Item } from "./Item"
import { Location } from "./Location"
import { Slot } from "./Slot"
import { Transaction } from "./Transaction"

export interface HashData {
  hash: {
    transactions: {
      [key: string]: Transaction
    }
    items: {
      [key: string]: {
        item: Item
        location: Location
        timestamp: number
      }[]
    }
    batches: {
      [key: string]: Batch
    }
  }
}
