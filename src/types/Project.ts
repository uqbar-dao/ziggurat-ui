import { Tests } from "./TestData"
import { TestGrain } from "./TestGrain"

export interface ProjectState {
  [key: string]: TestGrain
}

export interface ProjectUpdate {
  compiled: boolean
  error: string
  state: ProjectState
  tests: Tests
}

export interface EditorTextState {
  [key: string]: string
}

export interface Project extends ProjectUpdate {
  title: string
  libs: {
    [filename: string]: string
  }
  main: string
  expanded: boolean
}

export interface Projects {
  [project: string]: Project
}
