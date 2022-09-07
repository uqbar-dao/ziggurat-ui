export const PUBLIC_URL = '/apps/ziggurat'
export const ZIGS_ACCOUNT_ID = '0x7606.5857.3281.e401.e302.1994.b290.0c32.a17b.cc89.c5d9.d78a.4b5e.4938.ee05.af06'
export const MY_CONTRACT_ID = '0xfafa.fafa'
export const METADATA_GRAIN_ID = '0xdada.dada'
export const DUMMY_METADATA = {
  id: METADATA_GRAIN_ID,
  holder: MY_CONTRACT_ID,
  lord: MY_CONTRACT_ID,
  town_id: '0x0',
  label: 'token-metadata',
  salt: '3859435834985',
  data: `['ZOG' 'ZIG' 18 1.000.000 ~ | ~ 0x0 385.9435.834.985]`
}

export const DEFAULT_TOWN_ID = '0x0'
export const DEFAULT_USER_ADDRESS = '0xdead.beef'
export const DEFAULT_RATE = 1
export const DEFAULT_BUDGET = 1000000 // 1 million

export const ZIGGURAT_STORAGE_VERSION = 1
export const INDEXER_STORAGE_VERSION = 1
export const WALLET_STORAGE_VERSION = 1

export const ORIGIN = window.location.origin
export const BASENAME = '/apps/ziggurat'

export const STATUS_CODES : { [key: number] : string } = {
  0: 'confirmed',
  1: 'no account info',
  2: 'bad signature',
  3: 'incorrect nonce',
  4: 'insufficient budget',
  5: 'contract not found',
  6: 'crash in contract execution',
  7: 'rice validation failed',
  100: 'submitted',
  101: 'pending',
  103: 'rejected',
  105: 'sent-to-us',
}

export const getStatus = (status: number) => STATUS_CODES[status] || 'unknown'

export const mockData = process.env.NODE_ENV === 'development' && Boolean(process.env.REACT_APP_MOCK_DATA)

export const ONE_SECOND = 1000
export const THIRTY_SECONDS = 30 * ONE_SECOND
