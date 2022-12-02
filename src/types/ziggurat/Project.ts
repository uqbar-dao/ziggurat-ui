import { ContractMold } from "./ContractMold"
import { Folder } from "./Folder"
import { Tests } from "./TestData"
import { TestItem } from "./TestItem"

export interface ChainState {
  [key: string]: TestItem
}

export interface EditorTextState {
  [key: string]: string
}

export interface ProjectUpdate {
  compiled: boolean
  errors: { error: string, path: string }[]
  state: ChainState
  tests: Tests
  dir: string[]
}

export interface Project extends ProjectUpdate {
  title: string
  folder: Folder
  modifiedFiles: Set<string>
  expanded?: boolean
  molds: ContractMold
  user_files: {
    'user-files': string[]
  }
}

export interface Projects {
  [project: string]: Project
}
