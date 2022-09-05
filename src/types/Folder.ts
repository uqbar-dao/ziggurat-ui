export interface Folder {
  name: string
  contents: (string | Folder)[]
}
