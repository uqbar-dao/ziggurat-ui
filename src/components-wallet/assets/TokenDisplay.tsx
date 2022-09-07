import React, { useState } from 'react'
import { FaCaretRight, FaCaretDown, FaCoins, FaPortrait } from 'react-icons/fa';
import useWalletStore from '../../stores/walletStore';
import { Token } from '../../types/wallet/Token'
import { abbreviateHex } from '../../utils/format';
import { displayTokenAmount } from '../../utils/number';
import Button from '../form/Button';
import Col from '../spacing/Col';
import Row from '../spacing/Row'
import Text from '../text/Text';
import Field from '../form/Field';
import NftImage from './NftImage';
import CopyIcon from '../transactions/CopyIcon';
import Divider from '../spacing/Divider';
import Entry from '../form/Entry';

import './TokenDisplay.scss'

interface TokenDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  token: Token
  setId: (id: string) => void
  setNftIndex: (nftId?: number) => void
}

const TokenDisplay: React.FC<TokenDisplayProps> = ({
  token,
  setId,
  setNftIndex,
  ...props
}) => {
  const { metadata } = useWalletStore()
  const tokenMetadata = metadata[token.data.metadata]
  const { contract, id, data } = token
  const [open, setOpen] = useState(false)
  const isToken = data.balance !== undefined
  const selectToken = () => {
    setId(id)
    setNftIndex(data.id)
  }

  return (
    <Col {...props} onClick={() => !open && setOpen(true)} className={`token-display ${props.className || ''} ${open ? 'open' : ''}`}>
      <Row className='token-display-header' onClick={() => setOpen(!open)}>
        <Row style={{  flexBasis: '70%'  }}>
          <Row style={{ padding: '2px 4px' }}>
            <FaCaretDown className='arrow' /> 
            {isToken? <FaCoins /> : <FaPortrait /> }
          </Row>
          <Text bold className='token-name'>{(isToken ? tokenMetadata?.data?.symbol : tokenMetadata?.data?.name) || abbreviateHex(contract)}</Text>
        </Row>
        <Row>
          {isToken ? (
            <Text>{displayTokenAmount(data.balance!, tokenMetadata?.data?.decimals || 1)}</Text>
            ) : (
            <Text># {data.id || ''}</Text>
          )}
          <Button onClick={selectToken} style={{ marginLeft: 16 }} dark small>
            Transfer
          </Button>
        </Row>
      </Row>
      <Col className='details'>
        <Divider />
        {isToken && tokenMetadata?.data?.name && (
          <Entry>
            <Field name='Name:'>
              <Text mono>{tokenMetadata?.data?.name}</Text>
            </Field>
          </Entry>
        )}
        <Entry>
          <Field name='Contract:'>
            <Text breakWord mono>{contract}</Text>
            <CopyIcon text={contract} />
          </Field>
        </Entry>
        <Entry>
          <Field name='Grain:'>
            <Text breakWord mono>{id}</Text>
            <CopyIcon text={id} />
          </Field>
        </Entry>
        {!isToken && <NftImage nftInfo={data} />}
      </Col>
    </Col>
  )
}

export default TokenDisplay
