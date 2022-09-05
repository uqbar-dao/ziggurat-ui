import { Folder } from "../types/Folder"

const insertFile = (currentFolder: (string | Folder)[], file: string[], fileString: string) => {
  const targetFolder = currentFolder.find(e => typeof e !== 'string' && e.name === file[0])
  if (file.length <= 2) {
    currentFolder.push(fileString)
  } else if (targetFolder && typeof targetFolder !== 'string') {
    insertFile(targetFolder.contents, file.slice(1), fileString)
  } else {
    const newFolder = { name: file[0], contents: [] }
    insertFile(newFolder.contents, file.slice(1), fileString)
    currentFolder.push(newFolder)
  }
}

export const mapFilesToFolders = (project: string, files: string[]) => {
  const projectFolder: Folder = { name: project, contents: [] }

  files.forEach(fileString => {
    const file = fileString.split('/').slice(1)
    insertFile(projectFolder.contents, file, fileString)
  })

  return projectFolder
}
