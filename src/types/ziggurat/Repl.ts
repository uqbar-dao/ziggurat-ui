
export interface Tab {
  name: string
  active: boolean
}

export interface View {
  name: string
  active: boolean
}

export interface Ship {
  name: string
  active: boolean
  apps: {
    [key: string]: any
  }
  expanded?: boolean
}

export interface Poke {
  app: string
  ship: string
  expanded?: boolean
  expandedShips?: boolean
  expandedApps?: boolean
  data: string
}

export interface Scry {
  ship: string
  data: string
  expanded?: boolean
  expandedShips?: boolean
}

export interface Event {
  source: string
  type: string
  data: string
}
export interface TestScryStep {
  payload: {
    who: string
    "mold-name": string
    care: string
    app: string
    path: string
  }
  expected: string
}

export interface TestDbugStep {
  payload: {
    who: string
    "mold-name": string
    app: string
  }
  expected: string
}

export interface TestReadSubscriptionStep {
  payload: {
    who: string
    to: string
    app: string
    path: string
  }
  expected: string
}

export interface TestWaitStep {
  until: number
}

export interface TestCustomReadStep {
  tag: string
  payload: string
  expected: string
}

export type TestReadStep = TestScryStep | TestDbugStep | TestReadSubscriptionStep | TestWaitStep | TestCustomReadStep

export interface TestDojoStep {
  payload: {
    who: string
    payload: string
  }
  expected: TestReadStep[]
}

export interface TestPokeStep {
  payload: {
    who: string
    to: string
    app: string
    mark: string
    payload: string
  }
  expected: TestReadStep[]
}

export interface TestSubscribeStep {
  payload: {
    who: string
    to: string
    app: string
    path: string
  }
  expected: TestReadStep[]
}

export interface TestCustomWriteStep {
  tag: string
  payload: string
  expected: TestReadStep[]
}

export type TestWriteStep = TestDojoStep | TestPokeStep | TestSubscribeStep | TestCustomWriteStep
export type TestStep = TestReadStep | TestWriteStep

export interface Test {
  name?: string
  filePath?: string
  imports: { face: string, path: string, dropOpen?: boolean }[]
  steps: TestStep[]
  expanded?: boolean
  filePathDropOpen?: boolean
  newStepOpen?: boolean
}

export type StringTestStep = 'scry' | 'rsub' | 'wait' | 'read' | 'poke' | 'subs' | 'dbug' | 'dojo' | 'writ'