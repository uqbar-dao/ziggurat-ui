import { Location } from "./Location"
import { Town } from "./Town"
import { HashTransaction } from "./Transaction"

export interface Slot {
  location: Location
  slot: {
    header: {
      'data-hash': string,
      'prev-header-hash': string,
      num: number
    }
  },
  block: {
    height: number,
    signature: {
      life: number,
      ship: string,
      hash: string
    },
    chunks: {
      [key: number]: {
        transactions: HashTransaction[]
        town: Town
      }
    }
  }
}
