import { TestItem } from "./TestItem"

export interface RunTestPayload {
  id: string
  rate: number
  bud: number
}

export interface TestExpectation {
  match: boolean | null
  expected: TestItem | null
  made: TestItem | null
}

export interface TestResult {
  fee: number
  errorcode: number
  success?: boolean | null
  items: {
    [itemId: string]: {
      expected: TestItem
      made: TestItem
      match: boolean | null
    }
  }
}

export interface TestResultUpdate {
  result: { [item: string]: TestItem }
}

export interface Test {
  id: string
  name?: string
  action: string
  action_text: string
  expected_error: number
  expected: {
    [itemId: string]: TestItem
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
