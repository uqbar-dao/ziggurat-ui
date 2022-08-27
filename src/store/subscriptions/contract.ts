import { GetState, SetState } from "zustand";
import { ProjectState, ProjectUpdate } from "../../types/Project";
import { ContractStore } from "../contractStore";

export const handleProjectUpdate = (get: GetState<ContractStore>, set: SetState<ContractStore>, project: string) => (update: ProjectUpdate) => {
  // if the project doesn't exist, create it
  console.log('PROJECT UPDATE FOR:', project, update)
}

export const handleTestUpdate = (get: GetState<ContractStore>, set: SetState<ContractStore>, project: string) => (update: ProjectState) => {
  console.log('TEST UPDATE FOR:', project, update)
}
