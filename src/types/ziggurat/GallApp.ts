import { Folder } from "./Folder"

export interface GallApp {
  compiled: boolean
  error: string
  dir: string[]
  folder: Folder
  title: string
  modifiedFiles: Set<string>
  expanded?: boolean
}

export interface GallApps {
  [project: string]: GallApp
}
