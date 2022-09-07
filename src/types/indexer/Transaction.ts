import { Egg, RawEgg } from "./Egg"
import { Location, RawLocation } from "./Location"

export interface RawHashTransaction {
  egg: RawEgg
  hash: string
}

export interface HashTransaction {
  egg: Egg
  hash: string
}

export interface RawTransaction {
  egg: RawEgg
  location: RawLocation
  hash?: string
  timestamp: number
}

export interface Transaction {
  egg: Egg
  location: Location
  hash?: string
  timestamp: number
}
