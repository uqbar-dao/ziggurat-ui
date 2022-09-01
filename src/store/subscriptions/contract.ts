import { GetState, SetState } from "zustand";
import { ProjectState, ProjectUpdate } from "../../types/Project";
import { generateState, generateTests } from "../../utils/project";
import { ContractStore } from "../contractStore";

export const handleProjectUpdate = (get: GetState<ContractStore>, set: SetState<ContractStore>, project: string) => (update: ProjectUpdate) => {
  // if the project doesn't exist, create it
  console.log('PROJECT UPDATE FOR:', project, update)
  const newProjects = { ...get().projects }
  newProjects[project] = {
    ...(newProjects[project] || {}),
    ...update,
    state: generateState(update),
    tests: generateTests(update, newProjects[project]),
  }
  set({ projects: newProjects, compilationError: update.error ? { project, error: update.error } : undefined })
}

export const handleTestUpdate = (get: GetState<ContractStore>, set: SetState<ContractStore>, project: string) => (update: ProjectState) => {
  console.log('TEST UPDATE FOR:', project, update)
}
