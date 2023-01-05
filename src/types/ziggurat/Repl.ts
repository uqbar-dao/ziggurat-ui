
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
  test_steps_file?: string
  imports: { face: string, path: string, dropOpen?: boolean }[]
  steps: SmallTestStep[]
  expanded?: boolean
  filePathDropOpen?: boolean
  newStepOpen?: boolean
  [key:string]: any
}


export const longSteps = {
  scry: {
    name: 'Scry', 
    tas: '%scry', 
    spec: '[payload=[who=@p mold-name=@t care=@tas app=@tas =path] expected=@t]',
    default: { 
      payload: { who: '', "mold-name": '', care: '', app: '', path: '', }, 
      expected: '' }},
  rsub: {
    name: 'Read Subscription', 
    tas: '%read-subscription',
    spec: '[payload=[who=@p to=@p app=@tas =path] expected=@t]',
    default: { 
      payload: { who: '', to: '', app: '', path: '', }, 
      expected: '' }},
  wait: {
    name: 'Wait',
    tas: '%wait', 
    spec: '[until=@dr]',
    default: { until: 0, }},
  dbug: {
    name: 'Dbug',  
    tas: '%dbug',
    spec: '[payload=[who=@p mold-name=@t app=@tas] expected=@t]',
    default: { 
      payload: { who: '', "mold-name": '', app: '', }, 
      expected: '' }},
  read: {
    name: 'Custom Read', 
    tas: '%custom-read',
    spec: '[payload=[who=@p to=@p app=@tas =path] expected=@t]',
    default: { tag: '', payload: '', expected: '', }},
  poke: {
    name: 'Poke', 
    tas: '%poke',
    spec: '[payload=[who=@p to=@p app=@tas mark=@tas payload=@t] expected=(list test-read-step)]',
    default: { 
      payload: { who: '', to: '', app: '', mark: '', payload: '', }, 
      expected: [] }},
  subs: {
    name: 'Subscribe', 
    tas: '%subscribe',
    spec: '[payload=[who=@p to=@p app=@tas =path] expected=(list test-read-step)]',
    default: { 
      payload: { who: '', to: '', app: '', path: '', }, 
      expected: [] }},
  dojo: {
    name: 'Dojo', 
    tas: '%dojo',
    spec: '[payload=[who=@p payload=@t] expected=(list test-read-step)]',
    default: {
      payload: { who: '', payload: '' },
      expected: [] }},
  writ: {
    name: 'Custom Write', 
    tas: '%custom-write',
    spec: '[tag=@tas payload=@t expected=(list test-read-step)]',
    default: { tag: '', payload: '', expected: [] }},
}

export const readSteps: StringTestStep[] = ['scry', 'rsub', 'wait', 'dbug', 'read']
export const writeSteps: StringTestStep[] = ['poke', 'subs', 'dojo', 'writ']
export const testSteps = [...readSteps, ...writeSteps]
export type StringTestStep = 'scry' | 'rsub' | 'wait' | 'read' | 'poke' | 'subs' | 'dbug' | 'dojo' | 'writ'
export type SmallTestStep = { type: StringTestStep, text: string }