import create from "zustand"
import { persist } from "zustand/middleware"
import api from "../api";
import { OpenFile } from "../types/OpenFile";
import { Projects } from "../types/Project";
import { RunTestPayload } from "../types/TestData";
import { TestExpectation } from "../types/TestExpectation";
import { TestGrainInput } from "../types/TestGrain";
import { generateProjects } from "../utils/project";
import { handleProjectUpdate, handleTestUpdate } from "./subscriptions/contract";
import { createSubscription, Subscriptions } from "./subscriptions/createSubscription";

export interface ContractStore {
  loading?: string
  currentProject: string
  projects: Projects
  openFiles: OpenFile[]
  openApps: string[]
  currentApp: string
  subscriptions: Subscriptions
  focusedTests: { [project: string]: string[] }
  compilationError?: { project: string, error: string }
  setLoading: (loading?: string) => void
  init: () => Promise<Projects>
  getProjects: () => Promise<Projects>
  createProject: (options: { [key: string]: string }) => Promise<void>
  populateTemplate: (project: string, template: 'nft' | 'fungible', metadata: TestGrainInput) => Promise<void>
  setCurrentProject: (currentProject: string) => void
  deleteProject: (project: string) => Promise<string | null>
  setProjectExpanded: (project: string, expanded: boolean) => void
  setProjectText: (project: string, file: string, text: string) => void
  saveFile: (project: string, file: string, text: string) => Promise<void>
  deleteFile: (project: string, file: string) => Promise<void>
  setOpenFiles: (openFiles: OpenFile[]) => void
  toggleTest: (project: string, testId: string) => void
  setCompilationError: (project: string, error: string) => void

  addGrain: (rice: TestGrainInput) => Promise<void>
  deleteGrain: (riceId: string) => Promise<void>
  addTest: (name: string, action: string) => Promise<void>
  addTestExpectations: (testId: string, expectations: TestExpectation[]) => Promise<void>
  deleteTest: (testId: string) => Promise<void>
  updateTest: (testId: string, name: string, action: string) => Promise<void>
  runTest: (payload: RunTestPayload) => Promise<void>
  runTests: (payload: RunTestPayload[]) => Promise<void>
  deployContract: (location: string, town: string) => Promise<void>

  addApp: (app: string) => void
  setCurrentApp: (currentApp: string) => void
  removeApp: (app: string) => void
}

const useContractStore = create<ContractStore>(persist<ContractStore>(
  (set, get) => ({
    loading: '',
    currentProject: '',
    projects: {},
    openFiles: [],
    subscriptions: {},
    openApps: ['webterm'],
    currentApp: '',
    focusedTests: {},
    compilationError: undefined,
    setLoading: (loading?: string) => set({ loading }),
    init: async () => {
      const projects = await get().getProjects()

      if (!get().currentProject) {
        set({ currentProject: Object.values(projects)[0].title || '' })
      }

      set({ loading: undefined })

      return projects
    },
    getProjects: async () => {
      const rawProjects = await api.scry({ app: 'ziggurat', path: '/all-projects' })
      const projects = generateProjects(rawProjects, get().projects)
      console.log('PROJECTS:', projects)
      
      const subscriptions = Object.keys(projects).reduce((subs, p) => {
        subs[p] = [
          api.subscribe(createSubscription('ziggurat', `/contract-project/${p}`, handleProjectUpdate(get, set, p))),
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
      const json = { project, action: { "new-contract-project": { template: options.token } } }

      await api.poke({ app: 'ziggurat', mark: 'ziggurat-contract-action', json })

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
    deleteProject: async (project: string) => {
      (get().subscriptions[project] || []).map(subPromise => subPromise.then(sub => api.unsubscribe(sub)).catch(console.warn))

      await api.poke({ app: 'ziggurat', mark: 'ziggurat-contract-action', json: { project, action: { "delete-project": null } } })

      const openFiles = get().openFiles.filter(of => of.project !== project)
      set({ openFiles })

      get().getProjects()

      if (project === get().currentProject) {
        const nextProject = Object.keys(get().projects)[0] || ''
        set({ currentProject: nextProject })
        return nextProject
      }

      return null
    },
    setProjectExpanded: (project: string, expanded: boolean) => {
      const newProjects = { ...get().projects }
      newProjects[project].expanded = expanded
      set({ projects: newProjects })
    },
    setProjectText: (project: string, file: string, text: string) => {
      const newProjects = { ...get().projects }
      if (file === 'main') {
        newProjects[project].main = text
      } else {
        newProjects[project].libs[file] = text
      }
      newProjects[project].modifiedFiles.add(file)
      set({ projects: newProjects })
    },
    saveFile: async (project: string, file: string, text: string) => {
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-contract-action', json: { project, action: { 'save-file': { name: file, text } } } })
    },
    deleteFile: async (project: string, file: string) => {
      if (project === file || project === 'main') {
        return alert('You cannot delete the main contract file. Delete the project instead.')
      }
      if (window.confirm(`Are you sure you want to delete ${file}.hoon in project "${project}"?`)) {
        await api.poke({ app: 'ziggurat', mark: 'ziggurat-contract-action', json: { project, action: { 'delete-file': { name: file } } } })
        const newProjects = { ...get().projects }
        delete newProjects[project].libs[file]
        set({ projects: newProjects })
      }
    },
    setOpenFiles: (openFiles: OpenFile[]) => set({ openFiles }),


    addGrain: async (rice: TestGrainInput) => {
      const project = get().currentProject
      const json = { project, action: { "add-to-state": rice } }
      console.log('SAVING GRAIN:', json)
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-contract-action', json })
    },
    deleteGrain: async (riceId: string) => {
      const project = get().currentProject
      const json = {project, action: { "delete-from-state": { id: riceId } } }
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-contract-action', json })
    },
    addTest: async (name: string, action: string) => {
      const project = get().currentProject
      const json = {project, action: { "add-test": { name, action } } }
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-contract-action', json })
    },
    addTestExpectations: async (testId: string, expected: TestExpectation[]) => {
      const project = get().currentProject
      const json = {
        project,
        action: {
          "add-test-expectations": { id: testId, expected }
        }
      }

      await api.poke({ app: 'ziggurat', mark: 'ziggurat-contract-action', json })
    },
    deleteTest: async (testId: string) => {
      const project = get().currentProject
      const json = { project, action: { "delete-test": { id: testId } } }
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-contract-action', json })
    },
    updateTest: async (testId: string, name: string, action: string) => {
      const project = get().currentProject
      const json = { project, action: { "edit-test": { id: testId, name, action } } }
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
    deployContract: async (location: string, town: string) => {
      const project = get().currentProject

    },
    addApp: (app: string) => set({ openApps: get().openApps.concat([app]), currentApp: app }),
    setCurrentApp: (currentApp: string) => set({ currentApp }),
    removeApp: (app: string) => {
      const { openApps, currentApp } = get()
      set({ openApps: openApps.filter(a => a !== app), currentApp: currentApp === app ? openApps[0] || '' : currentApp })
    },
    toggleTest: (project: string, testId: string) => {
      const newProjects = { ...get().projects }
      newProjects[project].tests[testId].selected = !newProjects[project].tests[testId].selected
      set({ projects: newProjects })
    },
    setCompilationError: (project: string, error: string) => set({ compilationError: { project, error } })
  }),
  {
    name: 'contractStore'
  }
));

export default useContractStore;
