export type TestRiceValue = string | TestRiceValue[] | { [key: string]: string | TestRiceValue }

export type TestItemField = 'id'
  | 'holder'
  | 'source'
  | 'town_id'
  | 'label'
  | 'salt'
  | 'noun'
  | 'contract'

export interface ItemTemplate {
  id: string
  holder: string
  source: string
  'is-pact'?: boolean
  label?: string
  noun?: string
  contract?: boolean

  // UI-specific fields
  obsolete?: boolean
  riceInvalid?: boolean
}

export interface TestItem extends ItemTemplate {
  town_id: string
  salt?: string
  noun_text: string
}

export interface TestItemInput extends ItemTemplate {
  town: string
  salt: number
}
