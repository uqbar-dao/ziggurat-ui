import { genRanNum } from "./number";

export const BLANK_METADATA = { name: '', symbol: '', salt: '', decimals: '', supply: '', cap: '', mintable: '', minters: '', deployer: '' }

export const generateInitialMetadata = (minters: string[], deployer: string, type: 'fungible' | 'nft' | 'blank') => ({
  ...BLANK_METADATA,
  salt: genRanNum(6),
  decimals: type === 'fungible' ? '18' : undefined,
  properties: type === 'nft' ? [] : undefined,
  supply: '1000000',
  mintable: 't',
  minters,
  deployer,
})
