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
  custom_step_definitions: {
    [key: string]: any
  }
  name?: string
  id: string
  subject: string
  test_imports: {
    [key: string]: string
  }
  test_results: any[]
  test_steps_file: string
  test_steps: []
}

export interface TestExpectationDiff {
  [key: string]: { expected?: string | boolean, result?: string | boolean }
}

export interface Tests {
  [key: string]: Test
}
