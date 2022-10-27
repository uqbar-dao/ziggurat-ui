import useIndexerStore from '../../stores/indexerStore'
import { Item } from '../../types/indexer/Item'
import { addHexDots } from '../../utils/format'
import CopyIcon from '../../components/text/CopyIcon'
import Entry from '../../components/spacing/Entry'
import Field from '../../components/spacing/Field'
import Link from '../nav/Link'
import Text from '../../components/text/Text'
import HexNum from '../../components/text/HexNum'
import Row from '../../components/spacing/Row'

import './Item.scss'

interface ItemEntryProps {
  item: Item
  isWalletAddress?: boolean
}

export const ItemEntry = ({
  item,
  isWalletAddress = false,
}: ItemEntryProps) => {
  const { metadata } = useIndexerStore()
  const tokenMetadata = item.salt ? metadata[item.salt] : null

  return (
    item.id !== item.source ? (
      <Entry divide className='indexer-item' key={item.id}>
        <Field className='id' name='ID:'>
          <Row>
            <Link href={`/item/${addHexDots(item.id)}`}>
              <HexNum mono style={{ margin: 2 }} num={addHexDots(item.id)} />
            </Link>
            <CopyIcon text={addHexDots(item.id)}></CopyIcon>
          </Row>
        </Field>
        {isWalletAddress ? (
          <Field name='Source:'>
            <Row>
              <Link href={`/item/${addHexDots(item.source)}`}>
                <HexNum mono style={{ margin: 2 }} num={addHexDots(item.source)} />
              </Link>
              <CopyIcon text={addHexDots(item.source)}></CopyIcon>
            </Row>
          </Field>
        ) : (
          item.holder !== item.source && (
            <Field name='Holder:'>
              <Row>
                <Link href={`/address/${addHexDots(item.holder)}`}>
                  <HexNum mono style={{ margin: 2 }} num={addHexDots(item.holder)} />
                </Link>
                <CopyIcon text={addHexDots(item.holder)}></CopyIcon>
              </Row>
            </Field>
          )
        )}
        {Boolean(tokenMetadata) && (
          <Field name='Token:'>
            <Row>
              <Text mono oneLine>{tokenMetadata?.data?.symbol}</Text>
              <CopyIcon text={tokenMetadata?.data?.symbol!}></CopyIcon>
            </Row>
          </Field>
        )}
        <Field name='Town:'>
          <HexNum mono style={{ margin: 2 }} num={item.town.toString()} />
          {/* <CopyIcon text={`${item.townId}`}></CopyIcon> */}
        </Field>
      </Entry>
    ) : (
      <>
      </>
    )
  )
}
