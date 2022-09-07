export type FolderContents = { [name: string]: Folder | string }

export interface Folder {
  name: string
  contents: FolderContents
  expanded: boolean
}
