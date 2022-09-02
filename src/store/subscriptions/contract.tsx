import { GetState, SetState } from "zustand";
import { toast } from 'react-toastify';
import { ProjectState, ProjectUpdate } from "../../types/Project";
import { generateState, generateTests } from "../../utils/project";
import { ContractStore } from "../contractStore";

export const handleProjectUpdate = (get: GetState<ContractStore>, set: SetState<ContractStore>, project: string) => (update: ProjectUpdate) => {
  console.log('PROJECT UPDATE FOR:', project, update)
  const newProjects = { ...get().projects }
  newProjects[project] = {
    ...(newProjects[project] || {}),
    ...update,
    state: generateState(update),
    tests: generateTests(update, newProjects[project]),
  }
  set({ projects: newProjects })

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

export const handleTestUpdate = (get: GetState<ContractStore>, set: SetState<ContractStore>, project: string) => (update: ProjectState) => {
  console.log('TEST UPDATE FOR:', project, update)
}
