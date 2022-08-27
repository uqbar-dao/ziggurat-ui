import { DEV_MOLDS } from "../types/Molds"
import { Project } from "../types/Project"
import { TestGrain } from "../types/TestGrain"

const parseTestData = (title: string, rawTestData: { [key: string]: string }[]) => {
  try {
    const rawData = rawTestData.find(td => Object.keys(td)[0] === title)
    if (rawData) {
      return JSON.parse(Object.values(rawData)[0][0])
    }
  } catch (e) {}
  
  return { "tests": [], "grains": [] }
}

export const parseRawProject = (rawProject: any, projects: Project[], rawTestData: { [key: string]: string }[]): Project => {
  const title = Object.keys(rawProject)[0]
  const files = rawProject[title]
  
  // const storedProject = projects.find((p) => p.title === title)
  const text = files.reduce((acc:  { [key: string]: string }, cur: any) => {
      acc[`contract_${cur.scroll.path.split('/').slice(0, -1).join('')}`] = cur.scroll.text
      return acc
    }, {})

  return {
    title,
    text,
    molds: DEV_MOLDS, // TODO: figure out how to do molds
    testData: parseTestData(title, rawTestData)
  }
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
