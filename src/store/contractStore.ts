import create from "zustand"
import { persist } from "zustand/middleware"
import api from "../api";
import { RawMetadata } from "../code-text/test-data/fungible";
import { Projects } from "../types/Project";
import { RunTestPayload, Test } from "../types/TestData";
import { TestExpectation } from "../types/TestExpectation";
import { TestRice } from "../types/TestGrain";
import { handleProjectUpdate, handleTestUpdate } from "./subscriptions/contract";
import { createSubscription } from "./subscriptions/createSubscription";

export interface ContractStore {
  loading?: string
  currentProject: string
  projects: Projects
  openApps: string[]
  currentApp: string
  setLoading: (loading?: string) => void
  init: () => Promise<void>
  getProjects: () => Promise<void>
  createProject: (options: { [key: string]: string }, rawMetadata?: RawMetadata) => Promise<void>
  setCurrentProject: (currentProject: string) => void
  deleteProject: (project: string) => Promise<void>
  saveFile: (project: string, name: string, text: string) => Promise<void>
  deleteFile: (project: string, name: string) => Promise<void>

  addRice: (project: string, rice: TestRice) => Promise<void>
  deleteRice: (project: string, riceId: string) => Promise<void>
  addTest: (project: string, name: string, action: string) => Promise<void>
  addTestExpectations: (project: string, testId: string, expectations: TestExpectation[]) => Promise<void>
  deleteTest: (project: string, testId: string) => Promise<void>
  updateTest: (project: string, testId: string, name: string, action: string) => Promise<void>
  runTests: (project: string, payload: RunTestPayload[]) => Promise<void>
  deployContract: (project: string, location: string, town: string) => Promise<void>
}

const useContractStore = create<ContractStore>(persist<ContractStore>(
  (set, get) => ({
    loading: '',
    currentProject: '',
    projects: {},
    openApps: ['webterm'],
    currentApp: '',
    route: { route: 'project', subRoute: 'new' },
    setLoading: (loading?: string) => set({ loading }),
    init: async () => {
      get().getProjects()

      set({ loading: undefined })
    },
    getProjects: async () => {
      const projects = await api.scry({ app: 'citadel', path: '/all-projects/json' })
      console.log('PROJECTS:', projects)

      Object.keys(projects).forEach((p) => {
        api.subscribe(createSubscription('ziggurat', `/contract-project/${p}`, handleProjectUpdate(get, set, p)))
        api.subscribe(createSubscription('ziggurat', `/test-updates/${p}`, handleTestUpdate(get, set, p)))
      })

      set({ projects })
    },
    createProject: async (options: { [key: string]: string }, rawMetadata?: RawMetadata) => {
      set({ loading: 'Creating project...' })

      const project = options.title
      const json = { project, action: { "new-contract-project": options.token } }

      await api.poke({ app: 'ziggurat', mark: 'ziggurat-poke', json })
      await get().getProjects()
      set({ loading: undefined })
    },
    setCurrentProject: (currentProject: string) => {
      set({ currentProject })
    },
    deleteProject: async (project: string) => {
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-poke', json: { project, action: { "delete-project": null } } })
    },
    saveFile: async (project: string, name: string, text: string) => {
      set({ loading: 'Saving file(s)...' })
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-poke', json: { project, action: { 'save-file': { name, text } } } })
    },
    deleteFile: async (project: string, name: string) => {
      if (project === name) {
        return alert('You cannot delete the main contract file. Delete the project instead.')
      }
      if (window.confirm(`Are you sure you want to delete ${name} in project ${project}?`)) {
        await api.poke({ app: 'ziggurat', mark: 'ziggurat-poke', json: { project, action: { 'delete-file': { name } } } })
      }
      // TODO: remove file from project
    },


    addRice: async (project: string, rice: TestRice) => {
      const json = { project, action: { "add-to-state": rice } }
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-poke', json })
    },
    deleteRice: async (project: string, riceId: string) => {
      const json = {project, action: { "delete-from-state": { id: riceId } } }
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-poke', json })
    },
    addTest: async (project: string, name: string, action: string) => {
      const json = {project, action: { "add-test": { name, action } } }
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-poke', json })
    },
    addTestExpectations: async (project: string, testId: string, expected: TestExpectation[]) => {
      const json = {
        project,
        action: {
          "add-test-expectations": { id: testId, expected }
        }
      }

      await api.poke({ app: 'ziggurat', mark: 'ziggurat-poke', json })
    },
    deleteTest: async (project: string, testId: string) => {
      const json = { project, action: { "delete-test": { id: testId } } }
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-poke', json })
    },
    updateTest: async (project: string, testId: string, name: string, action: string) => {
      const json = { project, action: { "edit-test": { id: testId, name, action } } }
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-poke', json })
    },
    runTests: async (project: string, payload: RunTestPayload[]) => {
      const json = { project, action: { "run-tests": payload } }
      await api.poke({ app: 'ziggurat', mark: 'ziggurat-poke', json })
    },
    deployContract: async (project: string, location: string, town: string) => {

    },
  }),
  {
    name: 'contractStore'
  }
));

export default useContractStore;
