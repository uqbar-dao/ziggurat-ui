import { SendNftPayload, SendTokenPayload } from "../../types/wallet/SendTransaction";

export const generateSendTokenPayload = (payload: SendTokenPayload | SendNftPayload) => {
  const { from, to, town, destination, rate, bud, grain } = payload

  const json = {
    submit: {
      from,
      to,
      town,
      gas: {
        rate: rate,
        bud: bud,
      },
      args: {}
    }
  }

  if ('amount' in payload) {
    json.submit.args = {
      give: {
        to: destination,
        amount: payload.amount,
        grain,
      },
    }
  } else {
    json.submit.args = {
      'give-nft': {
        to: destination,
        grain,
      }
    }
  }

  return json
}
