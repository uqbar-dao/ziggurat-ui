export interface TokenData {
  metadata: string
  // token
  balance?: number
  // nft
  id?: number
  transferrable?: boolean
  uri?: string
  allowances?: string[]
  properties?: { [key: string]: string }
}

export interface Token {
  id: string
  token_type: 'token' | 'nft'
  contract: string
  holder: string
  town: string
  data: TokenData
}
