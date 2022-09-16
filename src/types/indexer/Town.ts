import { Grain } from "./Grain"

export interface Granary {
  [grainId: string]: Grain
}

export interface Populace {
  [user: string]: number
}

export interface Town {
  hall: {
    "latest-diff-hash": string
    sequencer: {
      address: string
      ship: string
    },
    mode: string // this is probably only certain values
    roots: string
    "town-id": "0x0"
  },
  land: {
    granary: Granary
    populace: Populace
  }
}
