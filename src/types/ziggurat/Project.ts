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
  project: {
    data: null
    project_name: string
    request_id: string
    source: string
    project: Project
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
