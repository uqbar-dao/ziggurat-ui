import React, { FormEvent, useState } from 'react'
import Button from '../../components/form/Button'
import Form from '../../components/form/Form'
import Input from '../../components/form/Input'
import Row from '../../components/spacing/Row'
import useWalletStore from '../../stores/walletStore'
import { removeDots } from '../../utils/format'
import TextArea from '../../components/form/TextArea'

import './SendTokenForm.scss'

interface SendCustomTransactionFormProps {
  from: string
  setSubmitted: (submitted: boolean) => void
}

const SendCustomTransactionForm = ({ from ,setSubmitted }: SendCustomTransactionFormProps) => {
  const { sendCustomTransaction } = useWalletStore()

  const [data, setData] = useState('')
  const [destination, setDestination] = useState('')
  const [rate, setGasPrice] = useState('')
  const [bud, setBudget] = useState('')
  const [town, setTown] = useState('')
  
  const clearForm = () => {
    setDestination('')
    setTown('')
    setData('')
    setGasPrice('')
    setBudget('')
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!destination) {
      // TODO: validate the destination address
      alert('You must specify a destination address')
    } else if (!town) {
      alert('You must specify a town')
    } else if (!data) {
      alert('You must have a custom action')
    } else if (Number(rate) < 1 || Number(bud) < Number(rate)) {
      alert('You must specify a gas price and budget')
    } else {
      const payload = {
        from,
        to: destination,
        town,
        data,
        rate: Number(rate),
        bud: Number(bud),
      }
      
      sendCustomTransaction(payload)
      clearForm()
      setSubmitted(true)
    }
  }

  return (
    <Form className='send-raw-transaction-form' onSubmit={submit}>
      <Input
        label='From:'
        containerStyle={{ marginTop: 12, width: '100%' }}
        value={removeDots(from)}
        style={{ width: 'calc(100% - 24px)' }}
        disabled
      />
      <Input
        label='To:'
        containerStyle={{ marginTop: 12, width: '100%' }}
        placeholder='Destination address (@ux)'
        value={destination}
        onChange={(e: any) => setDestination(e.target.value)}
        style={{ width: 'calc(100% - 24px)' }}
      />
      <Input
        label='Town:'
        containerStyle={{ marginTop: 12, width: '100%' }}
        placeholder='Town (@ux)'
        value={town}
        onChange={(e: any) => setTown(e.target.value)}
        style={{ width: 'calc(100% - 24px)' }}
      />
      <TextArea
        label='Custom Action:'
        containerStyle={{ marginTop: 12, width: '100%' }}
        style={{ width: 'calc(100% - 10px)' }}
        placeholder='[%give 0xdead 1 0x1.beef `0x1.dead]'
        value={data}
        onChange={(e: any) => setData(e.target.value)}
      />
      <Row style={{ justifyContent: 'space-between' }}>
        <Input
          label='Gas Price:'
          containerStyle={{ marginTop: 12 }}
          style={{ width: 'calc(100% - 22px)' }}
          value={rate}
          placeholder='Gas price'
          onChange={(e: any) => setGasPrice(e.target.value.replace(/[^0-9.]/g, ''))}
        />
        <Input
          label='Budget:'
          containerStyle={{ marginTop: 12, marginLeft: 8 }}
          style={{ width: 'calc(100% - 22px)' }}
          value={bud}
          placeholder='Budget'
          onChange={(e: any) => setBudget(e.target.value.replace(/[^0-9.]/g, ''))}
        />
      </Row>
      <Button style={{ width: '100%', margin: '16px 0px 8px' }} type='submit' dark onClick={submit}>
        Send
      </Button>
    </Form>
  )
}

export default SendCustomTransactionForm
