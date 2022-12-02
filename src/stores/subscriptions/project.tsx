import { GetState, SetState } from "zustand";
import { toast } from 'react-toastify';
import { generateState, generateTests } from "../../utils/project";
import { ZigguratStore } from "../zigguratStore";
import { ProjectUpdate } from "../../types/ziggurat/Project";
import { mapFilesToFolders } from "../../utils/project";
import { TestResultUpdate } from "../../types/ziggurat/TestData";

export const handleGallUpdate = (get: GetState<ZigguratStore>, set: SetState<ZigguratStore>, project: string) => (update: ProjectUpdate) => {
  console.log('UPDATE FOR:', project, update)
  const newProjects = { ...get().projects }
  newProjects[project] = {
    ...(newProjects[project] || {}),
    ...update,
    folder: mapFilesToFolders(project, update.dir, get().projects[project]),
    state: generateState(update),
    tests: generateTests(update, newProjects[project]),
  }
  set({ projects: newProjects })

  const { toastMessages } = get()
  if (update.errors.length) {
    const errors = update.errors.map(e => ({
      project,
      message: e.error,
      id: toast.error(
        <>
          <div style={{fontWeight:'bold', marginBottom: 4}}>Error in {project}: {e.path}</div>
          {e.error.split('\n').map(line => (
            <pre key={line} style={{ margin: 0, fontFamily: 'monospace', fontSize: 'small' }}>{line}</pre>
          ))}
        </>,
        {
          onClose: () => set({ toastMessages })
        }
      )
    }))

    if (errors.find(e => toastMessages.every(t => t.message != e.message))) {
      set({ toastMessages: (errors) })
    }
  } else {
    const successToast = {
      project,
      message: `Built '${project}' successfully.`,
      id: toast.success(`Built '${project}' successfully.`, { autoClose: 1000 }),
    }
    toastMessages.forEach(t => {
      if (t.project === project || t.message === successToast.message)
        toast.dismiss(t.id)
    }) 
    set({ toastMessages: toastMessages
      .filter(t => t.project !== project && t.message !== successToast.message)
      .concat([successToast])
    })
  }
}

export const handleTestUpdate = (get: GetState<ZigguratStore>, set: SetState<ZigguratStore>, project: string) => (update: TestResultUpdate) => {
  console.log('TEST UPDATE FOR:', project, update)
  // const newProjects = { ...get().projects }
  // newProjects[project] = {
  //   ...(newProjects[project] || {}),
  //   ...update,
  //   tests: {
  //     ...newProjects[project].tests,

  //   }
  // }
  // set({ projects: newProjects })
}
