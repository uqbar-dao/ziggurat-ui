import { initialMain as mainFungible } from "../code-text/contract/fungible/main"
import { initialTypes as typesFungible } from "../code-text/contract/fungible/types"
import { initialMain as mainNft } from "../code-text/contract/nft/main"
import { initialTypes as typesNft } from "../code-text/contract/nft/types"
import { fungibleTokenTestData, genFungibleTokenTestData, RawMetadata } from "../code-text/test-data/fungible"
import { DEV_MOLDS } from "../types/Molds"
import { TestGrain } from "../types/TestGrain"

export const EMPTY_TEST_DATA = { tests: [], grains: [] }

      // type CreationStep = 'project' | 'token' |  'template'
      // export type CreationOption = 'contract' | 'gall' | 'fungible' | 'nft' | 'issue' | 'wrapper'
export const getInitialContractText = (options: { [key: string]: string }, rawMetadata?: RawMetadata) => {
  let contract_main = '' // when options.token === 'blank'
  if (options.token === 'nft') {
    contract_main = mainNft
  } else if (options.token === 'fungible') {
    contract_main = mainFungible(rawMetadata?.name, rawMetadata?.symbol)
  }

  let contract_types = '' // when options.token === 'blank'
  if (options.token === 'nft') {
    contract_types = typesNft
  } else if (options.token === 'fungible') {
    contract_types = typesFungible(rawMetadata?.name, rawMetadata?.symbol)
  }

  return {
    contract_main,
    contract_types,
    // contract_tests: initialTests,
    // gall_app: initialApp,
    // gall_sur: initialSur,
    // gall_lib: initialLib,
  }
}

export const getInitialMolds = (options: { [key: string]: string }) => {
  if (options.token === 'nft') {
    // TODO: get molds for nft
    return DEV_MOLDS
  } else if (options.token === 'blank') {
    return {
      actions: {},
      rice: {},
    }
  }

  return DEV_MOLDS
}

export const getInitialTestData = (options: { [key: string]: string }, metadataGrain?: TestGrain, contractId?: string) => {
  if (options.token === 'blank') {
    return EMPTY_TEST_DATA
  } else if (metadataGrain && contractId) {
    return genFungibleTokenTestData(metadataGrain, contractId)
  }

  return fungibleTokenTestData
}
