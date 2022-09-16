import { Egg } from "./Egg"
import { Location } from "./Location"

export interface HashTransaction {
  egg: Egg,
  hash: string
}

export interface Transaction {
  egg: Egg
  location: Location
  hash: string
  timestamp: number
}
