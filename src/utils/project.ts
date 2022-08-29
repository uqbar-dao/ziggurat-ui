import { DEV_MOLDS } from "../types/Molds"
import { Project, Projects, ProjectState, ProjectUpdate } from "../types/Project"
import { Tests } from "../types/TestData"
import { TestGrain } from "../types/TestGrain"

export const generateState = (p: Project | ProjectUpdate): ProjectState =>
  Object.keys(p.state).reduce((acc, id) => {
    acc[id] = { ...p.state[id], id }
    return acc
  }, {} as ProjectState)

export const generateTests = (p: Project | ProjectUpdate): Tests =>
  Object.keys(p.tests).reduce((acc, id) => {
    acc[id] = { ...p.tests[id], id }
    return acc
  }, {} as Tests)

export const generateProjects = (rawProjects: Projects, existingProjects: Projects) =>
  Object.keys(rawProjects).reduce((acc, key) => {
    acc[key] = {
      ...rawProjects[key],
      title: key,
      expanded: Boolean(existingProjects[key]?.expanded),
      state: generateState(rawProjects[key]),
      tests: generateTests(rawProjects[key])
    }
    return acc
  }, {} as Projects)

const parseTestData = (title: string, rawTestData: { [key: string]: string }[]) => {
  try {
    const rawData = rawTestData.find(td => Object.keys(td)[0] === title)
    if (rawData) {
      return JSON.parse(Object.values(rawData)[0][0])
    }
  } catch (e) {}
  
  return { "tests": [], "grains": [] }
}

export const parseRawGrains = (rawGrains: any[]): TestGrain[] => {
  return rawGrains
    .filter((g: any) => (g[1] as any)?.q?.['.y'])
    .map((g: any) => (g[1] as any)?.q?.['.y'])
    .map((g: any) => {
      const newGrain = { ...g, data: g.data.flat(Infinity).map((d: any) => Object.keys(d)[0]).join('') }
      try {
        return { ...g, data: JSON.parse(newGrain.data) }
      } catch (e) {
        return newGrain
      }
    })
}

// export const generateGrainValues = (grain: TestGrain) => ({
//   ...grain,
//   data: `[${Object.values(grain.data)
//     .map(({ type, value }) => {
//       if (!value) {
//         return '~'
//       } else if (type === '@t') {
//         return `"${value}"`
//       }

//       return value
//     })
//     .concat(grain.label === 'token-metadata' ? [grain.salt.toString()] : [])
//     .join(' ')}]`
// })
