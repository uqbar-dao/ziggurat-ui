import { RawMetadata } from "../types/Metadata";
import { TestGrain } from "../types/TestGrain";
import { genRanNum, numToUd } from "./number";

export const BLANK_METADATA = { name: '', symbol: '', salt: '', decimals: '', supply: '', cap: '', mintable: '', minters: '', deployer: '' }

export const generateInitialMetadata = (minters: string, deployer: string) => ({
  ...BLANK_METADATA,
  salt: genRanNum(10),
  decimals: '18',
  supply: '1000000',
  mintable: 't',
  minters,
  deployer,
})

export const DEFAULT_TOWN_ID = '0x0'

export const genFungibleMetadata = (id: string, { name, symbol, decimals, supply, cap, mintable, minters, deployer, salt }: RawMetadata) : TestGrain => {
  return {
    id,
    lord: id, // should be coming from the contract, when compiled
    holder: id, // should be the same as the lord
    town_id: DEFAULT_TOWN_ID,
    label: "token-metadata",
    salt,
    data: `["${name}" "${symbol}" ${numToUd(decimals)} ${numToUd(supply)} ${!cap || cap === '~' ? '~' : numToUd(cap)} ${mintable === 't' ? '&' : '|'} ${minters || '~'} ${deployer} ${numToUd(salt)}]`,
    data_text: `["${name}" "${symbol}" ${numToUd(decimals)} ${numToUd(supply)} ${!cap || cap === '~' ? '~' : numToUd(cap)} ${mintable === 't' ? '&' : '|'} ${minters || '~'} ${deployer} ${numToUd(salt)}]`
    // data: {
    //   name: { type: '@t', value: name },
    //   symbol: { type: '@t', value: symbol },
    //   decimals: { type: '@ud', value: decimals },
    //   supply: { type: '@ud', value: supply },
    //   cap: { type: 'none', value: cap },
    //   mintable: { type: '?', value: mintable ? '&' : '|' },
    //   minters: { type: 'none', value: minters.split(',').map(m => m.trim()).join(',') },
    //   deployer: { type: '@ux', value: deployer },
    //   salt: { type: '@', value: salt }
    // }
  }
}
