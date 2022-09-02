import { Project, Projects, ProjectState, ProjectUpdate } from "../types/Project"
import { ProjectMold } from "../types/ProjectMold"
import { Tests } from "../types/TestData"
import { TestGrain } from "../types/TestGrain"
import { ACTION_CENCOL_REGEX, ACTION_NOUN_LIST_REGEX, MOLD_REGEX } from "./regex"

export const generateState = (p: Project | ProjectUpdate) =>
  Object.keys(p.state).reduce((acc, id) => {
    acc[id] = { ...p.state[id], id }
    return acc
  }, {} as ProjectState)

export const generateTests = (p: Project | ProjectUpdate, oldP?: Project) =>
  Object.keys(p.tests).reduce((acc, id) => {
    acc[id] = {
      ...p.tests[id],
      id,
      selected: oldP?.tests[id]?.selected === undefined ? true : oldP?.tests[id]?.selected,
      expected: generateExpected(p.tests[id].expected),
      expected_error: p.tests[id]?.expected_error || 0
    }
    return acc
  },
  {} as Tests)

export const generateExpected = (expected: { [grainId: string]: TestGrain }) =>
  Object.keys(expected).reduce((acc, id) => {
    acc[id] = {
      ...expected[id],
      id
    }
    return acc
  }, {} as { [grainId: string]: TestGrain })

export const generateMolds = (p: Project): ProjectMold =>
  Object.keys(p.libs).reduce((acc, file) => {
    const text = p.libs[file]
    const parseRice = (mold: string) => mold.replace(/(\+\$)|(\$:)|(::.*?$)/gm, '').split('\n').slice(0, -1).map(line => line.trim())
    const parseActions = (mold: string) => mold.replace(/(\+\$)|(\$:)|(::.*?$)/gm, '').split('\n').slice(0, -1).map(line => line.trim())

    const rice = (text.match(MOLD_REGEX) || [])
      .filter(mold => !mold.match(ACTION_CENCOL_REGEX))
      .map(parseRice)
      .map(moldLines => ({ name: moldLines[0], mold: moldLines.slice(1).join('\n') }))

    const actions = (text.match(ACTION_CENCOL_REGEX) || [])
      .map(parseActions)
      .map(moldLines => ({ name: moldLines[0], mold: moldLines.join('\n') }))
      .concat(
        ...(text.match(ACTION_NOUN_LIST_REGEX) || [[]])
          .map(actionList => {
            return typeof actionList !== 'string' ? actionList :
              actionList.split('\n').slice(1, -1).map(action => action.trim())
                .map((act: string) => ({ name: (act.match(/%[a-z-]*/i) || [''])[0], mold: act }))
          })
      )

    acc.rice = acc.rice.concat(rice)
    acc.actions = acc.actions.concat(actions)

    return acc
  }, { actions: [], rice: [] } as ProjectMold)

export const generateProjects = (rawProjects: Projects, existingProjects: Projects) =>
  Object.keys(rawProjects).reduce((acc, key) => {
    acc[key] = {
      ...rawProjects[key],
      title: key,
      expanded: Boolean(existingProjects[key]?.expanded),
      state: generateState(rawProjects[key]),
      tests: generateTests(rawProjects[key], existingProjects[key]),
      modifiedFiles: new Set<string>(),
      molds: generateMolds(rawProjects[key])
    }
    return acc
  }, {} as Projects)
