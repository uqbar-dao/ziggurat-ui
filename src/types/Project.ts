import { Test } from "./TestData"

export interface ProjectState {
  [key: string]: {
    holder: string
    lord: string
    town_id: string
    contract?: boolean
    label?: string
    data?: string
    salt?: string
  }
}

export interface ProjectUpdate {
  compiled: boolean
  error: string
  state: ProjectState
  tests: {
    [key: string]: Test
  }
}

export interface EditorTextState {
  [key: string]: string
}

export interface Project extends ProjectUpdate {
  
}

export interface Projects {
  [project: string]: Project
}
