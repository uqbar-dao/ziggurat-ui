import { GallApp, GallApps } from "../types/ziggurat/GallApp"
import { Contract, Contracts, ContractState, ContractUpdate } from "../types/ziggurat/Contracts"
import { ContractMold } from "../types/ziggurat/ContractMold"
import { Tests } from "../types/ziggurat/TestData"
import { TestGrain } from "../types/ziggurat/TestGrain"
import { mapFilesToFolders } from "./gall"
import { ACTION_CENCOL_REGEX, ACTION_NOUN_LIST_REGEX, MOLD_REGEX } from "./regex"

export const generateState = (p: Contract | ContractUpdate) =>
  Object.keys(p.state).reduce((acc, id) => {
    acc[id] = { ...p.state[id], id }
    return acc
  }, {} as ContractState)

export const generateTests = (p: Contract | ContractUpdate, oldP?: Contract) =>
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

export const generateMolds = (p: Contract): ContractMold =>
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
  }, { actions: [], rice: [] } as ContractMold)

export const generateProjects = (rawContracts: { [key: string]: Contract | GallApp }, existingContracts: Contracts, existingApps: GallApps) =>
  Object.keys(rawContracts).reduce((acc, key) => {
    if ('libs' in rawContracts[key]) {
      acc.contracts[key] = {
        ...(rawContracts[key] as Contract),
        title: key,
        expanded: Boolean((existingContracts[key] as Contract)?.expanded),
        state: generateState(rawContracts[key] as Contract),
        tests: generateTests(rawContracts[key] as Contract, existingContracts[key] as Contract),
        modifiedFiles: new Set<string>(),
        molds: generateMolds(rawContracts[key] as Contract),
      }
    } else if ('dir' in rawContracts[key]) {
      acc.gallApps[key] = {
        ...(rawContracts[key] as GallApp),
        title: key,
        folder: mapFilesToFolders(key, (rawContracts[key] as GallApp).dir, existingApps[key] as GallApp),
        expanded: Boolean((existingApps[key] as GallApp)?.expanded),
        modifiedFiles: new Set<string>(),
      }
    }
    return acc
  }, { contracts: {}, gallApps: {} } as { contracts: Contracts, gallApps: GallApps })
