import { SendNftPayload, SendTokenPayload } from "../types/wallet/SendTransaction";

export const generateSendTokenPayload = (payload: SendTokenPayload | SendNftPayload) => {
  const { from, contract, town, grain, to } = payload

  const json = {
    transaction: {
      from,
      contract,
      town,
      action: {}
    }
  }

  if ('amount' in payload) {
    json.transaction.action = {
      give: {
        to,
        amount: payload.amount,
        grain,
      },
    }
  } else {
    json.transaction.action = {
      'give-nft': {
        to,
        grain,
      }
    }
  }

  return json
}

export const promiseWaterfall = (callbacks: Promise<void>[], initialArgs?: any[]): Promise<any> => {
  return callbacks.reduce((accumulator: any, callback: any) => {
    return accumulator.then(callback)
  }, Promise.resolve(initialArgs))
}