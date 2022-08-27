// import { TestAction } from "./TestExpectation"
// import { TestRice } from "./TestGrain"

export const DEV_MOLDS = {
  "actions": {
    "take": {
      "to": "%id",
      "amount": "@ud",
      "from-account": "%grain",
      "to-account": ["%unit", "%grain"]
    },
    "set-allowance": {
      "who": "%id",
      "amount": "@ud",
      "account": "%grain"
    },
    "give": {
      "budget": "@ud",
      "to": "%id",
      "amount": "@ud",
      "from-account": "%grain",
      "to-account": ["%unit", "%grain"]
    }
  },
  "rice": {
    "token-metadata": {
      "name": "@t",
      "salt": "@",
      "decimals": "@ud",
      "deployer": "%id",
      "cap": [
        "%unit",
        "@ud"
      ],
      "minters": [
        "%set",
        "%id"
      ],
      "symbol": "@t",
      "supply": "@ud",
      "mintable": "?"
    },
    "account": {
      "balance": "@ud",
      "metadata-id": "@ux",
      "salt": "@",
      "allowances": [
        "%map",
        {
          "[sender, %id]": "@ud"
        }
      ]
    }
  }
}

// export interface Molds {
//   actions: {
//     [key: string]: TestAction
//   }
//   rice: {
//     [key: string]: TestRice
//   }
// }
