import 'core-js/actual'
import { ethers } from "ethers"
import { listen } from "@ledgerhq/logs"
import Eth from "@ledgerhq/hw-app-eth"
import TransportWebUSB from "@ledgerhq/hw-transport-webusb" // eslint-disable-line
import { removeDots, addHexDots } from './format'
import { Txn } from '../types/wallet/SendTransaction'

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

export const signLedgerTransaction = async (address: string, hash: string, txn: Txn) => {
  try {
    const transport = await TransportWebUSB.create()
    listen(log => console.log(log))
    const appEth = new Eth(transport)

    // const wallet = new Wallet(pk)
    // const signature = await wallet.signMessage(hash)
    // const { r: r1, s: s1, v: v1 } = ethers.utils.splitSignature(signature)

    // TODO: fill these out from the txn
    console.log('EGG:', txn)

    //Serializing the transaction to pass it to Ledger Nano for signing

    // Need a working version of this
    const ethHash = ethers.utils.serializeTransaction({
      to: removeDots(txn.to).substring(0, 42),
      gasPrice: '0x' + txn.rate.toString(16),
      gasLimit: ethers.utils.hexlify(txn.budget),
      nonce: txn.nonce,
      chainId: parseInt(txn.town, 16),
      data: removeDots(hash),
      // value: ethers.utils.parseUnits(1, "ether")._hex
    })

    console.log('ETH HASH:', ethHash)

    // How to figure out path from address? Probably the main path is fine
    const signature = await appEth.signTransaction("44'/60'/0'/0/0", ethHash.substring(2), null)
    console.log('SIGNATURE:', signature)

    const attachedSig = {
      r: addHexDots(signature.r),
      s: addHexDots(signature.s),
      v: parseInt(signature.v),
    }

    console.log('BASE10 SIG:', attachedSig)

    return { ethHash, sig: attachedSig }
  } catch (e) {
    console.warn('LEDGER CONNECTION:', e)
  }

  return { ethHash: null, sig: null }
}
