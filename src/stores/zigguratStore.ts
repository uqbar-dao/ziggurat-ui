import create from "zustand"
import { persist } from "zustand/middleware"
import api from "../api";
import { HardwareWallet, HardwareWalletType, HotWallet, processAccount, RawAccount } from "../types/wallet/Accounts";
import { GallApps } from "../types/ziggurat/GallApp";
import { OpenFile } from "../types/ziggurat/OpenFile";
import { Contracts } from "../types/ziggurat/Contracts";
import { RunTestPayload } from "../types/ziggurat/TestData";
import { TestGrainInput } from "../types/ziggurat/TestGrain";
import { DEFAULT_USER_ADDRESS, ZIGGURAT_STORAGE_VERSION } from "../utils/constants";
import { generateMolds, generateProjects } from "../utils/project";
import { handleGallUpdate, handleContractUpdate, handleTestUpdate } from "./subscriptions/project";
import { createSubscription, Subscriptions } from "./subscriptions/createSubscription";
import { getFilename, getFileText, getFolder, getFolderForFile, mapFilesToFolders } from "../utils/gall";

export interface ZigguratStore {
  loading?: string
  currentProject: string
  currentFolder: string
  accounts: HotWallet[]
  importedAccounts: HardwareWallet[]
  contracts: Contracts
  gallApps: GallApps
  openFiles: OpenFile[]
  openTools: string[]
  currentTool: string
  subscriptions: Subscriptions
  toastMessages: { project: string, message: string, id: number | string }[]
  userAddress: string
  setLoading: (loading?: string) => void
  init: () => Promise<Contracts>
  getProjects: () => Promise<Contracts>
  createProject: (options: { [key: string]: string }) => Promise<void>
  populateTemplate: (project: string, template: 'nft' | 'fungible', metadata: TestGrainInput) => Promise<void>
  setCurrentProject: (currentProject: string) => void
  setCurrentFolder: (currentFolder: string) => void
  deleteProject: (project: string) => Promise<string | null>
  setProjectExpanded: (project: string, expanded: boolean) => void
  toggleGallFolder: (project: string, folder: string) => void
  setProjectText: (project: string, file: string, text: string) => void
  saveFiles: (projectTitle: string) => Promise<void>
  addFile: (project: string, filename: string, isGall: boolean) => Promise<void>
  deleteFile: (project: string, file: string) => Promise<void>
  setOpenFiles: (openFiles: OpenFile[]) => void
  toggleTest: (project: string, testId: string) => void

  addGrain: (rice: TestGrainInput) => Promise<void>
  deleteGrain: (riceId: string, testId?: string) => Promise<void>
  addTest: (name: string, action: string, expectedError: number) => Promise<void>
  addTestExpectation: (testId: string, expectations: TestGrainInput) => Promise<void>
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
}

const useZigguratStore = create<ZigguratStore>(persist<ZigguratStore>(
  (set, get) => ({
    loading: '',
    accounts: [],
    importedAccounts: [],
    currentProject: '',
    currentFolder: '',
    contracts: {},
    gallApps: {},
    openFiles: [],
    subscriptions: {},
    openTools: ['webterm'],
    currentTool: '',
    toastMessages: [],
    userAddress: DEFAULT_USER_ADDRESS,
    setLoading: (loading?: string) => set({ loading }),
    init: async () => {
      const contracts = await get().getProjects()

      if (!get().currentProject && Object.values(contracts)[0]) {
        set({ currentProject: Object.values(contracts)[0].title || '' })
      }

      set({ loading: undefined })

      return contracts
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
      const { contracts, gallApps } = generateProjects(rawProjects, get().contracts, get().gallApps)
      console.log('PROJECTS:', contracts, gallApps)
      
      const subscriptions = Object.keys(contracts).reduce((subs, p) => {
        subs[p] = [
          api.subscribe(createSubscription('ziggurat', `/contract-project/${p}`, handleContractUpdate(get, set, p))),
          api.subscribe(createSubscription('ziggurat', `/test-updates/${p}`, handleTestUpdate(get, set, p))),
        ]
        return subs
      }, {} as Subscriptions)

      Object.keys(gallApps).forEach((gp) => subscriptions[gp] = [
        api.subscribe(createSubscription('ziggurat', `/app-project/${gp}`, handleGallUpdate(get, set, gp)))
      ])

      set({ contracts, subscriptions, gallApps })
      return contracts
    },
    createProject: async (options: { [key: string]: string }) => {
      set({ loading: 'Creating project...' })
      const project = options.title
      console.log(1, get().userAddress)

      if (options?.project === 'contract') {
        const json = { project, action: { "new-contract-project": { template: options.token, 'user-address': get().userAddress } } }
        console.log(2, json)
        await api.poke({ app: 'ziggurat', mark: 'ziggurat-contract-action', json })
      } else if (options?.project === 'gall') {
        const json = { project, action: { "new-app-project": null } }
        await api.poke({ app: 'ziggurat', mark: 'ziggurat-app-action', json })
      }

      setTimeout(async () => {
        await get().getProjects()
        set({ loading: undefined, currentProject: options.title })
      }, 1000)
    },
    populateTemplate: async (project: string, template: 'nft' | 'fungible', metadata: TestGrainInput) => {
      const json = { project, action: { "populate-template": { template, metadata } } }
      console.log('POPULATE', json)
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-contract-action', json })
    },
    setCurrentProject: (currentProject: string) => set({ currentProject }),
    setCurrentFolder: (currentFolder: string) => set({ currentFolder }),
    deleteProject: async (project: string) => {
      (get().subscriptions[project] || []).map(subPromise => subPromise.then(sub => api.unsubscribe(sub)).catch(console.warn))

      await api.poke({ app: 'ziggurat', mark: `ziggurat-${get().contracts[project] ? 'contract' : 'app'}-action`, json: { project, action: { "delete-project": null } } })

      const openFiles = get().openFiles.filter(of => of.project !== project)
      set({ openFiles })

      get().getProjects()

      if (project === get().currentProject) {
        const nextProject = Object.keys(get().contracts)[0] || ''
        set({ currentProject: nextProject })
        return nextProject
      }

      return null
    },
    setProjectExpanded: (project: string, expanded: boolean) => {
      const newProjects = { ...get().contracts }
      const newApps = { ...get().gallApps }

      if (newProjects[project]) {
        newProjects[project].expanded = expanded
        set({ contracts: newProjects })
      } else if (newApps[project]) {
        newApps[project].expanded = expanded
        set({ gallApps: newApps })
      }
    },
    toggleGallFolder: (project: string, folder: string) => {
      const newApps = { ...get().gallApps }
      const targetApp = newApps[project]
      const targetFolder = getFolder(targetApp.folder, folder.split('/'))
      if (targetFolder)
        targetFolder.expanded = !targetFolder.expanded
      
      set({ gallApps: newApps })
    },
    setProjectText: (project: string, file: string, text: string) => {
      const { contracts, gallApps } = get()
      if (contracts[project]) {
        const newProjects = { ...contracts }
        if (file === project) {
          newProjects[project].main = text
        } else {
          newProjects[project].libs[file] = text
        }
        newProjects[project].modifiedFiles.add(file)
        set({ contracts: newProjects })
      } else if (gallApps[project]) {
        const newApps = { ...gallApps }
        const folder = getFolderForFile(newApps[project].folder, file)
        if (folder) {
          folder.contents[file] = text
          newApps[project].modifiedFiles.add(file)
          set({ gallApps: newApps })
        }
      }
    },
    saveFiles: async (project: string) => {
      const contract = get().contracts[project]
      const gallApp = get().gallApps[project]
      set({ loading: `Saving ${gallApp ? 'gall app' : 'contract'}...` })
      if (contract && contract.modifiedFiles.size) {
        console.log(2)
        await Promise.all(
          Array.from(contract.modifiedFiles.values()).map(async (name) => {
            const text = name === project ? contract.main : contract.libs[name]
            await api.poke({ app: 'ziggurat', mark: 'ziggurat-contract-action', json: { project, action: { 'save-file': { name, text } } } })
          })
        )
        const newContracts = { ...get().contracts }
        newContracts[project].modifiedFiles = new Set<string>()
        newContracts[project].molds = generateMolds(newContracts[project])
        set({ contracts: newContracts })
      } else if (gallApp && gallApp.modifiedFiles.size) {
        const files = await Promise.all(
          Array.from(gallApp.modifiedFiles.values()).map(async (file) => {
            const text = getFileText(gallApp.folder, file.split('/').slice(1), file)
            await api.poke({ app: 'ziggurat', mark: 'ziggurat-app-action', json: { project, action: { 'save-file': { file, text } } } })
            return file
          })
        )
        const newApps = { ...get().gallApps }
        newApps[project].modifiedFiles = new Set<string>()
        set({ gallApps: newApps })
        await Promise.all(files.map(file => get().getGallFile(project, file)))
      }
      set({ loading: undefined })
    },
    addFile: async (project: string, filename: string, isGall: boolean) => {
      set({ loading: 'Saving file...' })
      if (isGall) {
        const file = filename[0] === '/' ? filename.replace(/\./g, '/') : `/${filename.replace(/\./g, '/')}`
        await api.poke({ app: 'ziggurat', mark: 'ziggurat-app-action', json: { project, action: { "save-file": { file, text: '' } } } })
      } else {
        await api.poke({ app: 'ziggurat', mark: 'ziggurat-contract-action', json: { project, action: { 'save-file': { name: filename, text: '' } } } })
      }
      await get().getProjects()
      set({ loading: undefined })
    },
    deleteFile: async (project: string, file: string) => {
      const isGall = Boolean(get().gallApps[project])
      const filename = isGall ? getFilename(file) : `${file}.hoon`
      if (project === file) {
        return alert('You cannot delete the main contract file. Delete the project instead.')
      }
      if (window.confirm(`Are you sure you want to delete ${filename} in project "${project}"?`)) {
        if (isGall) {
          await api.poke({ app: 'ziggurat', mark: 'ziggurat-app-action', json: { project, action: { 'delete-file': { file } } } })
          const newApps = { ...get().gallApps }
          const newDir = newApps[project].dir.filter(f => f !== file)
          const newModified = newApps[project].modifiedFiles
          newModified.delete(file)
          newApps[project] = {
            ...newApps[project],
            dir: newDir,
            folder: mapFilesToFolders(project, newDir, newApps[project]),
            modifiedFiles:  newModified,
          }
          set({ gallApps: newApps })
        } else {
          await api.poke({ app: 'ziggurat', mark: 'ziggurat-contract-action', json: { project, action: { 'delete-file': { name: file } } } })
          const newContracts = { ...get().contracts }
          delete newContracts[project].libs[file]
          set({ contracts: newContracts })
        }
      }
    },
    setOpenFiles: (openFiles: OpenFile[]) => set({ openFiles }),
    addGrain: async (rice: TestGrainInput) => {
      const project = get().currentProject
      const json = { project, action: { "add-to-state": rice } }
      console.log('SAVING GRAIN:', json)
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-contract-action', json })
    },
    deleteGrain: async (riceId: string, testId?: string) => {
      const project = get().currentProject
      if (testId) {
        const json = { project, action: { "delete-test-expectation": { id: testId, delete: riceId } } }
        await api.poke({ app: 'ziggurat', mark: 'ziggurat-contract-action', json })
      } else {
        const json = { project, action: { "delete-from-state": { id: riceId } } }
        await api.poke({ app: 'ziggurat', mark: 'ziggurat-contract-action', json })
      }
    },
    addTest: async (name: string, action: string, expectedError: number) => {
      const project = get().currentProject
      const json = {project, action: { "add-test": { name, action, 'expected-error': expectedError } } }
      console.log('ADDING TEST:', json)
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-contract-action', json })
    },
    addTestExpectation: async (testId: string, expected: TestGrainInput) => {
      const project = get().currentProject
      const json = { project, action: { "add-test-expectation": { id: testId, expected } } }
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-contract-action', json })
    },
    deleteTest: async (testId: string) => {
      const project = get().currentProject
      const json = { project, action: { "delete-test": { id: testId } } }
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-contract-action', json })
    },
    updateTest: async (testId: string, name: string, action: string, expectedError: number) => {
      const project = get().currentProject
      const json = { project, action: { "edit-test": { id: testId, name, action, 'expected-error': expectedError } } }
      console.log('UPDATING TEST:', json)
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-contract-action', json })
    },
    runTest: async (payload: RunTestPayload) => {
      const project = get().currentProject
      const json = { project, action: { "run-test": payload } }
      console.log('RUNNING TEST:', json)
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-contract-action', json })
      console.log('DONE')
    },
    runTests: async (payload: RunTestPayload[]) => {
      const project = get().currentProject
      const json = { project, action: { "run-tests": payload } }
      console.log('RUNNING TESTS:', json)
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-contract-action', json })
      console.log('DONE')
    },
    deployContract: async (project: string, address: string, location: string, town: string, rate: number, bud: number, upgradable: boolean) => {
      // address is the public key address of the user's wallet
      // location is either "local" or the urbit ship running the testnet
      set({ loading: 'Deploying contract...' })
      const json = {
        project,
        action: {
          "deploy-contract": { address, rate, bud, upgradable, "deploy-location": location, "town-id": town, }
        }
      }
      console.log('DEPLOYING CONTRACT:', json)
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-contract-action', json })
      console.log('DONE')
      set({ loading: undefined })
    },
    publishGallApp: async (project: string, title: string, info: string, color: string, image: string, version: number[], website: string, license: string) => {
      const json = {
        project,
        "action": { "publish-app": { title, info, color, image, version, website, license } }
      }
      console.log('PUBLISHING GALL APP:', json)
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-app-action', json })
    },
    addTool: (tool: string) => set({ openTools: get().openTools.concat([tool]), currentTool: tool }),
    setCurrentTool: (currentTool: string) => set({ currentTool }),
    removeTool: (tool: string) => {
      const { openTools, currentTool } = get()
      set({ openTools: openTools.filter(a => a !== tool), currentTool: currentTool === tool ? openTools[0] || '' : currentTool })
    },
    toggleTest: (project: string, testId: string) => {
      const newProjects = { ...get().contracts }
      newProjects[project].tests[testId].selected = !newProjects[project].tests[testId].selected
      set({ contracts: newProjects })
    },
    addToastMessage: (project: string, message: string, id: number | string) => set({ toastMessages: get().toastMessages.concat([{ project, message, id }]) }),
    setUserAddress: (userAddress: string) => set({ userAddress }),
    getGallFile: async (project: string, file: string) => {
      const text = await api.scry<string>({ app: 'ziggurat', path: `/read-file/${project}${file}` })
      const newApps = { ...get().gallApps }
      const targetApp = newApps[project]
      const folder = getFolderForFile(targetApp.folder, file)
      if (folder)
        folder.contents[file] = text
      
      set({ gallApps: newApps })
    }
  }),
  {
    name: 'zigguratStore',
    version: ZIGGURAT_STORAGE_VERSION,
  }
));

export default useZigguratStore;