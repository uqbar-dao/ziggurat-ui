import 'core-js/actual'
import { ethers, Wallet } from "ethers"
import TrezorConnect from '@trezor/connect-web';

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

export const signTrezorTransaction = async (address: string, hash: string, txn: any) => {
  try {
//     const transport = await TransportWebUSB.create()
//     listen(log => console.log(log))
//     const appEth = new Eth(transport)

//     // const wallet = new Wallet(pk)
//     // const signature = await wallet.signMessage(hash)
//     // const { r: r1, s: s1, v: v1 } = ethers.utils.splitSignature(signature)

//     // TODO: fill these out from the txn
//     console.log('EGG:', txn)
//     const to = (Object.values(txn.args)[0] as any)?.to


//   //Serializing the transaction to pass it to Trezor Nano for signing

//     // Need a working version of this
//     const ethHash = ethers.utils.serializeTransaction({
//       to: removeDots(to).substring(0, 42),
//       gasPrice: '0x' + parseInt(txn.rate).toString(16),
//       gasLimit: ethers.utils.hexlify(txn.bud),
//       nonce: txn.nonce,
//       chainId: txn.town,
//       data: removeDots(hash),
//       // value: ethers.utils.parseUnits(1, "ether")._hex
//     })

//     console.log('ETH HASH:', ethHash)

//     // How to figure out path from address? Probably the main path is fine
//     const signature = await appEth.signTransaction("44'/60'/0'/0/0", ethHash.substring(2), null)
//     console.log('SIGNATURE:', signature)

//     const attachedSig = {
//       r: addHexDots(signature.r),
//       s: addHexDots(signature.s),
//       v: parseInt(signature.v),
//     }

//     console.log('BASE10 SIG:', attachedSig)

//     return { ethHash, sig: attachedSig }
  } catch (e) {
    // console.warn('Trezor CONNECTION:', e)
  }

  return { ethHash: null, sig: null }
}
