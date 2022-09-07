import { Populace, RawGranary } from "./Block"
import { Location, RawLocation } from "./Location"
import { HashTransaction, RawHashTransaction } from "./Transaction"

export interface RawSlot {
  location: RawLocation
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
        transactions: RawHashTransaction[]
        town: {
          granary: RawGranary,
          populace: Populace
        }
      }
    }
  }
}

export interface Slot {
  location: Location
  slot: {
    header: {
      dataHash: string,
      prevHeaderHash: string,
      num: number
    }
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
          town: {
            granary: RawGranary,
            populace: Populace
          }
        }
      }
    }
  }
}
