export interface RawShell {
  budget: number
  'eth-hash': string | null
  from: {
    id: string
    nonce: number
    zigs: number
  }
  sig: {
    hash: string
    life: number
    ship: string
  }
  status: number
  to: string
  'town-id': number
}

export interface RawYolk {
  args: null | string
  caller: {
    id: string
    nonce: number
    zigs: number
  }
  'cont-grains': string[]
  'my-grains': string[]
}

export interface Shell {
  budget: number
  rate: number
  ethHash: string | null
  from: {
    id: string
    nonce: number
    zigs: number
  }
  sig: {
    hash: string
    life: number
    ship: string
  }
  status: number
  to: string
  townId: number
}

export interface Yolk {
  args: null | string
  caller: {
    id: string
    nonce: number
    zigs: number
  }
  contGrains: string[]
  myGrains: string[]
}

export interface RawEgg {
  yolk: RawYolk
  shell: RawShell
}

export interface Egg {
  yolk: Yolk
  shell: Shell
}
