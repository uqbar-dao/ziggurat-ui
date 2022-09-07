export interface TokenMetadata {
  id: string
  token_type: string
  town: string
  data: {
    mintable: boolean
    supply: number
    symbol: string
    minters: string[]
    cap: number | null
    deployer: string
    salt: number
    name: string
    decimals?: number // Token-only
    properties?: string[] // NFT-only
  }
}

export interface TokenMetadataStore {
  [key: string] : TokenMetadata
}
