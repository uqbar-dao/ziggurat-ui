export interface RawGrain {
  germ: {
    'data': number
    'is-rice': boolean
    'salt': number
  }
  'holder': string
  'id': string
  'lord': string
  'town-id': number
}

export interface Grain {
  isRice: boolean
  cont?: null
  owns?: string[]
  data?: number
  salt?: number
  holder: string
  id: string
  lord: string
  townId: number
}
