import { Transaction } from '../../types/indexer/Transaction'
import { getRawStatus } from '../../utils/constants'
import { addHexDots } from '../../utils/format'
import Entry from '../../components/spacing/Entry'
import Field from '../../components/spacing/Field'
import Link from '../nav/Link'
import Col from '../../components/spacing/Col'
import Text from '../../components/text/Text'
import HexNum from '../../components/text/HexNum'
import CopyIcon from '../../components/text/CopyIcon'
import { formatIndexerTimestamp } from '../../utils/date'

import './Transaction.scss'

interface TransactionProps {
  tx: Transaction
  displayIndex: number
  isWalletAddress?: boolean
}

export const TransactionEntry = ({
  tx,
  displayIndex,
  isWalletAddress = false,
}: TransactionProps) => {
  return (
    <Entry divide={displayIndex > 1}>
      <Field className='transaction' name={displayIndex + '.'}> 
        <Col>
          <Field name='Time:'>
            <Text mono oneLine>{formatIndexerTimestamp(tx.timestamp)}</Text>
          </Field>
          <Field name='Hash:'>
            <Link href={`/tx/${addHexDots(tx.hash || '')}`}>
              <HexNum mono style={{ margin: 2 }} num={addHexDots(tx.hash || '')} />
            </Link>
            <CopyIcon text={addHexDots(tx.hash!)} />
          </Field>
          {isWalletAddress ? (
            <Field name='To:'>
              <Link href={`/grain/${addHexDots(tx.egg.shell.contract)}`}>
                <HexNum mono style={{ margin: 2 }} num={addHexDots(tx.egg.shell.contract)} />
              </Link>
              <CopyIcon text={tx.egg.shell.contract} />
            </Field>
          ) : (
            <Field name='From:'>
              <Link href={`/grain/${addHexDots(tx.egg.shell.from.id)}`}>
                <HexNum mono style={{ margin: 2 }} num={addHexDots(tx.egg.shell.from.id)} />
              </Link>
              <CopyIcon text={tx.egg.shell.from.id} />
            </Field>
          )}
          <Field name='Status:'>
            <Text mono oneLine>{getRawStatus(tx.egg.shell.status)}</Text>
          </Field>
        </Col>
      </Field>
    </Entry>
  )
}
