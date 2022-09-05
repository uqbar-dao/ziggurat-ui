import { GetState, SetState } from "zustand";
import { toast } from 'react-toastify';
import { ContractState, ContractUpdate } from "../../types/Contracts";
import { generateState, generateTests } from "../../utils/project";
import { ProjectStore } from "../projectStore";
import { GallApp } from "../../types/GallApp";
import { mapFilesToFolders } from "../../utils/gall";

export const handleContractUpdate = (get: GetState<ProjectStore>, set: SetState<ProjectStore>, project: string) => (update: ContractUpdate) => {
  console.log('PROJECT UPDATE FOR:', project, update)
  const newContracts = { ...get().contracts }
  newContracts[project] = {
    ...(newContracts[project] || {}),
    ...update,
    state: generateState(update),
    tests: generateTests(update, newContracts[project]),
  }
  set({ contracts: newContracts })

  const { toastMessages } = get()
  if (update.error && !toastMessages.find(t => t.project === project && t.message === update.error)) {
    set({ toastMessages: toastMessages.concat([{
      project,
      message: update.error,
      id: toast.error(
        <>
          <div>Error with project '{project}'</div>
          <p>{update.error}</p>
        </>,
        {
          
          onClose: () => set({ toastMessages: get().toastMessages.filter(t => !(t.project === project && t.message === update.error)) })
        }
      )
    }]) })
  } else if (!update.error) {
    toastMessages.forEach(t => {
      if (t.project === project)
        toast.dismiss(t.id)
    })
    set({ toastMessages: toastMessages.filter(t => t.project !== project) })
  }
}

export const handleGallUpdate = (get: GetState<ProjectStore>, set: SetState<ProjectStore>, project: string) => (update: GallApp) => {
  console.log('GALL UPDATE FOR:', project, update)
  const newContracts = { ...get().gallApps }
  newContracts[project] = {
    ...(newContracts[project] || {}),
    ...update,
    folders: mapFilesToFolders(project, update.dir),
  }
  set({ gallApps: newContracts })
}

export const handleTestUpdate = (get: GetState<ProjectStore>, set: SetState<ProjectStore>, project: string) => (update: ContractState) => {
  console.log('TEST UPDATE FOR:', project, update)
}
