export interface TestResults {
  [grainId: string]: {
    holder: string
    data: string
    lord: string
    town_id: string
    salt: string
    label: string
  }
}

export interface RunTestPayload {
  id: string
  rate: number
  bud: number
}

export interface Test {
  id: string
  name?: string
  action: string
  expected: TestResults
  last_result: TestResults
  errorcode: number
  success: boolean
  focus?: boolean
  exclude?: boolean
}

export interface Tests {
  [key: string]: Test
}
