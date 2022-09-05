import { Folder } from "./Folder"

export interface GallApp {
  compiled: boolean
  error: string
  dir: string[]
  folders: Folder
  title: string
  expanded?: boolean
}

export interface GallApps {
  [project: string]: GallApp
}
