import { Grain, RawGrain } from "./Grain"
import { RawSlot, Slot } from "./Slot"
import { RawTransaction, Transaction } from "./Transaction"

export interface RawHashData {
  hash: {
    eggs: {
      [key: string]: RawTransaction
    }
    grains: {
      [key: string]: {
        grain: RawGrain
        location: Location
        timestamp: number
      }[]
    }
    slots: {
      [key: string]: RawSlot
    }
  }
}

export interface HashData {
  hash: {
    eggs: {
      [key: string]: Transaction
    }
    grains: {
      [key: string]: Grain
    }
    slots: {
      [key: string]: Slot
    }
  }
}
