import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ChainState, Project, Projects } from "../types/ziggurat/Project"
import { Tests } from "../types/ziggurat/TestData"
import { TestItem } from "../types/ziggurat/TestItem"
import { Folder, FolderContents } from "../types/ziggurat/Folder"

export const generateState = (p: Project) =>
  Object.keys(p.state || {}).reduce((acc, id) => {
    acc[id] = { ...p.state[id], id }
    return acc
  }, {} as ChainState)

export const generateTests = (p: Project) =>
  Object.keys(p.tests || {}).reduce((acc, id) => {
    acc[id] = {
      ...p.tests[id],
      id,
    }
    return acc
  },
  {} as Tests)


export const generateProjects = (rawProjects: { projects: { [key: string]: Project  } }, existingProjects: Projects) => {
  const raws = rawProjects.projects
  return Object.keys(raws).reduce((acc, key) => {
    const p = raws[key]
    acc[key] = {
      ...(p as Project),
      title: key,
      expanded: Boolean((existingProjects[key] as Project)?.expanded),
      state: generateState(p as Project),
      tests: generateTests(p as Project),
      folder: mapFilesToFolders(key, (p as Project).dir, existingProjects[key] as Project),
      modifiedFiles: new Set<string>(),
    }
    return acc
  }, {} as Projects)
}

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
  const targetFolder = currentFolder[file[0]]
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

export const mapFilesToFolders = (project: string, files: string[], localApp?: Project) => {
  const projectFolder = files.reduce((folder, fileString, ind) => {
    const file = fileString.split('/').slice(1)
    insertFile(folder.contents, file, fileString, [], localApp?.folder)

    return folder
  }, { name: project, contents: {} as FolderContents, expanded: false } as Folder)

  return projectFolder
}

export const downloadProjectZip = async (project: Project) => {
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

