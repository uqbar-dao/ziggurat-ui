export interface SendTransactionPayload {
  from: string
  to: string
  town: string
  rate: number
  bud: number
}

export interface SendCustomTransactionPayload extends SendTransactionPayload {
  data: string
}

export interface SendAssetPayload extends SendTransactionPayload {
  destination: string
  grain: string
}

export interface SendTokenPayload extends SendAssetPayload {
  amount: number
}

export interface SendNftPayload extends SendAssetPayload {}
