import { removeDots } from "../utils/format"

export type HardwareWalletType = 'ledger' | 'trezor'

// this should include all ImportWalletType values
export type DerivedAddressType = 'hot' | 'ledger' | 'trezor'

export interface RawAccount {
  nick: string
  pubkey: string
  privkey: string
  nonces: { [key:string]: number }
}

export interface Wallet {
  nick: string
  address: string
  rawAddress: string
  imported: boolean
  nonces: { [key:string]: number }
}

export const processAccount = (raw: RawAccount): HotWallet => ({
  nick: raw.nick,
  address: removeDots(raw.pubkey),
  rawAddress: raw.pubkey,
  privateKey: removeDots(raw.privkey),
  rawPrivateKey: raw.privkey,
  nonces: raw.nonces,
  imported: !raw.privkey
})

export interface HotWallet extends Wallet {
  privateKey: string
  rawPrivateKey: string
}

export interface HardwareWallet extends Wallet {
  type: HardwareWalletType
}

export interface Seed {
  mnemonic: string
  password?: string
}
