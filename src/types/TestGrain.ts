export type TestRiceValue = string | TestRiceValue[] | { [key: string]: string | TestRiceValue }

export type TestGrainField = 'id'
  | 'holder'
  | 'lord'
  | 'town_id'
  | 'label'
  | 'salt'
  | 'data'
  | 'contract'

export interface TestGrain {
  id: string
  holder: string
  lord: string
  town_id: string
  label?: string
  salt?: string
  data?: string
  contract?: boolean

  // UI-specific fields
  obsolete?: boolean
  riceInvalid?: boolean
}
