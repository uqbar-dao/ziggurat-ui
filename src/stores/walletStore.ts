import create from "zustand"
import { persist } from "zustand/middleware"
import api from "../api"
import { HotWallet, processAccount, RawAccount, HardwareWallet, HardwareWalletType, Seed } from "../types/wallet/Accounts"
import { SendNftPayload, SendCustomTransactionPayload, SendTokenPayload } from "../types/wallet/SendTransaction"
import { handleBookUpdate, handleTxnUpdate, handleMetadataUpdate } from "./subscriptions/wallet"
import { Transactions, Transaction } from "../types/wallet/Transaction"
import { TokenMetadataStore } from "../types/wallet/TokenMetadata"
import { deriveLedgerAddress, getLedgerAddress } from "../utils/ledger"
import { deriveTrezorAddress, getTrezorAddress } from "../utils/trezor"
import { addHexDots } from "../utils/format"
import { mockData, PUBLIC_URL, WALLET_STORAGE_VERSION } from "../utils/constants"
import { mockAccounts, mockAssets, mockMetadata, mockTransactions } from "../mocks/wallet-mocks"
import { createSubscription } from "./subscriptions/createSubscription"
import { Assets } from "../types/wallet/Assets"
import { generateSendTokenPayload } from "./util"

const pokeWithAlert = async (json: any) => {
  try {
    await api.poke({ app: 'wallet', mark: 'zig-wallet-poke', json })
  } catch (error) {
    alert(`Error with transaction: ${String(error)}`)
  }
}

export interface WalletStore {
  loadingText: string | null,
  accounts: HotWallet[],
  importedAccounts: HardwareWallet[],
  metadata: TokenMetadataStore,
  assets: Assets,
  selectedTown: number,
  transactions: Transaction[],
  unsignedTransactions: Transactions,
  pathname: string,
  mostRecentTransaction?: Transaction,
  init: () => Promise<void>,
  setLoading: (loadingText: string | null) => void,
  getAccounts: () => Promise<void>,
  getTransactions: () => Promise<void>,
  createAccount: (password: string, nick: string) => Promise<void>,
  deriveNewAddress: (hdpath: string, nick: string, type?: HardwareWalletType) => Promise<void>,
  trackAddress: (address: string, nick: string) => Promise<void>,
  editNickname: (address: string, nick: string) => Promise<void>,
  restoreAccount: (mnemonic: string, password: string, nick: string) => Promise<void>,
  importAccount: (type: HardwareWalletType, nick: string) => Promise<void>,
  deleteAccount: (address: string) => Promise<void>,
  getSeed: () => Promise<Seed>,
  setNode: (town: number, ship: string) => Promise<void>,
  setIndexer: (ship: string) => Promise<void>,
  sendTokens: (payload: SendTokenPayload) => Promise<void>,
  sendNft: (payload: SendNftPayload) => Promise<void>,
  sendCustomTransaction: (payload: SendCustomTransactionPayload) => Promise<void>,
  getPendingHash: () => Promise<{ hash: string; egg: any; }>
  deleteUnsignedTransaction: (address: string, hash: string) => Promise<void>
  getUnsignedTransactions: () => Promise<{ [hash: string]: Transaction }>
  submitSignedHash: (from: string, hash: string, rate: number, bud: number, ethHash?: string, sig?: { v: number; r: string; s: string; }) => Promise<void>
  setPathname: (pathname: string) => void
  setMostRecentTransaction: (mostRecentTransaction?: Transaction) => void
}

const useWalletStore = create<WalletStore>(
  persist<WalletStore>((set, get) => ({
    loadingText: 'Loading...',
    accounts: [],
    importedAccounts: [],
    metadata: {},
    assets: {},
    selectedTown: 0,
    transactions: [],
    unsignedTransactions: {},
    pathname: '/',
    init: async () => {
      const { accounts, getAccounts, getTransactions, getUnsignedTransactions } = get()
      set({ loadingText: accounts.length ? null : 'Loading...' })

      try {
        if (mockData) {
          set({ assets: mockAssets as Assets, metadata: mockMetadata })
        } else {
          api.subscribe(createSubscription('wallet', '/book-updates', handleBookUpdate(get, set))) // get asset list
          api.subscribe(createSubscription('wallet', '/metadata-updates', handleMetadataUpdate(get, set)))
          api.subscribe(createSubscription('wallet', '/tx-updates', handleTxnUpdate(get, set)))
        }
    
        // only wait for accounts before removing the loading text
        await getAccounts()
        getTransactions()
        getUnsignedTransactions()
        
      } catch (error) {
        console.warn('INIT ERROR:', error)
      }

      set({ loadingText: null, pathname: window.location.pathname.slice(PUBLIC_URL.length) || '/' })
    },
    setLoading: (loadingText: string | null) => set({ loadingText }),
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
    getTransactions: async () => {
      if (mockData) {
        return set({ transactions: mockTransactions })
      }
      const { accounts, importedAccounts } = get()
      if (accounts.length) {
        const rawTransactions = await Promise.all(
          accounts
            .map(({ rawAddress }) => rawAddress)
            .concat(importedAccounts.map(({ rawAddress }) => rawAddress))
            .map(address => api.scry<Transactions>({ app: 'wallet', path: `/transactions/${address}` }))
        )
        const allRawTransactions = rawTransactions.reduce((acc: Transactions, cur: Transactions) => ({ ...acc, ...cur }))
        const transactions = Object.keys(allRawTransactions).map(hash => ({ ...allRawTransactions[hash], hash })).sort((a, b) => a.nonce - b.nonce)
        set({ transactions })
      }
    },
    createAccount: async (password: string, nick: string) => {
      await api.poke({ app: 'wallet', mark: 'zig-wallet-poke', json: { 'generate-hot-wallet': { password, nick } } })
      get().getAccounts()
    },
    deriveNewAddress: async (hdpath: string, nick: string, type?: HardwareWalletType) => {
      set({ loadingText: 'Deriving address, this could take up to 60 seconds...' })
      try {
        if (type) {
          let deriveAddress: ((path: string) => Promise<string>) | undefined
          if (type === 'ledger') {
            deriveAddress = deriveLedgerAddress
          }
          else if (type === 'trezor') {
            deriveAddress = deriveTrezorAddress
          }
    
          if (deriveAddress !== undefined) {
            const importedAddress = await deriveAddress(hdpath)
            if (importedAddress) {
              const { importedAccounts } = get()
              if (!importedAccounts.find(({ address }) => importedAddress === address)) {
                await api.poke({
                  app: 'wallet',
                  mark: 'zig-wallet-poke',
                  json: {
                    'add-tracked-address': { address: addHexDots(importedAddress), nick: `${nick}//${type}` }
                  }
                })
              } else {
                alert('You have already imported this address.')
              }
            }
          }
        } else {
          await api.poke({ app: 'wallet', mark: 'zig-wallet-poke', json: { 'derive-new-address': { hdpath, nick } } })
        }
        get().getAccounts()
      } catch (error) {
        console.warn('ERROR DERIVING ADDRESS:', error)
        window.alert('There was an error deriving the address, please check the HD path and try again.')
      }
      set({ loadingText: null })
    },
    trackAddress: async (address: string, nick: string) => {
      await api.poke({ app: 'wallet', mark: 'zig-wallet-poke', json: { 'add-tracked-address': { address, nick } } })
      get().getAccounts()
    },
    editNickname: async (address: string, nick: string) => {
      await api.poke({ app: 'wallet', mark: 'zig-wallet-poke', json: { 'edit-nickname': { address, nick } } })
      get().getAccounts()
    },
    restoreAccount: async (mnemonic: string, password: string, nick: string) => {
      await api.poke({ app: 'wallet', mark: 'zig-wallet-poke', json: { 'import-seed': { mnemonic, password, nick } } })
      get().getAccounts()
    },
    importAccount: async (type: HardwareWalletType, nick: string) => {
      set({ loadingText: 'Importing...' })

      let importedAddress: string | undefined = ''

      if (type === 'ledger'){

        importedAddress = await getLedgerAddress()
      } else if (type === 'trezor') {
        importedAddress = await getTrezorAddress()
      }

      if (importedAddress) {
        // TODO: get nonce info
        const { importedAccounts } = get()

        if (!importedAccounts.find(({ address }) => importedAddress === address)) {
          await api.poke({
            app: 'wallet',
            mark: 'zig-wallet-poke',
            json: {
              'add-tracked-address': { address: addHexDots(importedAddress), nick: `${nick}//${type}` }
            }
          })
          get().getAccounts()
        } else {
          set({ loadingText: null })
          alert('You have already imported this address.')
        }
      }
      set({ loadingText: null })
    },
    deleteAccount: async (address: string) => {
      if (window.confirm(`Are you sure you want to remove this address?\n\n${addHexDots(address)}`)) {
        await api.poke({ app: 'wallet', mark: 'zig-wallet-poke', json: { 'delete-address': { address } } })
        get().getAccounts()
      }
    },
    getSeed: async () => {
      const seedData = await api.scry<Seed>({ app: 'wallet', path: '/seed' })
      return seedData
    },
    setNode: async (town: number, ship: string) => {
      const json = { 'set-node': { town, ship } }
      await api.poke({ app: 'wallet', mark: 'zig-wallet-poke', json  })
      set({ selectedTown: town })
    },
    setIndexer: async (ship: string) => {
      const json = { 'set-indexer': { ship } }
      await api.poke({ app: 'wallet', mark: 'zig-wallet-poke', json })
    },
    sendTokens: async (payload: SendTokenPayload) => {
      const json = generateSendTokenPayload(payload)
      await pokeWithAlert(json)
    },
    sendNft: async (payload: SendNftPayload) => {
      const json = generateSendTokenPayload(payload)
      await pokeWithAlert(json)
    },
    sendCustomTransaction: async ({ from, contract, town, action }: SendCustomTransactionPayload) => {
      const json = { 'transaction': { from, contract, town, action: { text: action } } }
      await pokeWithAlert(json)
    },
    getPendingHash: async () => {
      const { hash, egg } = await api.scry<{ hash: string; egg: any }>({ app: 'wallet', path: '/pending' }) || {}
      return { hash, egg }
    },
    deleteUnsignedTransaction: async (address: string, hash: string) => {
      const json = { 'delete-pending': { from: address, hash } }
      await api.poke({ app: 'wallet', mark: 'zig-wallet-poke', json })
      get().getUnsignedTransactions()
    },
    getUnsignedTransactions: async () => {
      const { accounts, importedAccounts } = get()
      const unsigned = await Promise.all(
        accounts
          .map(({ rawAddress }) => rawAddress)
          .concat(importedAccounts.map(({ rawAddress }) => rawAddress))
          .map(address => api.scry<Transactions>({ app: 'wallet', path: `/pending/${address}` }))
      )
      const unsignedMap = unsigned.reduce((acc: Transactions, cur: Transactions) => ({ ...acc, ...cur }))
      const unsignedTransactions = Object.keys(unsignedMap).reduce((acc, hash) => {
        acc[hash] = { ...unsignedMap[hash], hash }
        return acc
      }, {} as Transactions)

      set({ unsignedTransactions })
      return unsignedTransactions
    },
    submitSignedHash: async (from: string, hash: string, rate: number, bud: number, ethHash?: string, sig?: { v: number; r: string; s: string; }) => {
      const json = ethHash && sig ?
        { 'submit-signed': { from, hash, gas: { rate, bud }, ethHash, sig } } :
        { 'submit': { from, hash, gas: { rate, bud } } }
      await api.poke({ app: 'wallet', mark: 'zig-wallet-poke', json })
      get().getUnsignedTransactions()
    },
    setPathname: (pathname: string) => set({ pathname }),
    setMostRecentTransaction: (mostRecentTransaction?: Transaction) => set({ mostRecentTransaction })
  }),
  {
    name: 'contractStore',
    version: WALLET_STORAGE_VERSION,
  })
)

export default useWalletStore
