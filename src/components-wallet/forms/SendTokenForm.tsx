import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
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

import './SendTokenForm.scss'

interface SendTokenFormProps {
  formType: 'tokens' | 'nft'
  setSubmitted: (submitted: boolean) => void
  id: string
  nftId?: number
}

const SendTokenForm = ({
  formType,
  setSubmitted,
  id,
  nftId
}: SendTokenFormProps) => {
  const selectRef = useRef<HTMLSelectElement>(null)
  const { assets, metadata, importedAccounts, setLoading, getPendingHash, sendTokens, sendNft, submitSignedHash } = useWalletStore()
  const [currentFormType, setCurrentFormType] = useState(formType)

  const isNft = currentFormType === 'nft'
  // TODO: base this on whether isNft or not
  const assetsList = useMemo(() => Object.values(assets)
    .reduce((acc: Token[], cur) => acc.concat(Object.values(cur)), [])
    .filter(t => isNft ? t.token_type === 'nft' : t.token_type === 'token'),
    [assets, isNft]
  )

  const [selectedToken, setSelected] =
    useState<Token | undefined>(assetsList.find(a => a.id === id && (!isNft || a.data.id === Number(nftId))))
  const [destination, setDestination] = useState('')
  const [rate, setGasPrice] = useState('')
  const [bud, setBudget] = useState('')
  const [amount, setAmount] = useState('')
  
  const clearForm = () => {
    setSelected(undefined)
    setDestination('')
    setGasPrice('')
    setBudget('')
    setAmount('')
  }

  useEffect(() => {
    if (selectedToken === undefined && id) {
      console.log(2, selectedToken, id)
      setSelected(assetsList.find(a => a.id === id && (nftId === undefined || Number(nftId) === a.data.id)))
    }
  }, [assetsList, id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (currentFormType !== formType) {
      setCurrentFormType(formType)
      setAmount('')
      setSelected(undefined)
      if (selectRef.current) {
        selectRef.current.value = 'Select an asset'
      }
    }
  }, [formType, currentFormType, setCurrentFormType])

  const tokenMetadata = selectedToken && metadata[selectedToken.data.metadata]

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isNft && (!amount || !Number(amount))) {
      alert('You must enter an amount')
    } else if (selectedToken?.data?.balance && Number(amount) * Math.pow(10, tokenMetadata?.data?.decimals || 1) > selectedToken?.data?.balance) {
      alert(`You do not have that many tokens. You have ${selectedToken.data?.balance} tokens.`)
    } else if (!selectedToken) {
      alert('You must select a \'from\' account')
    } else if (!destination) {
      // TODO: validate the destination address
      alert('You must specify a destination address')
    // } else if (removeDots(destination) === removeDots(selectedToken.holder)) {
    //   alert('Destination cannot be the same as the origin')
    } else if (Number(rate) < 1 || Number(bud) < Number(rate)) {
      alert('You must specify a gas price and budget')
    // } else if (!accounts.find(a => a.rawAddress === selectedToken.holder) && !importedAccounts.find(a => a.rawAddress === selectedToken.holder)) {
    //   alert('You do not have this account, did you remove a hardware wallet account?')
    } else {
      const payload = {
        from: selectedToken.holder,
        to: selectedToken.contract,
        town: selectedToken.town,
        destination: addHexDots(destination),
        rate: Number(rate),
        bud: Number(bud),
        grain: selectedToken.id,
      }
      
      if (isNft && selectedToken.data.id) {
        await sendNft(payload)
      } else if (!isNft) {
        await sendTokens({ ...payload, amount: Number(amount) * Math.pow(10, tokenMetadata?.data?.decimals || 1) })
      }

      clearForm()

      if (importedAccounts.find(a => a.rawAddress === selectedToken.holder)) {
        const { hash, egg } = await getPendingHash()
        console.log('egg', 2, egg)
        setLoading('Please sign the transaction on your Ledger')
        const { ethHash, sig } = await signLedgerTransaction(removeDots(selectedToken.holder), hash, egg)
        setLoading(null)
        if (sig) {
          console.log('sig', 3, sig)
          await submitSignedHash(hash, ethHash, sig)
        } else {
          alert('There was an error signing the transaction with Ledger.')
        }
      }

      setSubmitted(true)
    }
  }

  return (
    <Form className='send-token-form' onSubmit={submit}>
      {!isNft && (
        <Col>
          <Text style={{ margin: '8px 12px 0px 0px', fontSize: 14 }}>Token: </Text>
          <Text mono style={{ marginTop: 10 }}>{tokenMetadata?.data?.symbol || displayPubKey(selectedToken?.contract || '')} - {displayTokenAmount(selectedToken?.data?.balance!, tokenMetadata?.data?.decimals || 1)}</Text>
        </Col>
      )}

      {isNft && (
        <Col>
          <Text style={{ margin: '8px 12px 0px 0px', fontSize: 14 }}>NFT: </Text>
          <Text mono style={{ marginTop: 10 }}>{`${tokenMetadata?.data?.symbol || displayPubKey(selectedToken?.contract || '')} - # ${selectedToken?.data?.id || ''}`}</Text>
        </Col>
      )}
      <Input
        label='To:'
        placeholder='Destination address'
        style={{ width: 'calc(100% - 24px)' }}
        containerStyle={{ marginTop: 12, width: '100%' }}
        value={destination}
        onChange={(e: any) => setDestination(e.target.value)}
        required //delete line 81 & 83
      />
      {!isNft && <Input
        label='Amount:'
        placeholder='Amount'
        style={{ width: 'calc(100% - 24px)' }}
        containerStyle={{ marginTop: 12, width: '100%' }}
        value={amount}
        onChange={(e: any) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
        required //delete line 75 & 76
      />}
      <Row style={{ justifyContent: 'space-between' }}>
        <Input
          label='Gas Price:'
          placeholder='Gas price'
          style={{ width: 'calc(100% - 22px)' }}
          value={rate}
          onChange={(e: any) => setGasPrice(e.target.value.replace(/[^0-9.]/g, ''))}
          required // delete line 86 & 87
        />
        <Input
          label='Budget:'
          placeholder='Budget'
          style={{ width: 'calc(100% - 22px)' }}
          value={bud}
          onChange={(e: any) => setBudget(e.target.value.replace(/[^0-9.]/g, ''))}
          required // delete line 86 & 87
        />
      </Row>
      <Button style={{ width: '100%', margin: '16px 0px 8px' }} type='submit' dark onClick={submit}>
        Send
      </Button>
    </Form>
  )
}

export default SendTokenForm