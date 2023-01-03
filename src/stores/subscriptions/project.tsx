import { GetState, SetState } from "zustand";
import { toast } from 'react-toastify';
import { generateState, generateTests } from "../../utils/project";
import { ZigguratStore } from "../zigguratStore";
import { ProjectUpdate } from "../../types/ziggurat/Project";
import { mapFilesToFolders } from "../../utils/project";
import { TestResultUpdate } from "../../types/ziggurat/TestData";

export const handleProjectUpdate = (get: GetState<ZigguratStore>, set: SetState<ZigguratStore>, project: string) => (update: ProjectUpdate) => {
  console.log('UPDATE FOR:', {project, update})
  
  /**
   * Need to handle ALL of these types of update: 
   *  
  [%projects update-info payload=(data ~) projects=shown-projects]
  [%project update-info payload=(data ~) shown-project]
  [%state update-info payload=(data ~) state=(map @ux chain:engine)]
  [%dir update-info payload=(data (list path)) ~]
  [%dashboard update-info payload=(data json) ~]
  [%new-project update-info payload=(data ~) ~]
  [%add-test update-info payload=(data shown-test) test-id=@ux]
  [%compile-contract update-info payload=(data ~) ~]
  [%delete-test update-info payload=(data ~) test-id=@ux]
  [%run-queue update-info payload=(data ~) ~]
  [%test-results update-info payload=(data shown-test-results) test-id=@ux thread-id=@t =test-steps]
  [%project-names update-info payload=(data ~) project-names=(set @t)]
  [%add-custom-step update-info payload=(data ~) test-id=@ux tag=@tas]
  [%delete-custom-step update-info payload=(data ~) test-id=@ux tag=@tas]
  [%add-town-sequencer update-info payload=(data ~) town-id=@ux who=@p]
  [%delete-town-sequencer update-info payload=(data ~) town-id=@ux]
  [%add-user-file update-info payload=(data ~) file=path]
  [%delete-user-file update-info payload=(data ~) file=path]
  [%custom-step-compiled update-info payload=(data ~) test-id=@ux tag=@tas]
  [%add-app-to-dashboard update-info payload=(data ~) app=@tas sur=path mold-name=@t mar=path]
  [%delete-app-from-dashboard update-info payload=(data ~) app=@tas]
   */

  const updateTypes = [ 'projects', 'project', 'state', 'dir', 'dashboard', 'new-project', 'add-test', 'compile-contract', 'delete-test', 'run-queue', 'test-results', 'project-names', 'add-custom-step', 'delete-custom-step', 'add-town-sequencer', 'delete-town-sequencer', 'add-user-file', 'delete-user-file', 'custom-step-compiled', 'add-app-to-dashboard', 'delete-app-from-dashboard', ]

  updateTypes.forEach(ut => {
    if (ut in update) {
      console.log(`UPDATE IS TYPE ${ut}`)
    }
  })

  const newProjects = { ...get().projects }
  const p = update.project.project
  newProjects[project] = {
    ...(newProjects[project] || {}),
    ...p,
    folder: mapFilesToFolders(project, p.dir, get().projects[project]),
    state: p.state ? generateState(p) : {},
    tests: generateTests(p, newProjects[project]),
  }
  set({ projects: newProjects })

  const { toastMessages } = get()
  if (p.errors?.length) {
    const errors = p.errors.map(e => ({
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
      message: `Built '${project}'.`,
      id: toast.success(`Built '${project}'.`, { autoClose: 1500 }),
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