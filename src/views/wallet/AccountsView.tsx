import React, { useCallback, useEffect, useState } from 'react'
import { FaExclamationTriangle } from 'react-icons/fa'
import AccountDisplay from '../../components-wallet/accounts/AccountDisplay'
import Button from '../../components/form/Button'
import Entry from '../../components/spacing/Entry'
import Form from '../../components/form/Form'
import Input from '../../components/form/Input'
import TextArea from '../../components/form/TextArea'
import PageHeader from '../../components/page/PageHeader'
import Modal from '../../components/popups/Modal'
import Col from '../../components/spacing/Col'
import Container from '../../components/spacing/Container'
import Row from '../../components/spacing/Row'
import Text from '../../components/text/Text'
import useWalletStore from '../../stores/walletStore'
import { DerivedAddressType, HardwareWalletType, Seed } from '../../types/wallet/Accounts'
import { capitalize } from '../../utils/format'

import './AccountsView.scss'
import { unwatchTabClose, watchTabClose } from '../../utils/nav'

const AccountsView = () => {
  const { accounts, importedAccounts, createAccount, restoreAccount, importAccount, getSeed, deriveNewAddress, setPathname } = useWalletStore()
  const [showCreate, setShowCreate] = useState(false)
  const [showAddWallet, setShowAddWallet] = useState<'create' | 'restore' | undefined>()
  const [showImport, setShowImport] = useState(false)
  const [mnemonic, setMnemonic] = useState('')
  const [password, setPassword] = useState('')
  const [seedData, setSeed] = useState<Seed | null>(null)
  const [addAddressType, setAddAddressType] = useState<DerivedAddressType | null>(null)
  const [nick, setNick] = useState('')
  const [hdpath, setHdpath] = useState('')
  const [importType, setImportType] = useState<HardwareWalletType | null>(null)

  const addHardwareAddress = addAddressType && addAddressType !== 'hot'

  
  useEffect(() => {
    setPathname('/wallet/accounts')
    if (!showImport && !showAddWallet && !addAddressType) {
      setNick('')
    }
  }, [showImport, showAddWallet, addAddressType])

  
  
  const showSeed = useCallback(async () => {
    if (window.confirm('Are you sure you want to display your seed phrase? Anyone viewing this will have access to your account.')) {
      const seed = await getSeed()
      setSeed(seed)
    }
  }, [getSeed, setSeed])

  const clearForm = useCallback(() => {
    setNick('')
    setHdpath('')
    setPassword('')
    setAddAddressType(null)
    unwatchTabClose()
  }, [setNick, setHdpath, setPassword, setAddAddressType])

  const create = useCallback(async (e) => {
    e.preventDefault()
    if (window.confirm('Please make sure you have backed up your seed phrase and password. This will overwrite your existing account(s), are you sure?')) {
      if (showAddWallet === 'restore') {
        if (!mnemonic) {
          return alert('Mnemonic is required')
        } else {
          restoreAccount(mnemonic, password, nick)
        }
      } else {
        createAccount(password, nick)
      }
      setShowAddWallet(undefined)
      setShowCreate(false)
      clearForm()
    }
  }, [mnemonic, password, nick, showAddWallet, createAccount, restoreAccount, clearForm])

  const doImport = useCallback(() => {
    if (!nick) {
      alert('Nickname is required')
    } else {
      if (importType) {
        importAccount(importType, nick)
      }
      setShowCreate(false)
      setShowAddWallet(undefined)
      setShowImport(false)
      setImportType(null)
      clearForm()
      unwatchTabClose()
    }
  }, [setShowCreate, setShowAddWallet, setShowImport, importAccount, clearForm, nick, importType])

  const addAddress = (e: any) => {
    e.preventDefault()
    watchTabClose()
    if (addHardwareAddress) {
      if (!hdpath) {
        return alert('You must supply an HD path')
      }
      deriveNewAddress(hdpath, nick, addAddressType)
    } else if (addAddressType) {
      deriveNewAddress(hdpath, nick)
    }
    clearForm()
  }

  const hideModal = useCallback(() => {
    clearForm()
    setImportType(null)
    setSeed(null)
    setShowAddWallet(undefined)
    setShowCreate(false)
    setShowImport(false)
    unwatchTabClose()
  }, [clearForm, setImportType, setSeed, setShowAddWallet, setShowCreate, setShowImport])

  const isFirefox = (typeof (window as any).InstallTrigger !== 'undefined') 

  const hardwareWalletTypes: HardwareWalletType[] =
    importedAccounts.reduce((acc, { type }) => !acc.includes(type) ? acc.concat([type]) : acc, [] as HardwareWalletType[])

  return (
    <Container className='accounts-view'>
      <PageHeader title='Accounts' />
      <Entry title='Hot Wallets' divide className='mb1'>
        <Text mb1>
          WARNING: HOT WALLETS ARE NOT SECURE. ALL YOUR OTHER URBIT APPS CAN READ YOUR HOT WALLET PRIVATE KEYS.
        </Text>
        {accounts.map(a => (
          <AccountDisplay key={a.address} account={a} />
          ))}
        <Row>
          {accounts.length > 0 && (
            <>
              <Button onClick={showSeed} mr1 wide >
                Display Seed Phrase
              </Button>
              <Button onClick={() => setAddAddressType('hot')} mr1 wide >
                Derive New Address
              </Button>
            </>
          )}
          <Button onClick={() => setShowCreate(true)} mr1 wide>
            New Wallet
          </Button>
        </Row>
      </Entry>
      <Entry title='Hardware Wallets'>
        {importedAccounts.map(a => (
          <AccountDisplay key={a.address} account={a} />
          ))}
        <Row>
          {importedAccounts.length > 0 && (
            <Button onClick={() => setAddAddressType(hardwareWalletTypes[0])} mr1 wide >
              Derive New Address
            </Button>
          )}
          <Button onClick={() => setShowImport(true)} mr1 wide>
            Connect
          </Button>
        </Row>
      </Entry>

      <Modal
        title='Seed:'
        show={Boolean(seedData)} 
        hide={hideModal}
        style={{ minWidth: 300 }}
      >
        <Col style={{ justifyContent: 'center', height: '100%', width: '300px' }}>
          <Text mono>{seedData?.mnemonic}</Text>
          {seedData?.password && (
            <>
              <h4>Password:</h4>
              <Text mono>{seedData?.password}</Text>
            </>
          )}
        </Col>
      </Modal>
      <Modal 
        title='Add Wallet'
        show={showCreate} 
        hide={hideModal}
        style={{ minWidth: 300 }}
      >
        <Col style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
          <Button fullWidth style={{  marginBottom: 16 }} onClick={() => setShowAddWallet('create')}>Create New Wallet</Button>
          <Button fullWidth onClick={() => setShowAddWallet('restore')}>Restore Wallet From Seed</Button>
        </Col>
      </Modal>
      <Modal 
        title={(showAddWallet === 'create' ? 'Create' : 'Restore') + ' Wallet'}
        show={Boolean(showAddWallet)} 
        hide={hideModal}
        style={{ minWidth: 300 }}
      >
        <Form style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', background: 'white' }} onSubmit={create}>
          <Input
            onChange={(e: any) => setNick(e.target.value)}
            placeholder='Nickname'
            style={{ width: '100%' }}
            containerStyle={{ width: '100%', marginBottom: 16 }}
            value={nick}
            minLength={3}
            required
            autoFocus
          />
          {showAddWallet === 'restore' && (<TextArea
            onChange={(e: any) => setMnemonic(e.target.value)}
            placeholder='Enter seed phrase'
            containerStyle={{ width: '100%', marginBottom: 16 }}
            style={{ width: '100%', height: 80 }}
          />)}
          <Input
            onChange={(e: any) => setPassword(e.target.value)}
            placeholder='Enter password'
            style={{ width: '100%', marginBottom: 16 }}
            containerStyle={{ width: '100%' }}
            type='password'
            value={password}
            minLength={5}
            required
          />
          <Button fullWidth type='submit' dark>
            {showAddWallet === 'create' ? 'Create' : 'Restore'}
          </Button>
        </Form>
      </Modal>
      <Modal
        title='Connect Hardware Wallet'
        show={showImport} 
        hide={hideModal}
        style={{ minWidth: 300 }}
      >
        <Col style={{ justifyContent: 'space-evenly', alignItems: 'center', height: '100%', width: '100%' }}>
          {isFirefox && <Col style={{alignItems:'center', marginBottom:'1em'}}>
            <FaExclamationTriangle style={{ fontSize: 'xx-large', color: 'goldenrod' }} /> 
            <Text>
              Hardware wallets may not work in Firefox. 
            </Text>
            <Text>
              Please try a different browser if you encounter issues.
            </Text>
          </Col>}
          <Button mb1 fullWidth onClick={() => {
            setShowImport(false)
            setImportType('ledger')
          }}>
            Connect Ledger
          </Button>
          <Button fullWidth onClick={() => {
            setShowImport(false)
            setImportType('trezor')
          }}>
            Connect Trezor
          </Button>
        </Col>
      </Modal>
      <Modal
        title='Set Nickname' 
        show={Boolean(importType)}
        hide={hideModal}
        style={{ minWidth: 300 }}
      >
        <Col style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
          <Input
            onChange={(e: any) => setNick(e.target.value)}
            placeholder={`Nickname, i.e. ${capitalize(importType || '')} primary`}
            style={{ width: '100%' }}
            containerStyle={{ width: '100%', marginBottom: '1em' }}
            value={nick}
          />
          <Button onClick={doImport} dark fullWidth style={{ width: '100%' }}>
            Connect
          </Button>
        </Col>
      </Modal>
      <Modal 
        title='Derive New Address' 
        show={Boolean(addAddressType)} 
        hide={hideModal}
        style={{ minWidth: 300 }}
      >
        <Form style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: 300, maxWidth: '100%', background: 'white' }} onSubmit={addAddress}>
          {(addHardwareAddress) && (
            <select className='hardware-type' value={addAddressType} onChange={(e) => setAddAddressType(e.target.value as HardwareWalletType)}>
              {hardwareWalletTypes.map(hwt => (
                <option value={hwt} key={hwt}>
                  {capitalize(hwt)}
                </option>
              ))}
            </select>
          )}
          <Input
            onChange={(e: any) => setNick(e.target.value)}
            placeholder='Nickname'
            style={{ width: '100%' }}
            containerStyle={{ width: '100%', marginBottom: 16 }}
            value={nick}
            minLength={3}
            required
          />
          <Input
            onChange={(e: any) => setHdpath(e.target.value)}
            placeholder={`HD Path ${addHardwareAddress ? '(m/44\'/60\'/0\'/0/0)' : '(optional)'}`}
            style={{ width: '100%' }}
            containerStyle={{ width: '100%', marginBottom: 16 }}
            value={hdpath}
            required={Boolean(addHardwareAddress)}
          />
          <Button type='submit' dark fullWidth>Derive</Button>
        </Form>
      </Modal>
    </Container>
  )
}

export default AccountsView
