import create from "zustand"
import { persist } from "zustand/middleware"
import { toast } from "react-toastify";
import pWaterfall from "p-waterfall";
import pMap from "p-map";
import { HardwareWallet, HardwareWalletType, HotWallet, processAccount, RawAccount } from "@uqbar/wallet-ui";

import api from "../api";
import { OpenFile } from "../types/ziggurat/OpenFile";
import { RunTestPayload } from "../types/ziggurat/TestData";
import { TestItemInput } from "../types/ziggurat/TestItem";
import { DEFAULT_USER_ADDRESS, ZIGGURAT_STORAGE_VERSION } from "../utils/constants";
import { generateProjects } from "../utils/project";
import { handleGallUpdate, handleTestUpdate } from "./subscriptions/project";
import { createSubscription, Subscriptions } from "./subscriptions/createSubscription";
import { getFilename, getFileText, getFolder, getFolderForFile, mapFilesToFolders } from "../utils/project";
import { Endpoint } from '../types/ziggurat/Endpoint';
import { EndpointForm } from "../types/ziggurat/EndpointForm";
import { genRanHex } from "../utils/number";
import { handleEndpointUpdate } from "./subscriptions/endpoint";
import { DownloadedFile } from "../views/ziggurat/NewProjectView";
import { Projects } from "../types/ziggurat/Project";

export interface ZigguratStore {
  loading?: string
  currentProject: string
  currentFolder: string
  accounts: HotWallet[]
  importedAccounts: HardwareWallet[]
  projects: Projects
  openFiles: OpenFile[]
  openTools: string[]
  currentTool: string
  subscriptions: Subscriptions
  toastMessages: { project: string, message: string, id: number | string }[]
  userAddress: string
  endpoints: Endpoint[]
  knownMars: string[]
  setLoading: (loading?: string) => void
  init: () => Promise<Projects>
  getAccounts: () => Promise<void>
  getProjects: () => Promise<Projects>
  createProject: (options: { [key: string]: string }) => Promise<void>
  populateTemplate: (project: string, template: 'nft' | 'fungible', metadata: TestItemInput) => Promise<void>
  setCurrentProject: (currentProject: string) => void
  setCurrentFolder: (currentFolder: string) => void
  deleteProject: (project: string) => Promise<string | null>
  setProjectExpanded: (project: string, expanded: boolean) => void
  setUserfilesExpanded: (project: string, expanded: boolean) => void
  toggleProjectFolder: (project: string, folder: string) => void
  addUserfile: (project: string, file: string) => void
  deleteUserfile: (project: string, file: string) => void
  setProjectText: (project: string, file: string, text: string) => void
  saveFiles: (projectTitle: string) => Promise<void>
  fileExists: (project: string, path: string) => Promise<boolean>
  readFile: (project: string, path: string) => Promise<string>
  addFile: (project: string, filename: string, fileContent?: string) => Promise<void>
  deleteFile: (project: string, file: string) => Promise<void>
  setOpenFiles: (openFiles: OpenFile[]) => void
  saveFileList: (files: { path: string, type: string, content: string }[], project: string) => Promise<void>
  toggleTest: (project: string, testId: string) => void
  approveCorsDomain: (domain: string) => Promise<void>

  addItem: (item: TestItemInput, isUpdate?: boolean) => Promise<void>
  deleteItem: (itemId: string, testId?: string) => Promise<void>
  addTest: (name: string, action: string, expectedError: number) => Promise<void>
  addTestExpectation: (testId: string, expectations: TestItemInput) => Promise<void>
  deleteTest: (testId: string) => Promise<void>
  updateTest: (testId: string, name: string, action: string, expectedError: number) => Promise<void>
  runTest: (payload: RunTestPayload) => Promise<void>
  runTests: (payload: RunTestPayload[]) => Promise<void>
  deployContract: (project: string, address: string, location: string, town: string, rate: number, bud: number, upgradable: boolean) => Promise<void>
  publishGallApp: (project: string, title: string, info: string, color: string, image: string, version: number[], website: string, license: string) => Promise<void>

  addTool: (tool: string) => void
  setCurrentTool: (currentTool: string) => void
  removeTool: (tool: string) => void
  addToastMessage: (project: string, message: string, id: number | string) => void
  setUserAddress: (userAddress: string) => void
  getGallFile: (project: string, file: string) => Promise<void>
  addEndpoint: (endpoint: EndpointForm, id?: string) => Promise<void>
  testEndpoint: (endpoint: Endpoint) => Promise<void>
  removeEndpoint: (id: string) => void
}

const our: string = (window as any)?.api?.ship || ''

const useZigguratStore = create<ZigguratStore>(persist<ZigguratStore>(
  (set, get) => ({
    loading: '',
    accounts: [],
    importedAccounts: [],
    currentProject: '',
    currentFolder: '',
    projects: {},
    openFiles: [],
    subscriptions: {},
    openTools: ['webterm'],
    currentTool: '',
    toastMessages: [],
    userAddress: DEFAULT_USER_ADDRESS,
    endpoints: [],
    knownMars: [],
    setLoading: (loading?: string) => set({ loading }),
    init: async () => {
      const projects = await get().getProjects()
      get().getAccounts()

      // TODO: set up subscriptions for endpoints, should be
      const newEndpoints = await Promise.all(
        get().endpoints.map(async (e) => {
          if (e.type === 'sub') {
            e.sub = await api.subscribe(createSubscription(e.app, e.path!, handleEndpointUpdate(get, set, e.id)))
          }

          return e
        })
      )

      set({ loading: undefined, endpoints: newEndpoints })

      return projects
    },
    getAccounts: async () => {
      const accountData = await api.scry<{[key: string]: RawAccount}>({ app: 'wallet', path: '/accounts' }) || {}
      const allAccounts = Object.values(accountData).map(processAccount).sort((a, b) => a.nick.localeCompare(b.nick))

      const { accounts, importedAccounts } = allAccounts.reduce(({ accounts, importedAccounts }, cur) => {
        if (cur.imported) {
          const [nick, type] = cur.nick.split('//')
          importedAccounts.push({ ...cur, type: type as HardwareWalletType, nick })
        } else {
          accounts.push(cur)
        }
        return { accounts, importedAccounts }
      }, { accounts: [] as HotWallet[], importedAccounts: [] as HardwareWallet[] })

      set({ accounts, importedAccounts })
    },
    getProjects: async () => {
      const rawProjects = await api.scry({ app: 'ziggurat', path: '/all-projects' })
      const projects = generateProjects(rawProjects, get().projects)

      console.log('PROJECTS:', projects)

      const subscriptions = Object.keys(projects).reduce((subs, p) => {
        subs[p] = [
          api.subscribe(createSubscription('ziggurat', `/project/${p}`, handleGallUpdate(get, set, p))),
          api.subscribe(createSubscription('ziggurat', `/test-updates/${p}`, handleTestUpdate(get, set, p))),
        ]
        return subs
      }, {} as Subscriptions)

      set({ projects, subscriptions })
      return projects
    },
    createProject: async (options: { [key: string]: string }) => {
      set({ loading: 'Creating project...' })
      const project = options.title

      try {
        const json = { project, action: { "new-project": null } }
        await api.poke({ app: 'ziggurat', mark: 'ziggurat-action', json })

        setTimeout(async () => {
          await get().getProjects()
          set({ loading: undefined, currentProject: options.title })
        }, 1000)
      } catch (err) {
        toast.error(`Error creating '${options.title}'`)
        set({ loading: undefined })
      }
    },
    populateTemplate: async (project: string, template: 'blank' | 'nft' | 'fungible', metadata: TestItemInput) => {
      const json = { project, action: { "populate-template": { template, metadata } } }
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-action', json })
    },
    setCurrentProject: (currentProject: string) => set({ currentProject }),
    setCurrentFolder: (currentFolder: string) => set({ currentFolder }),
    deleteProject: async (project: string) => {
      (get().subscriptions[project] || []).map(subPromise => subPromise.then(sub => api.unsubscribe(sub)).catch(console.warn))

      await api.poke({ app: 'ziggurat', mark: `ziggurat-action`, json: { project, action: { "delete-project": null } } })

      set({ openFiles: get().openFiles.filter(of => of.project !== project) })

      get().getProjects()

      console.log(1)
      if (project === get().currentProject) {
        console.log(2)
        const nextProject = Object.keys(get().projects)[0] || ''
        set({ currentProject: nextProject })
        console.log(3, nextProject)
        return nextProject
      }

      return null
    },
    setProjectExpanded: (project: string, expanded: boolean) => {
      const projects = { ...get().projects }

      if (!projects[project]) return
      
      projects[project].expanded = expanded
      set({ projects: projects })
    },
    setUserfilesExpanded: (project: string, expanded: boolean) => {
      const projects = { ...get().projects }

      if (!projects[project]) return

      projects[project].userfilesExpanded = expanded
      set({ projects: projects })
    },
    addUserfile: async (project: string, file: string) => {
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-action', json: { project, action: { "add-user-file": { file } } } })
      const { projects } = get()
      if (!projects[project]) return

      const newProjects = { ...projects }
      set({ projects: newProjects })
    },
    deleteUserfile: async (project: string, file: string) => {
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-action', json: { project, action: { "delete-user-file": { file } } } })
      const { projects } = get()
      if (!projects[project]) return

      const newProjects = { ...projects }
      const ufs = newProjects[project].user_files
      const idx = ufs.indexOf(file)
      if (idx < 0) return 
      newProjects[project].user_files = [
        ...ufs.slice(0, idx), 
        ...ufs.slice(idx + 1)
      ]
      set({ projects: newProjects })
    },
    toggleProjectFolder: (project: string, folder: string) => {
      const projects = { ...get().projects }
      const targetApp = projects[project]
      const targetFolder = getFolder(targetApp.folder, folder.split('/'))
      if (targetFolder)
        targetFolder.expanded = !targetFolder.expanded

      set({ projects: projects })
    },
    setProjectText: (project: string, file: string, text: string) => {
      const { projects } = get()
      if (projects[project]) {
        const newProjects = { ...projects }
        const folder = getFolderForFile(newProjects[project].folder, file)
        // console.log({ projects, project, newProjects, folder, file, text })
        if (folder) {
          folder.contents[file] = text
          newProjects[project].modifiedFiles.add(file)
          set({ projects: newProjects })
        }
      }
    },
    saveFiles: async (projectTitle: string) => {
      const project = get().projects[projectTitle]
      try {
        if (project && project.modifiedFiles.size) {
          await Promise.all(
            Array.from(project.modifiedFiles.values()).map(async (file) => {
              const text = getFileText(project.folder, file.split('/').slice(1), file)
              
              try {
                set ({ loading: 'Saving ' + file + '...' })
                await api.poke({ app: 'ziggurat', mark: 'ziggurat-action', json: { project: projectTitle, action: { 'save-file': { file, text } } } })
                get().getGallFile(projectTitle, file)
              } catch (err) {
                toast.error(`Error saving ${file}`)
              }

              return file
            })
          )


          
          const newProjects = { ...get().projects }
          newProjects[projectTitle].modifiedFiles = new Set<string>()
          // newProjects[projectTitle].molds = generateMolds(newProjects[projectTitle])
          set({ projects: newProjects, loading: '' })
        }
      } catch (err) {}
    },
    saveFileList: async (downloadedFiles, project: string) => {
      let lastFile = ''

      try {
        set({ loading: 'Saving files...' })
        
        const txtMar = await api.scry({ app: 'ziggurat', path: `/read-file/zig/mar/txt/hoon` })
        
        const saveFile = async ({ path, type, content }: DownloadedFile, i: number) => {
          lastFile = path
          const hasMar = (get().knownMars.indexOf(type) > -1) 
            || (await api.scry({ app: 'ziggurat', path: `/file-exists/zig/mar/${type}/hoon` }))
          // console.log({ path, type, hasMar, content })
          // create mar for unknown filetypes. treat all unmarked files as txt
          if (!hasMar) {
            await api.poke({ app: 'ziggurat', mark: 'ziggurat-action', json: { project, action: { "save-file": { file: `/zig/mar/${type}/hoon`, text: txtMar } } } })
          }

          if (i+1 < downloadedFiles.length) {
            set({ 
              loading: `Saving files... 
${path}
(${i+1}/${downloadedFiles.length})`,
              knownMars: [ ...get().knownMars, type ]
            })
          } else {
            set({ loading: '' })
          }

          return api.poke({ app: 'ziggurat', mark: 'ziggurat-action', json: { project, action: { "save-file": { file: path, text: content || '' } } } })
        }

        await pMap(downloadedFiles, saveFile, { concurrency: 2, stopOnError: false })
      } catch (err) {
        alert(`Unable to save all files. Halted at ${lastFile}`)
        set({ loading: '' })
      }
      set({ loading: '' })
    },
    fileExists: async (project: string, path: string) => await api.scry({ 
      app: 'ziggurat', 
      path: `/file-exists/${project}/${path}`
    }),
    readFile: async (project: string, path: string) => await api.scry({
      app: 'ziggurat',
      path: `/read-file/${project}/${path}`
    }),
    addFile: async (project: string, filename: string, fileContent?: string) => {
      set({ loading: 'Saving file...' })
      const file = filename[0] === '/' ? filename.replace(/\./g, '/') : `/${filename.replace(/\./g, '/')}`
      try {

        await api.poke({ app: 'ziggurat', mark: 'ziggurat-action', json: { project, action: { "save-file": { file, text: fileContent || '' } } } })
        await get().getProjects()
      } catch {
        toast.error('Error saving file.')
      } finally {
        set({ loading: undefined })
      }
    },
    deleteFile: async (project: string, file: string) => {
      const filename = getFilename(file)
      if (project === file) {
        return alert('You cannot delete the main contract file. Delete the project instead.')
      }
      if (window.confirm(`Are you sure you want to delete ${filename} in project "${project}"?`)) {
        await api.poke({ app: 'ziggurat', mark: 'ziggurat-action', json: { project, action: { 'delete-file': { file } } } })
        const newProjects = { ...get().projects }
        const newDir = newProjects[project].dir.filter(f => f !== file)
        const newModified = newProjects[project].modifiedFiles
        newModified.delete(file)
        newProjects[project] = {
          ...newProjects[project],
          dir: newDir,
          folder: mapFilesToFolders(project, newDir, newProjects[project]),
          modifiedFiles:  newModified,
        }
        set({ projects: newProjects })
      }
    },
    setOpenFiles: (openFiles: OpenFile[]) => set({ openFiles }),
    approveCorsDomain: async (domain: string) => {
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-action', json: { project: '', action: { 'approve-cors-domain': { domain } } } })
    },
    addItem: async (item: TestItemInput, isUpdate = false) => {
      const project = get().currentProject
      const action = isUpdate ? { "update-item": item } : { "add-item": { ...item, id: undefined } } 
      const json = { project, action }
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-action', json })

      get().getProjects()
    },
    deleteItem: async (itemId: string, testId?: string) => {
      const project = get().currentProject
      const proj = get().projects[project]
      const newProject = { ...proj }

      if (testId) {
        const json = { project, action: { "delete-test-expectation": { id: testId, delete: itemId } } }
        await api.poke({ app: 'ziggurat', mark: 'ziggurat-action', json })
        delete newProject.tests[testId].expected[itemId]
      } else {
        const json = { project, action: { "delete-item": { id: itemId } } }
        await api.poke({ app: 'ziggurat', mark: 'ziggurat-action', json })
        delete newProject.state[itemId]
      }

      const newProjects = get().projects
      newProjects[project] = newProject
      set({ projects: newProjects })
    },
    addTest: async (name: string, action: string, expectedError: number) => {
      const project = get().currentProject
      const json = {project, action: { "add-test": { name, action, 'expected-error': expectedError } } }
      console.log('ADDING TEST:', json)
      try {
        await api.poke({ app: 'ziggurat', mark: 'ziggurat-action', json })
      } catch {
        const msg = 'Error saving test. Please ensure your hoon data is valid, and that you do not use any interfaces.'
        alert(msg)
        throw msg
      }
    },
    addTestExpectation: async (testId: string, expected: TestItemInput) => {
      const project = get().currentProject
      const json = { project, action: { "add-test-expectation": { id: testId, expected: {
        ...expected, id: undefined // ids are calculated on backend
      } } } }
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-action', json })
    },
    deleteTest: async (testId: string) => {
      const project = get().currentProject
      const json = { project, action: { "delete-test": { id: testId } } }
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-action', json })
    },
    updateTest: async (testId: string, name: string, action: string, expectedError: number) => {
      const project = get().currentProject
      const json = { project, action: { "edit-test": { id: testId, name, action, 'expected-error': expectedError } } }
      console.log('UPDATING TEST:', json)
      try {
        await api.poke({ app: 'ziggurat', mark: 'ziggurat-action', json })
      } catch {
        const msg = 'Error saving test. Please ensure your hoon data is valid, and that you do not use any interfaces.'
        alert(msg)
        throw msg
      }
    },
    runTest: async (payload: RunTestPayload) => {
      const project = get().currentProject
      const json = { project, action: { "run-test": payload } }
      console.log('RUNNING TEST:', json)
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-action', json })
      console.log('DONE')
    },
    runTests: async (payload: RunTestPayload[]) => {
      const project = get().currentProject
      const json = { project, action: { "run-tests": payload } }
      console.log('RUNNING TESTS:', json)
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-action', json })
      console.log('DONE')
    },
    deployContract: async (project: string, address: string, location: string, town: string, rate: number, bud: number, upgradable: boolean) => {
      // address is the public key address of the user's wallet
      // location is not used for now. either "local" or the urbit ship running the testnet
      set({ loading: 'Deploying contract...' })
      const json = {
        project,
        action: {
          "deploy-contract": { address, rate, bud, upgradable, "deploy-location": location, "town-id": town }
        }
      }
      console.log('DEPLOYING CONTRACT:', json)
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-action', json })
      console.log('DONE')
      set({ loading: undefined })
    },
    publishGallApp: async (project: string, title: string, info: string, color: string, image: string, version: number[], website: string, license: string) => {
      const json = {
        project,
        "action": { "publish-app": { title, info, color, image, version, website, license } }
      }
      console.log('PUBLISHING GALL APP:', json)
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-action', json })
    },
    addTool: (tool: string) => set({ openTools: get().openTools.concat([tool]), currentTool: tool }),
    setCurrentTool: (currentTool: string) => set({ currentTool }),
    removeTool: (tool: string) => {
      const { openTools, currentTool } = get()
      set({ openTools: openTools.filter(a => a !== tool), currentTool: currentTool === tool ? openTools[0] || '' : currentTool })
    },
    toggleTest: (project: string, testId: string) => {
      const newProjects = { ...get().projects }
      newProjects[project].tests[testId].selected = !newProjects[project].tests[testId].selected
      set({ projects: newProjects })
    },
    addToastMessage: (project: string, message: string, id: number | string) => set({ toastMessages: get().toastMessages.concat([{ project, message, id }]) }),
    setUserAddress: (userAddress: string) => set({ userAddress }),
    getGallFile: async (project: string, file: string) => {
      const text = await api.scry<string>({ app: 'ziggurat', path: `/read-file/${project}${file}` })
      const newProjects = { ...get().projects }
      const targetApp = newProjects[project]
      const folder = getFolderForFile(targetApp.folder, file)
      if (folder)
        folder.contents[file] = text

      set({ projects: newProjects })
    },
    addEndpoint: async (endpoint: EndpointForm, id?: string) => {
      // TODO: add subscriptions
      const newEndpoints = await Promise.all(
        get().endpoints.map(async (e) => {
          if (e.id === id && e.type === 'sub' && e.sub !== undefined) {
            await api.unsubscribe(e.sub)
            e.sub = await api.subscribe(createSubscription(e.app, e.path!, handleEndpointUpdate(get, set, e.id)))
          }

          return id === e.id ? { id, ...endpoint } : e
        })
      )

      if (!id) {
        const { app, path } = endpoint
        const newId = genRanHex(8)
        const sub = endpoint.type === 'sub' ? await api.subscribe(createSubscription(app, path!, handleEndpointUpdate(get, set, newId))) : undefined
        newEndpoints.push({ id: newId, sub, result: endpoint.type === 'sub' ? [] : undefined, ...endpoint })
      }

      set({ endpoints: newEndpoints })
    },
    testEndpoint: async (endpoint: Endpoint) => {
      const updatedEndpoint = { ...endpoint }

      try {
        const { app, path, mark, json } = updatedEndpoint
        if (updatedEndpoint.type === 'scry') {
          updatedEndpoint.result = JSON.stringify(await api.scry({ app, path: path || '' }))
        } else if (updatedEndpoint.type === 'poke') {
          updatedEndpoint.result = String(await api.poke({ app, mark: mark || '', json: JSON.parse(json || '{}') }))
        }
      } catch (err) {
        updatedEndpoint.error = 'check console'
      }

      set({ endpoints: get().endpoints.map(e => e.id === endpoint.id ? updatedEndpoint : e) })
    },
    removeEndpoint: (id: string) => {
      const newEndpoints = get().endpoints.filter(e => {
        if (e.id === id && e.type === 'sub' && e.sub !== undefined)
          api.unsubscribe(e.sub)

        return e.id !== id
      })
      set({ endpoints: newEndpoints })
    }
  }),
  {
    name: our+'-zigguratStore',
    version: ZIGGURAT_STORAGE_VERSION,
    getStorage: () => sessionStorage,
  }
));

export default useZigguratStore;
