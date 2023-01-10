import { ContractMold } from "./ContractMold"
import { Folder } from "./Folder"
import { Tests, Test } from "./TestData"
import { TestItem } from "./TestItem"

export interface ChainState {
  [key: string]: TestItem
}

export interface EditorTextState {
  [key: string]: string
}


export interface ProjectUpdate {
  type: string
  project: Project
  test_id: string
  level: string
  message: string
  project_name: string
  request_id: number
  source: string
  data: {
    test: Test
  }
}

export interface Project {
  title: string
  folder: Folder
  modifiedFiles: Set<string>
  expanded?: boolean
  userfilesExpanded?: boolean
  molds: ContractMold
  user_files: string[]
  compiled: boolean
  errors?: { error: string, path: string }[]
  state: ChainState
  tests: Tests
  dir: string[]
}

export interface Projects {
  [project: string]: Project
}
