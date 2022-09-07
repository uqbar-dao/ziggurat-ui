export type TestRiceValue = string | TestRiceValue[] | { [key: string]: string | TestRiceValue }

export type TestGrainField = 'id'
  | 'holder'
  | 'lord'
  | 'town_id'
  | 'label'
  | 'salt'
  | 'data'
  | 'contract'

export interface GrainTemplate {
  id: string
  holder: string
  lord: string
  label?: string
  data?: string
  contract?: boolean

  // UI-specific fields
  obsolete?: boolean
  riceInvalid?: boolean
}

export interface TestGrain extends GrainTemplate {
  town_id: string
  salt?: string
  data_text: string
}

export interface TestGrainInput extends GrainTemplate {
  'town-id': string
  salt: number
}
