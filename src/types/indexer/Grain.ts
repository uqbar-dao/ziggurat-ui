export interface RawGrain {
  data: string
  salt: number
  holder: string
  id: string
  lord: string
  label: string
  'town-id': string
  'is-rice': boolean
}

export interface Grain {
  data: string
  salt: number
  holder: string
  id: string
  lord: string
  label: string
  townId: string
  isRice: boolean
}
