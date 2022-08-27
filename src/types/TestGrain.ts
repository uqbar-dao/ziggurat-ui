export type TestRiceValue = string | TestRiceValue[] | { [key: string]: string | TestRiceValue }

export interface TestRice {
  id: string
  holder: string
  data: string
  lord: string
  town_id: string
  salt: string
  label: string
}

export interface TestGrain {
  //       :*  id=0x1.beef
  //           lord=zigs-wheat-id
  //           holder=holder-1
  //           town-id
  //           rice=[%& salt [50 (malt ~[[holder-2 1.000]]) zigs-wheat-id]]
  id: string
  lord: string
  holder: string
  'town-id': string
  label: string
  salt: number
  data: string

  // UI-specific fields
  obsolete?: boolean
  riceInvalid?: boolean
}
