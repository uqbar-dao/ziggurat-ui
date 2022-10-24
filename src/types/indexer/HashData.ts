import { Grain } from "./Grain"
import { Location } from "./Location"
import { Slot } from "./Slot"
import { Transaction } from "./Transaction"

export interface HashData {
  hash: {
    txns: {
      [key: string]: Transaction
    }
    grains: {
      [key: string]: {
        grain: Grain
        location: Location
        timestamp: number
      }[]
    }
    slots: {
      [key: string]: Slot
    }
  }
}
