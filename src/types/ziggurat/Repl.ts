
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

export type StringTestStep = 'scry' | 'read-subscription' | 'wait' | 'dbug' | 'custom-read' | 'poke' | 'subscribe' | 'dojo' | 'custom-write' 
export const readSteps: StringTestStep[] = ['scry', 'read-subscription', 'wait', 'dbug', 'custom-read']
export const writeSteps: StringTestStep[] = ['poke', 'subscribe', 'dojo', 'custom-write']
export const testSteps = [...readSteps, ...writeSteps]

export interface TestBaseStep { 
  type: StringTestStep
}

export interface TestScryStep extends TestBaseStep {
  payload: {
    who: string
    "mold-name": string
    care: string
    app: string
    path: string
  }
  expected: string
}

export interface TestDbugStep extends TestBaseStep {
  payload: {
    who: string
    "mold-name": string
    app: string
  }
  expected: string
}

export interface TestReadSubscriptionStep extends TestBaseStep {
  payload: {
    who: string
    to: string
    app: string
    path: string
  }
  expected: string
}

export interface TestWaitStep extends TestBaseStep {
  until: number
}

export interface TestCustomReadStep extends TestBaseStep {
  tag: string
  payload: string
  expected: string
}

export type TestReadStep = TestScryStep | TestDbugStep | TestReadSubscriptionStep | TestWaitStep | TestCustomReadStep

export interface TestDojoStep extends TestBaseStep {
  payload: {
    who: string
    payload: string
  }
  expected: TestReadStep[]
}

export interface TestPokeStep extends TestBaseStep {
  payload: {
    who: string
    to: string
    app: string
    mark: string
    payload: string
  }
  expected: TestReadStep[]
}

export interface TestSubscribeStep extends TestBaseStep {
  payload: {
    who: string
    to: string
    app: string
    path: string
  }
  expected: TestReadStep[]
}

export interface TestCustomWriteStep extends TestBaseStep {
  tag: string
  payload: string
  expected: TestReadStep[]
}

export type TestWriteStep = TestDojoStep | TestPokeStep | TestSubscribeStep | TestCustomWriteStep
export type TestStep = TestReadStep | TestWriteStep
export type BETestStep = { [key: string]: TestStep }
export interface Test {
  id: string
  name?: string
  test_steps_file?: string
  test_imports: { [key: string]: string | undefined }
  test_steps: TestStep[]
  expanded?: boolean
  filePathDropOpen?: boolean
  newStepOpen?: boolean
}

export const longSteps = {
  'scry': {
    name: 'Scry', 
    spec: '[payload=[who=@p mold-name=@t care=@tas app=@tas =path] expected=@t]',
    default: { 
      type: 'scry',
      payload: { who: '~zod', "mold-name": '@', care: 'gx', app: 'ziggurat', path: '/', }, 
      expected: '' }},
  'read-subscription': {
    name: 'Read Subscription', 
    spec: '[payload=[who=@p to=@p app=@tas =path] expected=@t]',
    default: { 
      type: 'read-subscription',
      payload: { who: '~zod', to: '~nec', app: 'ziggurat', path: '/', }, 
      expected: '' }},
  'wait': {
    name: 'Wait',
    spec: '[until=@dr]',
    default: { type: 'wait', until: 0, }},
  'dbug': {
    name: 'Dbug',  
    spec: '[payload=[who=@p mold-name=@t app=@tas] expected=@t]',
    default: { 
      type: 'dbug',
      payload: { who: '~zod', "mold-name": '@', app: 'ziggurat', }, 
      expected: '' }},
  'custom-read': {
    name: 'Custom Read', 
    spec: '[payload=[who=@p to=@p app=@tas =path] expected=@t]',
    default: { type: 'custom-read', tag: '', payload: '', expected: '', }},
  'poke': {
    name: 'Poke', 
    spec: '[payload=[who=@p to=@p app=@tas mark=@tas payload=@t] expected=(list test-read-step)]',
    default: { 
      type: 'poke',
      payload: { who: '~zod', to: '~nec', app: 'ziggurat', mark: 'hoon', payload: '1', }, 
      expected: [] }},
  'subscribe': {
    name: 'Subscribe', 
    spec: '[payload=[who=@p to=@p app=@tas =path] expected=(list test-read-step)]',
    default: { 
      type: 'subscribe',
      payload: { who: '~zod', to: '~nec', app: 'ziggurat', path: '/', }, 
      expected: [] }},
  'dojo': {
    name: 'Dojo', 
    spec: '[payload=[who=@p payload=@t] expected=(list test-read-step)]',
    default: {
      type: 'dojo',
      payload: { who: '~zod', payload: '(add 2 2)' },
      expected: [] }},
  'custom-write': {
    name: 'Custom Write', 
    spec: '[tag=@tas payload=@t expected=(list test-read-step)]',
    default: { type: 'custom-write', tag: '', payload: '(add 2 2)', expected: [] }},
}
