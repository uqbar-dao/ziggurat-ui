import React, { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/form/Button'
import Form from '../../components/form/Form'
import Input from '../../components/form/Input'
import Row from '../../components/spacing/Row'
import Text from '../../components/text/Text'
import useWalletStore from '../../stores/walletStore'
import { Token } from '../../types/wallet/Token'
import { addHexDots, displayTokenAmount } from '../../utils/number'
import { displayPubKey } from '../../utils/account'
import { signLedgerTransaction } from '../../utils/ledger'
import { removeDots } from '../../utils/format'
import Col from '../../components/spacing/Col'
import CopyIcon from '../../components/text/CopyIcon'
import TextArea from '../../components/form/TextArea'
import { NON_HEX_REGEX, NON_NUM_REGEX } from '../../utils/regex'
import { ActionDisplay } from './ActionDisplay'

import './SendTransactionForm.scss'

export type SendFormType = 'tokens' | 'nft' | 'custom';

interface SendTransactionFormProps {
  formType?: SendFormType
  setSubmitted: (submitted: boolean) => void
  id: string
  nftId?: number
  from?: string
}

const SendTransactionForm = ({
  formType,
  setSubmitted,
  id,
  nftId,
  from,
}: SendTransactionFormProps) => {
  const nav = useNavigate()
  const { unsignedTransactionHash } = useParams()
  const {
    assets, metadata, importedAccounts, unsignedTransactions,
    setLoading, getPendingHash, sendTokens, sendNft, submitSignedHash, setMostRecentTransaction, getUnsignedTransactions, sendCustomTransaction
  } = useWalletStore()

  const isNft = useMemo(() => formType === 'nft', [formType])
  const isCustom = useMemo(() => formType === 'custom', [formType])

  const assetsList = useMemo(() => Object.values(assets)
    .reduce((acc: Token[], cur) => acc.concat(Object.values(cur)), [])
    .filter(t => isNft ? t.token_type === 'nft' : t.token_type === 'token'),
    [assets, isNft]
  )

  const [selectedToken, setSelected] =
    useState<Token | undefined>(assetsList.find(a => a.id === id && (!isNft || a.data.id === Number(nftId))))
  const [to, setTo] = useState('')
  const [rate, setGasPrice] = useState('')
  const [bud, setBudget] = useState('')
  const [amount, setAmount] = useState('')
  const [contract, setContract] = useState('')
  const [town, setTown] = useState('0x0')
  const [action, setAction] = useState('')
  const [pendingHash, setPendingHash] = useState<string | undefined>(unsignedTransactionHash)

  const clearForm = () => {
    setSelected(undefined)
    setTo('')
    setGasPrice('')
    setBudget('')
    setAmount('')
  }

  useEffect(() => {
    if (selectedToken === undefined && id) {
      setSelected(assetsList.find(a => a.id === id && (nftId === undefined || Number(nftId) === a.data.id)))
    }
  }, [assetsList, id]) // eslint-disable-line react-hooks/exhaustive-deps

  const tokenMetadata = selectedToken && metadata[selectedToken.data.metadata]

  const generateTransaction = async (e: FormEvent) => {
    e.preventDefault()
    if (selectedToken?.data?.balance && Number(amount) * Math.pow(10, tokenMetadata?.data?.decimals || 1) > selectedToken?.data?.balance) {
      alert(`You do not have that many tokens. You have ${selectedToken.data?.balance} tokens.`)
    } else if (!selectedToken && !from) {
      alert('You must select a \'from\' account')
    } else {
      setMostRecentTransaction(undefined)

      if (selectedToken) {
        const payload = {
          from: selectedToken.holder,
          contract: selectedToken.contract,
          town: selectedToken.town,
          to: addHexDots(to),
          grain: selectedToken.id,
        }
        
        if (isNft && selectedToken.data.id) {
          await sendNft(payload)
        } else if (!isNft) {
          await sendTokens({ ...payload, amount: Number(amount) * Math.pow(10, tokenMetadata?.data?.decimals || 1) })
        }
      } else {
        const payload = { from: from || '', contract: addHexDots(contract), town: addHexDots(town), action: action.replace(/\n/g, '') }
        await sendCustomTransaction(payload)
      }

      setLoading('Generating transaction...')
      getUnsignedTransactions()
      const unsigned = await getUnsignedTransactions()
      const mostRecentPendingHash = Object.keys(unsigned)
        .filter(hash => unsigned[hash].from === (selectedToken?.holder || from))
        .sort((a, b) => unsigned[a].nonce - unsigned[b].nonce)[0]
      
      console.log(mostRecentPendingHash, unsigned[mostRecentPendingHash])
      setPendingHash(mostRecentPendingHash)
    }
  }

  const submitSignedTransaction = useCallback(async (e: FormEvent) => {
    e.preventDefault()
    if (pendingHash && unsignedTransactions[pendingHash]) {
      const fromAddress = unsignedTransactions[pendingHash].from
      let ethHash, sig, hardwareHash
  
      const isHardwareWalletAddress = Boolean(importedAccounts.find(a => a.rawAddress === fromAddress))
      if (isHardwareWalletAddress) {
        const { hash, egg } = await getPendingHash()
        hardwareHash = hash
        setLoading('Please sign the transaction on your Ledger')
        const sigResult = await signLedgerTransaction(removeDots(fromAddress), hash, egg)
        setLoading(null)
        ethHash = sigResult.ethHash ? sigResult.ethHash : undefined
        sig = sigResult.sig
        if (!sig)
          return alert('There was an error signing the transaction with Ledger.')
      }
  
      submitSignedHash(fromAddress, hardwareHash || pendingHash!, Number(rate), Number(bud), ethHash, sig)
      clearForm()
      setSubmitted(true)
      nav('/')
    }
  }, [unsignedTransactions, rate, bud, importedAccounts, pendingHash, nav, getPendingHash, submitSignedHash, setLoading, setSubmitted])

  const tokenDisplay = isNft ? (
    <Col>
      <Text style={{ margin: '8px 12px 0px 0px', fontSize: 14 }}>NFT: </Text>
      <Text mono style={{ marginTop: 10 }}>{`${tokenMetadata?.data?.symbol || displayPubKey(selectedToken?.contract || '')} - # ${selectedToken?.data?.id || ''}`}</Text>
    </Col>
  ) : (
    <Col>
      <Text style={{ margin: '8px 12px 0px 0px', fontSize: 14 }}>Token - Balance: </Text>
      <Text mono style={{ margin: '8px 0' }}>{tokenMetadata?.data?.symbol || displayPubKey(selectedToken?.contract || '')} - {displayTokenAmount(selectedToken?.data?.balance!, tokenMetadata?.data?.decimals || 1)}</Text>
    </Col>
  )

  if (pendingHash) {
    return (
      <Form className='send-transaction-form' onSubmit={submitSignedTransaction}>
        {!isCustom && tokenDisplay}
        {!to && <ActionDisplay action={unsignedTransactions[pendingHash].action} />}
        {to && <Input label='To:' style={{ width: '100%' }} containerStyle={{ marginTop: 12, width: '100%' }} value={to} disabled />}
        {!isNft && amount && to && <Input label='Amount:' style={{ width: '100%' }} containerStyle={{ marginTop: 12, width: '100%' }} value={amount} disabled />}
        <Col>
          <Row style={{ marginTop: 16, fontWeight: 'bold' }}>Hash: <CopyIcon text={pendingHash}/></Row>
          <Row style={{ wordBreak: 'break-all' }}>{pendingHash}</Row>
        </Col>
        <Row style={{ justifyContent: 'space-between', marginTop: 12 }}>
          <Input
            label='Gas Price:'
            placeholder='Gas price'
            containerStyle={{ width: 'calc(50% - 8px)' }}
            style={{ width: '100%' }}
            value={rate}
            onChange={(e: any) => setGasPrice(e.target.value.replace(NON_NUM_REGEX, ''))}
            required
            autoFocus
          />
          <Input
            label='Budget:'
            placeholder='Budget'
            containerStyle={{ width: 'calc(50% - 8px)' }}
            style={{ width: '100%' }}
            value={bud}
            onChange={(e: any) => setBudget(e.target.value.replace(NON_NUM_REGEX, ''))}
            required
          />
        </Row>
        <Button style={{ width: '100%', margin: '16px 0px 8px' }} type='submit' dark>
          Sign & Submit
        </Button>
      </Form>
    )
  } else if (isCustom) {
    return (
      <Form className='send-transaction-form' onSubmit={generateTransaction}>
        <Input label='From:' containerStyle={{ marginTop: 12, width: '100%' }} value={from || ''} style={{ width: '100%' }} disabled />
        <Input
          label='Contract:'
          containerStyle={{ marginTop: 12, width: '100%' }}
          placeholder='Contract Address (@ux)'
          value={contract}
          onChange={(e: any) => setContract(e.target.value.replace(NON_HEX_REGEX, ''))}
          style={{ width: '100%' }}
        />
        <Input
          label='Town:'
          containerStyle={{ marginTop: 12, width: '100%' }}
          placeholder='Town (@ux)'
          value={town}
          onChange={(e: any) => setTown(e.target.value.replace(NON_HEX_REGEX, ''))}
          style={{ width: '100%' }}
        />
        <TextArea
          label='Custom Action:'
          containerStyle={{ marginTop: 12, width: '100%' }}
          style={{ width: '100%' }}
          placeholder='[%give 0xdead 1 0x1.beef `0x1.dead]'
          value={action}
          onChange={(e: any) => setAction(e.target.value)}
        />
        <Button style={{ width: '100%', margin: '16px 0px 8px' }} type='submit' dark>
          Generate Transaction
        </Button>
      </Form>
    )
  }

  return (
    <Form className='send-transaction-form' onSubmit={generateTransaction}>
      {tokenDisplay}
      <Input
        label='To:'
        placeholder='Destination address'
        style={{ width: '100%' }}
        containerStyle={{ marginTop: 12, width: '100%' }}
        value={to}
        onChange={(e: any) => setTo(e.target.value.replace(NON_HEX_REGEX, ''))}
        required //delete line 81 & 83
      />
      {!isNft && <Input
        label='Amount:'
        placeholder='Amount'
        style={{ width: '100%' }}
        containerStyle={{ marginTop: 12, width: '100%' }}
        value={amount}
        onChange={(e: any) => setAmount(e.target.value.replace(NON_NUM_REGEX, ''))}
        required //delete line 75 & 76
      />}
      <Button style={{ width: '100%', margin: '16px 0px 8px' }} type='submit' dark>
        Generate Transaction
      </Button>
    </Form>
  )
}

export default SendTransactionForm