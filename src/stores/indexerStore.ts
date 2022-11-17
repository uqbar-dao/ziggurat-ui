import { SubscriptionRequestInterface } from "@urbit/http-api"
import create from "zustand"
import api from "../api"
import { handleLatestBatch } from "./subscriptions/explorer"
import { DEFAULT_TOWN_ID, INDEXER_STORAGE_VERSION, mockData } from "../utils/constants"
import { mockAccounts, mockMetadata } from "../mocks/indexer-mocks"
import { HardwareWallet, HardwareWalletType, HotWallet, processAccount, RawAccount } from "../types/wallet/Accounts"
import { TokenMetadataStore } from "../types/wallet/TokenMetadata"
import { persist } from "zustand/middleware"
import { handleMetadataUpdate } from "./subscriptions/explorer"
import { Transaction } from "../types/indexer/Transaction"
import { Batch, Batches } from "../types/indexer/Batch"

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

export interface IndexerStore {
  loadingText: string | null
  nextBlockTime: number | null
  batches: Batch[]
  transactions: Transaction[]
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

const our: string = (window as any)?.api?.ship || ''

const useIndexerStore = create<IndexerStore>(
  persist<IndexerStore>((set, get) => ({
    loadingText: 'Loading...',
    nextBlockTime: null,
    batches: [],
    transactions: [],
    accounts: [],
    importedAccounts: [],
    metadata: {},
    init: async () => {
      // Subscriptions, includes getting assets
      // if (mockData) {
      //   return set({ loadingText: null, batches: [], transactions: mockTransactions.map(t => ({ ...t, hash: '' })) })
      // }

      try {
        api.subscribe(createSubscription('wallet', '/metadata-updates', handleMetadataUpdate(get, set)))
        api.subscribe(createSubscription('indexer', `/batch-order/${DEFAULT_TOWN_ID}`, handleLatestBatch(get, set)))

        get().getAccounts()
        // const result = await get().scry<{ 'batch-order': string[] }>(`/batch-order/${DEFAULT_TOWN_ID}/0/5`)
        // const batchOrder = (result && result['batch-order']) || []
        // const batches = (await Promise.all(
        //   batchOrder.map(async (batchId) => ({ id: batchId, result: await get().scry<Batches>(`/batch/${batchId}`) }))
        // )).map(({ id, result }) => {
        //   if (result?.batch) {
        //     return ({ id, ...Object.values(result?.batch)[0] })
        //   }
        //   return null
        // }).filter(b => b)
        // console.log('BATCHES:', batches)

        // const transactions = batches.reduce((acc: Transaction[], cur: Batch) => acc.concat(cur.batch.transactions), [])
        // console.log('TRANSACTIONS:', transactions)

        // set({ batches, transactions })
        // TODO: set the transactions
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
    //   const batches = await api.scry({app: "indexer", path: `/headers/${numHeaders}`})
    //   console.log('BLOCK HEADERS:', batches)
    // },
    // getChunkInfo: async (epoch: number, block: number, town: number) => {
    //   const chunks = await api.scry({app: "indexer", path: `/chunk-num/${epoch}/${block}/${town}`})
    //   console.log('CHUNKS:', chunks)
    // },
    // getTransactionInfo: async (transaction: string) => {
    //   await api.scry({app: "indexer", path: `/txn/${transaction}`})
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
    }
  }),
  {
    name: our+'-indexerStore',
    version: INDEXER_STORAGE_VERSION,
    getStorage: () => sessionStorage, 
  })
)

export default useIndexerStore
