import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Folder, FolderContents } from "../types/ziggurat/Folder"
import { GallApp } from "../types/ziggurat/GallApp"

export const getFolder = (folder: Folder, path: string[]) : null | Folder => {
  if (path.length < 1) {
    return folder
  } else if (path.length < 2) {
    return typeof folder.contents[path[0]] === 'string' ? null : folder.contents[path[0]] as Folder
  } else if (typeof folder.contents[path[0]] === 'string') {
    return null
  }
  
  return getFolder(folder.contents[path[0]] as Folder, path.slice(1))
}

export const getFolderForFile = (folder: Folder, file: string) => getFolder(folder, file.split('/').slice(1, -2))

export const getFilename = (file: string) => file.split('/').slice(-2).join('.')

export const getFileText = (folder: Folder, path: string[], filename: string) : string | undefined => {
  if (path.length <= 2)
    return folder.contents[filename] as string
  
  return getFileText(folder.contents[path[0]] as Folder, path.slice(1), filename)
}

const insertFile = (currentFolder: FolderContents, file: string[], fileString: string, folderTrace: string[], localAppFolder?: Folder) => {
  const folderNameArray = folderTrace.concat([file[0]])
  const folderName = folderNameArray.join('/')
  const targetFolder = currentFolder[folderName]
  if (file.length <= 2) {
    currentFolder[fileString] = ''
  } else if (targetFolder && typeof targetFolder !== 'string') {
    insertFile(targetFolder.contents, file.slice(1), fileString, folderTrace.concat([file[0]]))
  } else {
    const newFolder = {
      name: folderName,
      contents: {} as FolderContents,
      expanded: localAppFolder ? Boolean(getFolder(localAppFolder, folderNameArray)?.expanded) : false
    }
    insertFile(newFolder.contents, file.slice(1), fileString, folderTrace.concat([file[0]]))
    currentFolder[file[0]] = newFolder
  }
}

export const mapFilesToFolders = (project: string, files: string[], localApp?: GallApp) => {
  const projectFolder: Folder = { name: project, contents: {} as FolderContents, expanded: false }

  files.forEach(fileString => {
    const file = fileString.split('/').slice(1)
    insertFile(projectFolder.contents, file, fileString, [], localApp?.folder)
  })

  return projectFolder
}

export const downloadProjectZip = async (project: GallApp) => {
  const zipUpFolder = (folder: Folder, zipFolder: JSZip) =>
    Object.keys(folder.contents).forEach((key) => {
      if (typeof folder.contents[key] === 'string') {
        zipFolder!.file(getFilename(key), folder.contents[key] as string)
      } else {
        const subFolder = folder.contents[key] as Folder
        const subFolderName = subFolder.name.split('/').pop() || subFolder.name
        zipUpFolder(subFolder, zipFolder!.folder(subFolderName)!)
      }
    })

  const zip = new JSZip()
  zipUpFolder(project.folder, zip)
  const zipBlob = await zip.generateAsync({ type: 'blob' })
  saveAs(zipBlob, `${project.title}.zip`)
}
