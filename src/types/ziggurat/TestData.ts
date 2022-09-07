import { TestGrain } from "./TestGrain"

export interface RunTestPayload {
  id: string
  rate: number
  bud: number
}

export interface TestExpectation {
  match: boolean | null
  expected: TestGrain | null
  made: TestGrain | null
}

export interface TestResult {
  fee: number
  errorcode: number
  success?: boolean | null
  grains: {
    [grainId: string]: {
      expected: TestGrain
      made: TestGrain
      match: boolean | null
    }
  }
}

export interface TestResultUpdate {
  result: { [grain: string]: TestGrain }
}

export interface Test {
  id: string
  name?: string
  action: string
  action_text: string
  expected_error: number
  expected: {
    [grainId: string]: TestGrain
  }
  result: TestResult
  events: any
  success: boolean
  running?: boolean
  selected?: boolean
}

export interface TestExpectationDiff {
  [key: string]: { expected?: string | boolean, result?: string | boolean }
}

export interface Tests {
  [key: string]: Test
}
