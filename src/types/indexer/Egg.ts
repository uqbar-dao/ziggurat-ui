export interface Sig {
  s: number
  v: number
  r: number
}

export interface Shell {
  status: number
  contract: string
  budget: number
  from: {
    id: string
    nonce: number
    zigs: string
  },
  "eth-hash": string | null
  rate: number
  "town-id": string
}

export interface Yolk {
  give: string
}

export interface Egg {
  yolk: Yolk
  shell: Shell
  sig?: Sig
}
