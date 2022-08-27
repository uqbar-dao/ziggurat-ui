export interface TokenMetadata {
  name: string
  salt: number
  decimals: number
  deployer: string
  cap: number
  symbol: string
  supply: number
  mintable: boolean
}

export interface TokenMetadataStore {
  [key: string] : TokenMetadata
}