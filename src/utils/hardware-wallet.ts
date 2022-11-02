import { ethers } from "ethers"
import { HardwareWalletType } from "../types/wallet/Accounts";
import { Txn } from "../types/wallet/SendTransaction";
import { removeDots } from "./format";
import { signLedgerTransaction } from "./ledger";
import { signTrezorTransaction } from "./trezor";

export const generateEthHash = (hash: string, txn: Txn) => {
  const ethHash = ethers.utils.serializeTransaction({
    to: removeDots(txn.to).substring(0, 42),
    gasPrice: '0x' + txn.rate.toString(16),
    gasLimit: ethers.utils.hexlify(txn.budget),
    nonce: txn.nonce,
    chainId: parseInt(txn.town, 16),
    data: removeDots(hash),
    // value: ethers.utils.parseUnits(1, "ether")._hex
  })

  return ethHash
}

export const signWithHardwareWallet = async (type: HardwareWalletType, address: string, hash: string, txn: Txn) => {
  let sig
  const ethHash = generateEthHash(hash, txn)
  console.log('TXN:', txn)

  switch (type) {
    case 'ledger':
      sig = await signLedgerTransaction(ethHash)
      break
    case 'trezor':
      sig = await signTrezorTransaction(hash, txn)
      break
  }

  return { ethHash, sig }
}
