import React from 'react'
import { Token } from '../../types/wallet/Token'
import TokenDisplay from './TokenDisplay'
import { displayPubKey } from '../../utils/account'
import { useNavigate } from 'react-router-dom'
import Row from '../../components/spacing/Row'
import CopyIcon from '../../components/text/CopyIcon'
import { addHexDots } from '../../utils/format'
import Text from '../../components/text/Text'
import Col from '../../components/spacing/Col'
import Button from '../../components/form/Button'
import HexNum from '../../components/text/HexNum'

import './AccountBalance.scss'

interface AccountBalanceProps extends React.HTMLAttributes<HTMLDivElement> {
  pubKey: string
  balances: Token[]
  showAddress: boolean
  selectToken: (tokenId: string, nftIndex?: number) => void
  setCustomFrom: (customFrom: string) => void
}

const AccountBalance: React.FC<AccountBalanceProps> = ({
  balances,
  pubKey,
  showAddress,
  selectToken,
  setCustomFrom,
  ...props
}) => {
  const nav = useNavigate()

  return (
    <div {...props} className={`account-balance ${props.className || ''}`}>
      {showAddress && (
        <Row style={{ justifyContent: 'space-between' }}>
          <Col>
            <Row style={{ alignItems: 'center' }}>
              <h4 style={{ fontFamily: 'monospace, monospace', margin: 0, cursor: 'pointer' }} onClick={() => nav(`/accounts/${pubKey}`)}>
                <HexNum num={pubKey}  displayNum={displayPubKey(pubKey)} />
              </h4>
              <CopyIcon text={addHexDots(pubKey)} />
            </Row>
          </Col>
          <Button dark small style={{ marginTop: 8 }} onClick={() => setCustomFrom(pubKey)}>
            Custom Txn
          </Button>
        </Row>
      )}
      {balances.length ? (
        balances.map(b => (
          <TokenDisplay token={b} key={b.id} selectToken={selectToken} />
        ))
      ) : (
        <Text>There are no assets under this account.</Text>
      )}
    </div>
  )
}

export default AccountBalance
