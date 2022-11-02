import 'core-js/actual'
import { listen } from "@ledgerhq/logs"
import Eth from "@ledgerhq/hw-app-eth"
import TransportWebUSB from "@ledgerhq/hw-transport-webusb" // eslint-disable-line
import { addHexDots } from './format'

export const getLedgerAddress = async () => {
  try {
    const transport = await TransportWebUSB.create()
    listen(log => console.log(log))
    const appEth = new Eth(transport)
    const { address } = await appEth.getAddress("44'/60'/0'/0/0", false)
    return address
  } catch (e) {
    alert('Please make sure your Ledger is connected, unlocked, and the Ethereum app is open then try again.')
    console.warn('LEDGER CONNECTION:', e)
  }
}

// @path a path in BIP 32 format
export const deriveLedgerAddress = async (path: string) => {
  const transport = await TransportWebUSB.create()
  listen(log => console.log(log))
  const appEth = new Eth(transport)
  const { publicKey } = await appEth.eth2GetPublicKey(path)
  return publicKey
}

export const signLedgerTransaction = async (ethHash: string) => {
  try {
    const transport = await TransportWebUSB.create()
    listen(log => console.log(log))
    const appEth = new Eth(transport)

    // How to figure out path from address? Probably the main path is fine
    const signature = await appEth.signTransaction("44'/60'/0'/0/0", ethHash.substring(2), null)

    return {
      r: addHexDots(signature.r),
      s: addHexDots(signature.s),
      v: parseInt(signature.v),
    }
  } catch (e) {
    console.warn('LEDGER CONNECTION:', e)
  }

  return null
}
