export interface Sig {
  s: number
  v: number
  r: number
}

export interface Calldata {
  give: string
}

export interface Shell {
  status: number
  contract: string
  budget: number
  caller: {
    id: string
    nonce: number
    zigs: string
  },
  "eth-hash": string | null
  rate: number
  "town-id": string
}

export interface Txn {
  sig?: Sig
  shell: Shell
  calldata: Calldata
}
