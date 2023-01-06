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

export interface ProjectUpdateMessage {
  level: string
  message: string
  project_name: string
  request_id: number
  source: string
}
export interface ProjectUpdate {
  project: {
    data: null
    project_name: string
    request_id: string
    source: string
    project: Project
  } 
  'add-test': {
    project_name: string
    request_id?: number
    source: string
    test_id: string
    data: {
      test: Test
    }
  }
  'edit-test': {
    project_name: string
    request_id?: number
    source: string
    test_id: string
    data: {
      test: Test
    }
  }
  [key: string]: ProjectUpdateMessage | any
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
