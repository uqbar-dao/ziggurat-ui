import { Location } from "./Location"

export interface Item {
  salt: number
  holder: string
  id: string
  source: string
  label: string
  cont?: null | string
  town: string
  'is-data': boolean
  location: Location
  noun?: {
    [itemType: string]: string
  }
  interface: {
    [action: string]: any
  }
  types: {
    [type: string]: any
  }
//     "take": [
//         {
//             "to": "ux"
//         },
//         {
//             "item-id": "ux"
//         }
//     ],
//     "mint": [
//         {
//             "token": "ux"
//         },
//         {
//             "mints": [
//                 "list",
//                 [
//                     {
//                         "to": "ux"
//                     },
//                     {
//                         "uri": "t"
//                     },
//                     {
//                         "properties": [
//                             "map",
//                             "tas",
//                             "t"
//                         ]
//                     },
//                     {
//                         "transferrable": "?"
//                     }
//                 ]
//             ]
//         }
//     ],
//     "set-allowance": [
//         {
//             "items": [
//                 {
//                     "who": "ux"
//                 },
//                 {
//                     "item": "ux"
//                 },
//                 {
//                     "allowed": "?"
//                 }
//             ]
//         }
//     ],
//     "deploy": [
//         {
//             "name": "t"
//         },
//         {
//             "symbol": "t"
//         },
//         {
//             "salt": "ux"
//         },
//         {
//             "properties": [
//                 "set",
//                 "tas"
//             ]
//         },
//         {
//             "cap": [
//                 "unit",
//                 "ud"
//             ]
//         },
//         {
//             "minters": [
//                 "set",
//                 "ux"
//             ]
//         },
//         {
//             "initial-distribution": [
//                 "list",
//                 [
//                     {
//                         "to": "ux"
//                     },
//                     {
//                         "uri": "t"
//                     },
//                     {
//                         "properties": [
//                             "map",
//                             "tas",
//                             "t"
//                         ]
//                     },
//                     {
//                         "transferrable": "?"
//                     }
//                 ]
//             ]
//         }
//     ],
//     "give": [
//         {
//             "to": "ux"
//         },
//         {
//             "item-id": "ux"
//         }
//     ]
// },
// "types": {
//     "metadata": [
//         {
//             "name": "t"
//         },
//         {
//             "symbol": "t"
//         },
//         {
//             "properties": [
//                 "set",
//                 "ud"
//             ]
//         },
//         {
//             "supply": "ud"
//         },
//         {
//             "cap": [
//                 "unit",
//                 "ud"
//             ]
//         },
//         {
//             "mintable": "?"
//         },
//         {
//             "minters": [
//                 "set",
//                 "ux"
//             ]
//         },
//         {
//             "deployer": "ux"
//         },
//         {
//             "salt": "ux"
//         }
//     ],
//     "nft-contents": [
//         {
//             "uri": "t"
//         },
//         {
//             "properties": [
//                 "map",
//                 "tas",
//                 "t"
//             ]
//         },
//         {
//             "transferrable": "?"
//         }
//     ],
//     "nft": [
//         {
//             "id": "ud"
//         },
//         {
//             "uri": "t"
//         },
//         {
//             "metadata": "ux"
//         },
//         {
//             "allowances": [
//                 "set",
//                 "ux"
//             ]
//         },
//         {
//             "properties": [
//                 "map",
//                 "tas",
//                 "t"
//             ]
//         },
//         {
//             "transferrable": "?"
//         }
//     ]
// },
}
