import React, { useEffect, useState } from 'react'
import {  FaRegTrashAlt,  } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useWalletStore from '../../stores/walletStore';
import { HotWallet, HardwareWallet } from '../../types/wallet/Accounts';
import { displayPubKey } from '../../utils/account';
import Input from '../form/Input';
import Col from '../spacing/Col';
import Row from '../spacing/Row'
import Text from '../text/Text';
import CopyIcon from '../transactions/CopyIcon';
import './AccountDisplay.scss'

const SAVE_NICK_DELAY = 1000

interface AccountDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  account: HotWallet | HardwareWallet
  full?: boolean
}

const AccountDisplay: React.FC<AccountDisplayProps> = ({
  account,
  full = false,
  ...props
}) => {
  const { nick, address, rawAddress, nonces } = account
  const navigate = useNavigate()
  const { deleteAccount, editNickname } = useWalletStore()
  const [newNick, setNewNick] = useState(nick)

  useEffect(() => {
    setNewNick(nick)
  }, [nick])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (newNick && newNick !== nick) {
        editNickname(rawAddress, newNick)
      }
    }, SAVE_NICK_DELAY)
    return () => clearTimeout(delayDebounceFn)
  }, [newNick]) // eslint-disable-line react-hooks/exhaustive-deps

  const hardware = account as HardwareWallet

  return (
    <Col {...props} className={`account-display ${props.className || ''}`}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Row>
          {hardware && hardware.type && <Text style={{marginRight: '1em'}}>{hardware.type}</Text>}
          <Input
            className='nick-input'
            style={{ fontWeight: 600, marginRight: '1em', width: '10em'  }}
            onChange={(e: any) => setNewNick(e.target.value)}
            value={newNick}
            />
          <Text mono style={{ fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate(`/accounts/${address}`)}>{displayPubKey(address)}</Text>
          <CopyIcon text={address} />
        </Row>
        <Row>
          <Row className='icon' onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (window.confirm('Really delete this account?') && 'rawAddress' in account) {
              deleteAccount(rawAddress)
            }
          }}>
            <FaRegTrashAlt  />
          </Row>
        </Row>
      </Row>
      {full && (
        <Col>
          <h4>Nonces</h4>
          {Object.keys(nonces).map(n => (
            <Row>
              <Text style={{ marginRight: 8, width: 72 }}>Town: {n}</Text>
              <Text>Nonce: {nonces[n]}</Text>
            </Row>
          ))}
        </Col>
      )}
    </Col>
  )
}

export default AccountDisplay
