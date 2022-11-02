import 'core-js/actual'
import { ethers } from "ethers"
import TrezorConnect from '@trezor/connect-web';
import { addHexDots, removeDots } from './format';
import { Txn } from '../types/wallet/SendTransaction';

TrezorConnect.init({
    lazyLoad: true, // this param will prevent iframe injection until TrezorConnect.method will be called
    manifest: {
        email: 'fabnev.hinmur@gmail.com',
        appUrl: 'https://apps.apple.com/my/app/escape-by-uqbar/id1610194217',
    },
}).then(() => {
    console.log('TREZOR: library init')
}).catch(err=>{
    console.error('TREZOR: ', err)
});

export const getTrezorAddress = async (path?: string) => {
  try {
    // todo: make this secure via the method herein https://github.com/trezor/trezor-suite/blob/develop/docs/packages/connect/methods/requestLogin.md
    const login = await TrezorConnect.requestLogin({
        challengeHidden: '2718281828459045',
        challengeVisual: 'Login to Uqbar Wallet',
    })

    if (!login.success) {
        alert('Could not login to Trezor.')
        return ''
    }

    const result = await TrezorConnect.ethereumGetAddress({
        path: path || "m/44'/60'/0'/0/0"
    })

    if (result.success) {
        return result.payload.address
    }

    alert('There was an issue getting an Eth address from Trezor.')

    console.error('TREZOR: ', result.payload.error)
  } catch (e) {
    alert('Please make sure your Trezor is connected, unlocked, and the Ethereum app is open then try again.')
    console.warn('TREZOR CONNECTION:', e)
  }

  return ''
}

// @path a path in BIP 32 format
export const deriveTrezorAddress = async (path: string) => {
  return await getTrezorAddress(path)
}

export const signTrezorTransaction = async (hash: string, txn: Txn) => {
  try {
    const { payload }: any = await TrezorConnect.ethereumSignTransaction({
      path: "m/44'/60'/0'",
      transaction: {
        to: removeDots(txn.to).substring(0, 42),
        value: '0x0',

        gasPrice: '0x' + txn.rate.toString(16),
        // maxFeePerGas: '0x14',
        // maxPriorityFeePerGas: '0x0',

        gasLimit: ethers.utils.hexlify(txn.budget),
        nonce: txn.nonce.toString(16),
        chainId: parseInt(txn.town, 16),
        data: removeDots(hash),
      },
    })

    console.log('SIGNATURE:', payload)

    return {
      r: addHexDots(payload.r),
      s: addHexDots(payload.s),
      v: parseInt(payload.v),
    }
  } catch (e) {
    console.warn('LEDGER CONNECTION:', e)
  }

  return null
}
