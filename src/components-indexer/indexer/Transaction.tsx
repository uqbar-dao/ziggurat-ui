import moment from 'moment'
import { Transaction } from '../../types/indexer/Transaction'
import { getStatus } from '../../utils/constants'
import { removeDots } from '../../utils/format'
import Entry from '../../components/spacing/Entry'
import Field from '../../components/spacing/Field'
import Link from '../nav/Link'
import Col from '../../components/spacing/Col'
import Text from '../../components/text/Text'
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
            <Text mono oneLine>{moment(tx.timestamp).format('YYYY-MM-DD hh:mm')}</Text>
          </Field>
          <Field name='Hash:'>
            <Link href={`/tx/${removeDots(tx.hash || '')}`}>
              <Text mono oneLine>{removeDots(tx.hash || '')}</Text>
            </Link>
          </Field>
          {isWalletAddress ? (
            <Field name='To:'>
              <Link href={`/grain/${removeDots(tx.egg.shell.to)}`}>
                <Text mono oneLine>{removeDots(tx.egg.shell.to)}</Text>
              </Link>
            </Field>
          ) : (
            <Field name='From:'>
              <Link href={`/grain/${removeDots(tx.egg.shell.from.id)}`}>
                <Text mono oneLine>{removeDots(tx.egg.shell.from.id)}</Text>
              </Link>
            </Field>
          )}
          <Field name='Status'>
            <Text mono oneLine>{getStatus(tx.egg.shell.status)}</Text>
          </Field>
        </Col>
      </Field>
    </Entry>
)
}
