import useIndexerStore from '../../stores/indexerStore'
import { Grain } from '../../types/indexer/Grain'
import { addHexDots } from '../../utils/format'
import CopyIcon from '../../components/text/CopyIcon'
import Entry from '../../components/spacing/Entry'
import Field from '../../components/spacing/Field'
import Link from '../nav/Link'
import Text from '../../components/text/Text'
import HexNum from '../../components/text/HexNum'

import './Grain.scss'
import Row from '../../components/spacing/Row'

interface GrainEntryProps {
  grain: Grain
  isWalletAddress?: boolean
}

export const GrainEntry = ({
  grain,
  isWalletAddress = false,
}: GrainEntryProps) => {
  const { metadata } = useIndexerStore()
  const tokenMetadata = grain.salt ? metadata[grain.salt] : null

  return (
    grain.id !== grain.source ? (
      <Entry divide className='indexer-grain' key={grain.id}>
        <Field className='id' name='ID:'>
          <Row>
            <Link href={`/grain/${addHexDots(grain.id)}`}>
              <HexNum mono style={{ margin: 2 }} num={addHexDots(grain.id)} />
            </Link>
            <CopyIcon text={addHexDots(grain.id)}></CopyIcon>
          </Row>
        </Field>
        {isWalletAddress ? (
          <Field name='Lord:'>
            <Row>
              <Link href={`/grain/${addHexDots(grain.source)}`}>
                <HexNum mono style={{ margin: 2 }} num={addHexDots(grain.source)} />
              </Link>
              <CopyIcon text={addHexDots(grain.source)}></CopyIcon>
            </Row>
          </Field>
        ) : (
          grain.holder !== grain.source && (
            <Field name='Holder:'>
              <Row>
                <Link href={`/address/${addHexDots(grain.holder)}`}>
                  <HexNum mono style={{ margin: 2 }} num={addHexDots(grain.holder)} />
                </Link>
                <CopyIcon text={addHexDots(grain.holder)}></CopyIcon>
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
          <HexNum mono style={{ margin: 2 }} num={grain['town-id'].toString()} />
          {/* <CopyIcon text={`${grain.townId}`}></CopyIcon> */}
        </Field>
      </Entry>
    ) : (
      <>
      </>
    )
  )
}
