export interface SendTransactionPayload {
  from: string
  contract: string
  town: string
}

export interface SendCustomTransactionPayload extends SendTransactionPayload {
  data: string
}

export interface SendAssetPayload extends SendTransactionPayload {
  to: string
  grain: string
}

export interface SendTokenPayload extends SendAssetPayload {
  amount: number
}

export interface SendNftPayload extends SendAssetPayload {}
