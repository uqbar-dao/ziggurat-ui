import React, { useState } from 'react'
import { FaCaretDown, FaCoins, FaPortrait } from 'react-icons/fa';
import useWalletStore from '../../stores/walletStore';
import { Token } from '../../types/wallet/Token'
import { abbreviateHex } from '../../utils/format';
import { displayTokenAmount } from '../../utils/number';
import Button from '../../components/form/Button';
import Col from '../../components/spacing/Col';
import Row from '../../components/spacing/Row'
import Text from '../../components/text/Text';
import Field from '../../components/spacing/Field';
import NftImage from './NftImage';
import CopyIcon from '../../components/text/CopyIcon';
import Divider from '../../components/spacing/Divider';
import Entry from '../../components/spacing/Entry';

import './TokenDisplay.scss'
import HexNum from '../../components/text/HexNum';

interface TokenDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  token: Token
  selectToken: (tokenId: string, nftIndex?: number) => void
}

const TokenDisplay: React.FC<TokenDisplayProps> = ({
  token,
  selectToken,
  ...props
}) => {
  const { metadata } = useWalletStore()
  const tokenMetadata = metadata[token.data.metadata]
  const { contract, id, data } = token
  const [open, setOpen] = useState(false)
  const isToken = data.balance !== undefined

  return (
    <Col {...props} onClick={() => !open && setOpen(true)} className={`token-display ${props.className || ''} ${open ? 'open' : ''}`}>
      <Row className='token-display-header' onClick={() => setOpen(!open)}>
        <Row style={{  flexBasis: '70%'  }}>
          <Row style={{ padding: '2px 4px' }}>
            <FaCaretDown className='arrow' /> 
            {isToken? <FaCoins /> : <FaPortrait /> }
          </Row>
          <Text bold className='token-name'>{(isToken ? tokenMetadata?.data?.symbol : tokenMetadata?.data?.name) || <HexNum num={contract} />}</Text>
        </Row>
        <Row>
          {isToken ? (
            <Text>{displayTokenAmount(data.balance!, tokenMetadata?.data?.decimals || 1, open ? tokenMetadata?.data?.decimals || 8 : 8)}</Text>
            ) : (
            <Text># {data.id || ''}</Text>
          )}
          <Button onClick={(e) => {e.stopPropagation();selectToken(id, data.id)}} style={{ marginLeft: 16 }} dark small>
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
        {isToken && tokenMetadata?.data?.decimals && (
          <Entry>
            <Field name='Decimals:'>
              <Text breakWord mono>{tokenMetadata?.data?.decimals}</Text>
            </Field>
          </Entry>
        )}
        <Entry>
          <Field name='Contract:'>
            <HexNum copy mono num={contract} />
          </Field>
        </Entry>
        <Entry>
          <Field name='Grain:'>
            <HexNum copy mono num={id} />
          </Field>
        </Entry>
        {!isToken && tokenMetadata?.data?.properties && (
          <Entry>
            <Field name='Properties:'>
              <Text breakWord mono>{tokenMetadata?.data?.properties.join(', ')}</Text>
            </Field>
          </Entry>
        )}
        {!isToken && <NftImage nftInfo={data} />}
      </Col>
    </Col>
  )
}

export default TokenDisplay
