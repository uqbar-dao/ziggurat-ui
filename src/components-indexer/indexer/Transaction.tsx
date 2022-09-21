import moment from 'moment'
import { Transaction } from '../../types/indexer/Transaction'
import { getRawStatus } from '../../utils/constants'
import { removeDots } from '../../utils/format'
import Entry from '../../components/spacing/Entry'
import Field from '../../components/spacing/Field'
import Link from '../nav/Link'
import Col from '../../components/spacing/Col'
import Text from '../../components/text/Text'
import HexNum from '../../components/text/HexNum'
import CopyIcon from '../../components/text/CopyIcon'

import './Transaction.scss'
import { formatIndexerTimestamp } from '../../utils/date'

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
            <Link href={`/tx/${removeDots(tx.hash || '')}`}>
              <HexNum mono num={removeDots(tx.hash || '')} />
            </Link>
            <CopyIcon text={removeDots(tx.hash!)} />
          </Field>
          {isWalletAddress ? (
            <Field name='To:'>
              <Link href={`/grain/${removeDots(tx.egg.shell.contract)}`}>
                <HexNum mono num={removeDots(tx.egg.shell.contract)} />
              </Link>
              <CopyIcon text={tx.egg.shell.contract} />
            </Field>
          ) : (
            <Field name='From:'>
              <Link href={`/grain/${removeDots(tx.egg.shell.from.id)}`}>
                <HexNum mono num={removeDots(tx.egg.shell.from.id)} />
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
