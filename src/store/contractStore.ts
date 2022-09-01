import create from "zustand"
import { persist } from "zustand/middleware"
import api from "../api";
import { OpenFile } from "../types/OpenFile";
import { Projects } from "../types/Project";
import { RunTestPayload } from "../types/TestData";
import { TestGrainInput } from "../types/TestGrain";
import { generateMolds, generateProjects } from "../utils/project";
import { grainToGrainInput } from "../utils/tests";
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
  saveFiles: (projectTitle: string) => Promise<void>
  deleteFile: (project: string, file: string) => Promise<void>
  setOpenFiles: (openFiles: OpenFile[]) => void
  toggleTest: (project: string, testId: string) => void
  setCompilationError: (project: string, error: string) => void

  addGrain: (rice: TestGrainInput) => Promise<void>
  deleteGrain: (riceId: string, testId?: string) => Promise<void>
  addTest: (name: string, action: string) => Promise<void>
  addTestExpectations: (testId: string, expectations: TestGrainInput[]) => Promise<void>
  deleteTest: (testId: string) => Promise<void>
  updateTest: (testId: string, name: string, action: string) => Promise<void>
  runTest: (payload: RunTestPayload) => Promise<void>
  runTests: (payload: RunTestPayload[]) => Promise<void>
  deployContract: (project: string, address: string, location: string, town: string, rate: number, bud: number, upgradable: boolean) => Promise<void>

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
    compilationError: undefined,
    setLoading: (loading?: string) => set({ loading }),
    init: async () => {
      const projects = await get().getProjects()

      if (!get().currentProject && Object.values(projects)[0]) {
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

      if (options?.project === 'contract') {
        const json = { project, action: { "new-contract-project": { template: options.token } } }
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
      if (file === project) {
        newProjects[project].main = text
      } else {
        newProjects[project].libs[file] = text
      }
      newProjects[project].modifiedFiles.add(file)
      set({ projects: newProjects })
    },
    saveFiles: async (projectTitle: string) => {
      const project = get().projects[projectTitle]
      if (project && project.modifiedFiles.size) {
        set({ loading: 'Saving project...' })
        await Promise.all(
          Array.from(project.modifiedFiles.values()).map(async (name) => {
            const text = name === projectTitle ? project.main : project.libs[name]
            await api.poke({ app: 'ziggurat', mark: 'ziggurat-contract-action', json: { project: projectTitle, action: { 'save-file': { name, text } } } })
          })
        )
        const newProjects = { ...get().projects }
        newProjects[projectTitle].modifiedFiles = new Set<string>()
        newProjects[projectTitle].molds = generateMolds(newProjects[projectTitle])
        set({ projects: newProjects, loading: undefined })
      }
    },
    deleteFile: async (project: string, file: string) => {
      if (project === file) {
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
    deleteGrain: async (riceId: string, testId?: string) => {
      // TODO: if isExpected, modify the test expectations
      const project = get().currentProject
      const json = {project, action: { "delete-from-state": { id: riceId } } }
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-contract-action', json })
    },
    addTest: async (name: string, action: string) => {
      const project = get().currentProject
      const json = {project, action: { "add-test": { name, action } } }
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-contract-action', json })
    },
    addTestExpectations: async (testId: string, expected: TestGrainInput[]) => {
      const { currentProject, projects } = get()
      const newExpected = Object.values(projects[currentProject].tests[testId].expected)
        .map(grainToGrainInput)
        .concat(expected)
      const json = { project: currentProject, action: { "add-test-expectations": { id: testId, expected: newExpected } } }
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
    deployContract: async (project: string, address: string, location: string, town: string, rate: number, bud: number, upgradable: boolean) => {
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
