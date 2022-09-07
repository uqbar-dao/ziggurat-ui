import create from "zustand"
import { persist } from "zustand/middleware"
import api from "../../api"
import { HotWallet, processAccount, RawAccount, HardwareWallet, HardwareWalletType, Seed } from "../../types/wallet/Accounts"
import { SendNftPayload, SendCustomTransactionPayload, SendTokenPayload } from "../../types/wallet/SendTransaction"
import { handleBookUpdate, handleTxnUpdate, handleMetadataUpdate } from "./subscriptions/wallet"
import { CustomTransactions, Transaction } from "../../types/wallet/Transaction"
import { TokenMetadataStore } from "../../types/wallet/TokenMetadata"
import { removeDots } from "../../utils/format"
import { deriveLedgerAddress, getLedgerAddress } from "../../utils/ledger"
import { deriveTrezorAddress, getTrezorAddress } from "../../utils/trezor"
import { addHexDots } from "../../utils/number"
import { mockData, PUBLIC_URL } from "../../utils/constants"
import { mockAccounts, mockAssets, mockMetadata, mockTransactions } from "../../mocks/wallet-mocks"
import { createSubscription } from "./createSubscription"
import { Assets } from "../../types/wallet/Assets"
import { generateSendTokenPayload } from "./util"

export interface WalletStore {
  loadingText: string | null,
  accounts: HotWallet[],
  importedAccounts: HardwareWallet[],
  metadata: TokenMetadataStore,
  assets: Assets,
  selectedTown: number,
  transactions: Transaction[],
  pathname: string,
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
  submitSignedHash: (hash: string, ethHash: string, sig: { v: number; r: string; s: string; }) => Promise<void>
  setPathname: (pathname: string) => void
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
    pathname: '/',
    init: async () => {
      set({ loadingText: 'Loading...' })

      try {
        if (mockData) {
          set({ assets: mockAssets as Assets, metadata: mockMetadata })
        } else {
          api.subscribe(createSubscription('wallet', '/book-updates', handleBookUpdate(get, set))) // get asset list
          api.subscribe(createSubscription('wallet', '/metadata-updates', handleMetadataUpdate(get, set)))
          api.subscribe(createSubscription('wallet', '/tx-updates', handleTxnUpdate(get, set)))
        }
    
        const { getAccounts, getTransactions } = get()
    
        // only wait for accounts before removing the loading text
        await getAccounts()
        getTransactions()
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
      const { accounts } = get()
      if (accounts.length) {
        const rawTransactions = await api.scry<CustomTransactions>({ app: 'wallet', path: `/transactions/${accounts[0].rawAddress}` })
        const transactions = Object.keys(rawTransactions).map(hash => ({ ...rawTransactions[hash], hash }))
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
      if (window.confirm(`Are you sure you want to remove this address?\n\n${removeDots(address)}`)) {
        await api.poke({ app: 'wallet', mark: 'zig-wallet-poke', json: { 'delete-address': { address } } })
        get().getAccounts()
      }
    },
    getSeed: async () => {
      const seedData = await api.scry<Seed>({ app: 'wallet', path: '/seed' })
      return seedData
    },
    setNode: async (town: number, ship: string) => {
      await api.poke({
        app: 'wallet',
        mark: 'zig-wallet-poke',
        json: {
          'set-node': { town, ship }
        }
      })
      set({ selectedTown: town })
    },
    setIndexer: async (ship: string) => {
      await api.poke({
        app: 'wallet',
        mark: 'zig-wallet-poke',
        json: {
          'set-indexer': { ship }
        }
      })
    },
    sendTokens: async (payload: SendTokenPayload) => {
      const json = generateSendTokenPayload(payload)
      await api.poke({ app: 'wallet', mark: 'zig-wallet-poke', json })
    },
    sendNft: async (payload: SendNftPayload) => {
      const json = generateSendTokenPayload(payload)
      await api.poke({ app: 'wallet', mark: 'zig-wallet-poke', json })
    },
    sendCustomTransaction: async ({ from, to, town, data, rate, bud }: SendCustomTransactionPayload) => {
      const json = {
        'submit-custom': {
          from,
          to,
          town,
          gas: { rate, bud },
          args: data
        }
      }

      await api.poke({ app: 'wallet', mark: 'zig-wallet-poke', json })
    },
    getPendingHash: async () => {
      const { hash, egg } = await api.scry<{ hash: string; egg: any }>({ app: 'wallet', path: '/pending' }) || {}
      console.log('PENDING:', hash, egg)
      return { hash, egg }
    },
    submitSignedHash: async (hash: string, ethHash: string, sig: { v: number; r: string; s: string; }) => {
      console.log({
        'submit-signed': { hash, ethHash, sig }
      })
      await api.poke({
        app: 'wallet',
        mark: 'zig-wallet-poke',
        json: {
          'submit-signed': { hash, 'eth-hash': addHexDots(ethHash), sig }
        }
      })
    },
    setPathname: (pathname: string) => set({ pathname }),
  }),
  {
    name: 'contractStore'
  })
)

export default useWalletStore
