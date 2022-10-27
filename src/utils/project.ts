import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ChainState, Project, Projects, ProjectUpdate } from "../types/ziggurat/Project"
import { ContractMold } from "../types/ziggurat/ContractMold"
import { Tests } from "../types/ziggurat/TestData"
import { TestItem } from "../types/ziggurat/TestItem"
import { Folder, FolderContents } from "../types/ziggurat/Folder"
import { ACTION_CENCOL_REGEX, ACTION_NOUN_LIST_REGEX, MOLD_REGEX } from "./regex"

export const generateState = (p: Project | ProjectUpdate) =>
  Object.keys(p.state).reduce((acc, id) => {
    acc[id] = { ...p.state[id], id }
    return acc
  }, {} as ChainState)

export const generateTests = (p: Project | ProjectUpdate, oldP?: Project) =>
  Object.keys(p.tests).reduce((acc, id) => {
    acc[id] = {
      ...p.tests[id],
      id,
      selected: oldP?.tests[id]?.selected === undefined ? true : oldP?.tests[id]?.selected,
      expected: generateExpected(p.tests[id].expected),
      expected_error: p.tests[id]?.expected_error || 0
    }
    return acc
  },
  {} as Tests)

export const generateExpected = (expected: { [itemId: string]: TestItem }) =>
  Object.keys(expected).reduce((acc, id) => {
    acc[id] = {
      ...expected[id],
      id
    }
    return acc
  }, {} as { [itemId: string]: TestItem })

// export const generateMolds = (p: Project): ContractMold =>
//   Object.keys(p.dir).reduce((acc, file) => {
//     const text = p.dir[file]
//     const parseRice = (interface: string) => interface.replace(/(\+\$)|(\$:)|(::.*?$)/gm, '').split('\n').slice(0, -1).map(line => line.trim())
//     const parseActions = (interface: string) => interface.replace(/(\+\$)|(\$:)|(::.*?$)/gm, '').split('\n').slice(0, -1).map(line => line.trim())

//     const rice = (text.match(MOLD_REGEX) || [])
//       .filter((interface: string) => !interface.match(ACTION_CENCOL_REGEX))
//       .map(parseRice)
//       .map((interfaceLines: any) => ({ name: interfaceLines[0], interface: interfaceLines.slice(1).join('\n') }))

//     const actions = (text.match(ACTION_CENCOL_REGEX) || [])
//       .map(parseActions)
//       .map((interfaceLines: any) => ({ name: interfaceLines[0], interface: interfaceLines.join('\n') }))
//       .concat(
//         ...(text.match(ACTION_NOUN_LIST_REGEX) || [[]])
//           .map((actionList: any) => {
//             return typeof actionList !== 'string' ? actionList :
//               actionList.split('\n').slice(1, -1).map(action => action.trim())
//                 .map((act: string) => ({ name: (act.match(/%[a-z-]*/i) || [''])[0], interface: act }))
//           })
//       )

//     acc.rice = acc.rice.concat(rice)
//     acc.actions = acc.actions.concat(actions)

//     return acc
//   }, { actions: [], rice: [] } as ContractMold)

export const generateProjects = (rawProjects: { [key: string]: Project }, existingProjects: Projects) =>
  Object.keys(rawProjects).reduce((acc, key) => {
    acc[key] = {
      ...(rawProjects[key] as Project),
      title: key,
      expanded: Boolean((existingProjects[key] as Project)?.expanded),
      state: generateState(rawProjects[key] as Project),
      tests: generateTests(rawProjects[key] as Project, existingProjects[key] as Project),
      folder: mapFilesToFolders(key, (rawProjects[key] as Project).dir, existingProjects[key] as Project),
      modifiedFiles: new Set<string>(),
      // interfaces: generateMolds(rawProjects[key] as Project),
    }
    return acc
  }, {} as Projects)

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

export const mapFilesToFolders = (project: string, files: string[], localApp?: Project) => {
  const projectFolder: Folder = { name: project, contents: {} as FolderContents, expanded: false }

  files.forEach(fileString => {
    const file = fileString.split('/').slice(1)
    insertFile(projectFolder.contents, file, fileString, [], localApp?.folder)
  })

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
  
