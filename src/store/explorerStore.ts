import { SubscriptionRequestInterface } from "@urbit/http-api"
import create from "zustand"
import api from "../api"
import { handleLatestBlock } from "./subscriptions/explorer"
import { BlockHeader, RawBlockHeader } from '../types/indexer/BlockHeader'
import { processRawData } from '../utils/object'
import { addDecimalDots } from '../utils/number'
import { HashTransaction } from '../types/indexer/Transaction'
import { Block, RawBlock } from '../types/indexer/Block'
import { mockData } from "../utils/constants"
import { mockAccounts, mockBlockHeaders, mockTransactions, mockMetadata } from "../mocks/indexer-mocks"
import { HardwareWallet, HardwareWalletType, HotWallet, processAccount, RawAccount } from "../types/wallet/Accounts"
import { TokenMetadataStore } from "../types/indexer/TokenMetadata"

export function createSubscription(app: string, path: string, e: (data: any) => void): SubscriptionRequestInterface {
  const request = {
    app,
    path,
    event: e,
    err: () => console.warn('SUBSCRIPTION ERROR'),
    quit: () => {
      throw new Error('subscription clogged')
    }
  }
  // TODO: err, quit handling (resubscribe?)
  return request
}

export interface ExplorerStore {
  loadingText: string | null
  nextBlockTime: number | null
  blockHeaders: BlockHeader[]
  transactions: HashTransaction[]
  accounts: HotWallet[]
  importedAccounts: HardwareWallet[]
  metadata: TokenMetadataStore
  init: () => Promise<void>
  scry: <T>(path: string) => Promise<T | undefined>
  setLoading: (loadingText: string | null) => void
  // getBlockHeaders: (numHeaders: number) => Promise<void>
  // getChunkInfo: (epoch: number, block: number, town: number) => Promise<void>
  // getTransactionInfo: (transaction: string) => Promise<void>
  // getAddressInfo: (address: string) => Promise<void>
  getAccounts: () => Promise<void>
  getMetadata: () => Promise<void>,
}

const useExplorerStore = create<ExplorerStore>((set, get) => ({
  loadingText: 'Loading...',
  nextBlockTime: null,
  blockHeaders: [],
  transactions: [],
  accounts: [],
  importedAccounts: [],
  metadata: {},
  init: async () => {
    // Subscriptions, includes getting assets
    if (mockData) {
      return set({ loadingText: null, blockHeaders: mockBlockHeaders, transactions: mockTransactions.map(t => ({ ...t, hash: '' })) })
    }
    
    try {
      get().getAccounts()
      get().getMetadata()
      const result = await get().scry<{ headers: RawBlockHeader[] }>('/headers/5')
      if (result?.headers) {
        const blockHeaders = result.headers.map(processRawData)
        set({ blockHeaders })
    
        api.subscribe(createSubscription('indexer', '/slot', handleLatestBlock(get, set)))
    
        const rawBlocks = (await Promise.all(blockHeaders.map((bh: BlockHeader) => 
          get().scry<RawBlock>(`/chunk-num/${addDecimalDots(bh.epochNum.toString())}/${bh.blockHeader.num}/${0}`)
        )))

        const blocks: Block[] = rawBlocks.map(processRawData)
        const transactions = blocks
          .reduce((acc: HashTransaction[], cur) => acc.concat(cur.chunk.transactions), [])
          .slice(0, 10)
          .filter(Boolean)
  
        set({ transactions })
      }
    } catch (err) {
      console.warn(err)
    }

    set({ loadingText: null })
  },
  scry: async <T>(path: string): Promise<T | undefined> => {
    try {
      const result = await api.scry<T>({ app: 'indexer', path })
      return result
    } catch (err: any) {
      console.warn('SCRY ERROR:', err.toString())
      if (err.toString().includes('Unexpected token < in JSON at position 0')) {
        return undefined
      }
      throw new Error(err)
    }
  },
  setLoading: (loadingText: string | null) => set({ loadingText }),
  // getBlockHeaders: async (numHeaders: number) => {
  //   const blockHeaders = await api.scry({app: "indexer", path: `/headers/${numHeaders}`})
  //   console.log('BLOCK HEADERS:', blockHeaders)
  // },
  // getChunkInfo: async (epoch: number, block: number, town: number) => {
  //   const chunks = await api.scry({app: "indexer", path: `/chunk-num/${epoch}/${block}/${town}`})
  //   console.log('CHUNKS:', chunks)
  // },
  // getTransactionInfo: async (transaction: string) => {
  //   await api.scry({app: "indexer", path: `/egg/${transaction}`})
  // },
  // getAddressInfo: async (address: string) => {
  //   await api.scry({app: "indexer", path: `/from/${address}`})
  // },
  getAccounts: async () => {
    if (mockData) {
      return set({ accounts: mockAccounts, importedAccounts: [], loadingText: null })
    }

    const accountData = await api.scry<{[key: string]: RawAccount}>({ app: 'wallet', path: '/accounts' }) || {}
    const allAccounts = Object.values(accountData).map(processAccount).sort((a, b) => a.nick.localeCompare(b.nick))

    const { accounts, importedAccounts } = allAccounts.reduce(({ accounts, importedAccounts }, cur) => {
      if (cur.imported) {
        const [nick, type] = cur.nick.split('//')
        importedAccounts.push({ ...cur, type: type as HardwareWalletType, nick })
      } else {
        accounts.push(cur)
      }
      return { accounts, importedAccounts }
    }, { accounts: [] as HotWallet[], importedAccounts: [] as HardwareWallet[] })

    set({ accounts, importedAccounts, loadingText: null })
  },
  getMetadata: async () => {
    if (mockData) {
      return set({ metadata: mockMetadata })
    }
    const rawMetadata = await api.scry<any>({ app: 'wallet', path: '/token-metadata' })
    const metadata = Object.keys(rawMetadata).reduce((acc: { [key: number]: any }, cur) => {
      const newKey = Number(cur.toString().replace(/\./g, ''))
      acc[newKey] = rawMetadata[cur]
      return acc
    }, {})
    set({ metadata })
  },
}))

export default useExplorerStore
