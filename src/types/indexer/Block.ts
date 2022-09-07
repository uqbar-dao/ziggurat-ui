import { Grain, RawGrain } from "./Grain"
import { HashTransaction } from "./Transaction"

export interface RawGranary {
  [key: string]: RawGrain
}

export interface Granary {
  [key: string]: Grain
}

export interface Populace { [key: string]: number }

export interface RawBlock {
  chunk: {
    town: {
      granary: RawGranary
      populace: Populace
    }
    transactions: any[]
  }
  location: {
    'block-num': number
    'epoch-num': number
    'town-id': number
  }
}

export interface Block {
  chunk: {
    town: {
      granary: Granary
      populace: Populace
    }
    transactions: HashTransaction[]
  }
  location: {
    blockNum: number
    epochNum: number
    townId: number
  }
}
