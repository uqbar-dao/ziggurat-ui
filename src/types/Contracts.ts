import { ContractMold } from "./ContractMold"
import { Tests } from "./TestData"
import { TestGrain } from "./TestGrain"

export interface ContractState {
  [key: string]: TestGrain
}

export interface ContractUpdate {
  compiled: boolean
  error: string
  state: ContractState
  tests: Tests
}

export interface EditorTextState {
  [key: string]: string
}

export interface Contract extends ContractUpdate {
  title: string
  libs: {
    [filename: string]: string
  }
  main: string
  expanded: boolean
  modifiedFiles: Set<string>
  molds: ContractMold
}

export interface Contracts {
  [project: string]: Contract
}
