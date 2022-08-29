import { TestGrain } from "../../types/TestGrain";
import { addHexDots } from "../../utils/format";
import { genRanHex, genRanNum, numToUd } from "../../utils/number";

export interface RawMetadata {
  name: string
  symbol: string
  decimals: string
  supply: string
  cap: string
  mintable: string
  minters: string
  deployer: string
  salt: string
}

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
    data: `["${name}" "${symbol}" ${numToUd(decimals)} ${numToUd(supply)} ${!cap || cap === '~' ? '~' : numToUd(cap)} ${mintable === 't' ? '&' : '|'} ${minters || '~'} ${deployer} ${numToUd(salt)}]`
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

// export const fungibleTokenTestData : TestData = {
//   tests: [
//     {
//       id: addHexDots(genRanHex(20)),
//       input: { type: 'none', value: '[%give 0xdead 1 0x1.fade `0x1.dead]' }
//     },
//     {
//       id: addHexDots(genRanHex(20)),
//       input: { type: 'none', value: '[%give 0xbeef 10 0x1.dead `0x1.fade]' }
//     },
//     {
//       id: addHexDots(genRanHex(20)),
//       input: { type: 'none', value: '[%give 0xcafe 10 0x1.fade `0x1.cafe]' }
//     },
//   ],
//   grains: [
//     {
//       id: "0x1.fade",
//       lord: "0x7367697a",
//       holder: "0xbeef",
//       'town-id': "0x0",
//       label: "account",
//       salt: 1936157050,
//       data: '[50 ~ *metadata-id* 0]'
//       // data: {
//       //   balance: { type: '@ud' as UqbarType, value:  "50" },
//       //   allowances: { type: 'none' as UqbarType, value: "~" },
//       //   'metadata-id': { type: '%id' as UqbarType, value: "0x7367697a" },
//       //   nonce: { type: '@ud', value: '0' }
//       // }
//     },
//     {
//       id: "0x1.dead",
//       lord: "0x7367697a",
//       holder: "0xdead",
//       'town-id': "0x0",
//       label: "account",
//       salt: 1936157050,
//       data: '[30 ~ *metadata-id* 0]'
//       // data: {
//       //   balance: { type: '@ud' as UqbarType, value:  "30" },
//       //   allowances: { type: 'none' as UqbarType, value: "~" },
//       //   'metadata-id': { type: '%id' as UqbarType, value: "0x7367697a" },
//       //   nonce: { type: '@ud', value: '0' }
//       // }
//     },
//     {
//       id: "0x1.cafe",
//       lord: "0x7367697a",
//       holder: "0xcafe",
//       'town-id': "0x0",
//       label: "account",
//       salt: 1936157050,
//       data: '[20 ~ *metadata-id* 0]'
//       // data: {
//       //   balance: { type: '@ud' as UqbarType, value:  "20" },
//       //   allowances: { type: 'none' as UqbarType, value: "~" },
//       //   'metadata-id': { type: '%id' as UqbarType, value: "0x7367697a" },
//       //   nonce: { type: '@ud', value: '0' }
//       // }
//     },
//     {
//       id: "0x1.face",
//       lord: "0x656c.6269.676e.7566",
//       holder: "0xface",
//       'town-id': "0x0",
//       label: "account",
//       salt: 1717987684,
//       data: '[20 ~ *metadata-id* 0]'
//       // data: {
//       //   balance: { type: '@ud' as UqbarType, value:  "20" },
//       //   allowances: { type: 'none' as UqbarType, value: "~" },
//       //   'metadata-id': { type: '%id' as UqbarType, value: "0x2174.6e65.7265.6666.6964" },
//       //   nonce: { type: '@ud', value: '0' }
//       // }
//     }
//   ]
// }

// export const genFungibleTokenTestData = (metadataGrain: TestGrain, contractId: string) => ({
//   // TODO: need the ID from genFungibleMetadata
//   ...fungibleTokenTestData,
//   grains: [
//     metadataGrain,
//     ...fungibleTokenTestData.grains
//       .map(g => ({
//         ...g,
//         lord: contractId,
//         salt: metadataGrain.salt,
//         data: g.data.replace('*metadata-id*', contractId)
//       } as TestGrain))
//   ]
// })
