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
    grain.id !== grain.lord ? (
      <Entry divide className='indexer-grain' key={grain.id}>
        <Field className='id' name='ID:'>
          <Link href={`/grain/${addHexDots(grain.id)}`}>
            <HexNum mono num={addHexDots(grain.id)} />
          </Link>
          <CopyIcon text={addHexDots(grain.id)}></CopyIcon>
        </Field>
        {isWalletAddress ? (
          <Field name='Lord:'>
            <Link href={`/grain/${addHexDots(grain.lord)}`}>
              <HexNum mono num={addHexDots(grain.lord)} />
            </Link>
            <CopyIcon text={addHexDots(grain.lord)}></CopyIcon>
          </Field>
        ) : (
          grain.holder !== grain.lord && (
            <Field name='Holder:'>
              <Link href={`/address/${addHexDots(grain.holder)}`}>
                <HexNum mono num={addHexDots(grain.holder)} />
              </Link>
              <CopyIcon text={addHexDots(grain.holder)}></CopyIcon>
            </Field>
          )
        )}
        {Boolean(tokenMetadata) && (
          <Field name='Token:'>
            <Text mono oneLine>{tokenMetadata?.data?.symbol}</Text>
            <CopyIcon text={tokenMetadata?.data?.symbol!}></CopyIcon>
          </Field>
        )}
        <Field name='Town:'>
          <HexNum mono num={grain['town-id'].toString()} />
          {/* <CopyIcon text={`${grain.townId}`}></CopyIcon> */}
        </Field>
      </Entry>
    ) : (
      <>
      </>
    )
  )
}
