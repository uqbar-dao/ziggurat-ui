import { GetState, SetState } from "zustand";
import { toast } from 'react-toastify';
import { ContractUpdate } from "../../types/ziggurat/Contracts";
import { generateState, generateTests } from "../../utils/project";
import { ZigguratStore } from "../zigguratStore";
import { GallApp } from "../../types/ziggurat/GallApp";
import { mapFilesToFolders } from "../../utils/gall";
import { TestResultUpdate } from "../../types/ziggurat/TestData";

export const handleContractUpdate = (get: GetState<ZigguratStore>, set: SetState<ZigguratStore>, project: string) => (update: ContractUpdate) => {
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
          {update.error.split('\n').map(line => (
            <p key={line} style={{ margin: 0 }}>{line}</p>
          ))}
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
    set({ toastMessages: toastMessages.filter(t => t.project !== project)
      .concat([{
        project,
        message: `Built '${project}' successfully.`,
        id: toast.success(`Built '${project}' successfully.`, { autoClose: 2000 }),
      }])
    })
  }
}

export const handleGallUpdate = (get: GetState<ZigguratStore>, set: SetState<ZigguratStore>, project: string) => (update: GallApp) => {
  console.log('GALL UPDATE FOR:', project, update)
  const newApps = { ...get().gallApps }
  newApps[project] = {
    ...(newApps[project] || {}),
    ...update,
    folder: mapFilesToFolders(project, update.dir, get().gallApps[project]),
  }
  set({ gallApps: newApps })
}

export const handleTestUpdate = (get: GetState<ZigguratStore>, set: SetState<ZigguratStore>, project: string) => (update: TestResultUpdate) => {
  console.log('TEST UPDATE FOR:', project, update)
  // const newContracts = { ...get().contracts }
  // newContracts[project] = {
  //   ...(newContracts[project] || {}),
  //   ...update,
  //   tests: {
  //     ...newContracts[project].tests,

  //   }
  // }
  // set({ contracts: newContracts })
}
