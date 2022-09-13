import useIndexerStore from '../../stores/indexerStore'
import { Grain } from '../../types/indexer/Grain'
import { removeDots } from '../../utils/format'
import CopyIcon from '../../components/text/CopyIcon'
import Entry from '../../components/spacing/Entry'
import Field from '../../components/spacing/Field'
import Link from '../nav/Link'
import Text from '../../components/text/Text'
import './Grain.scss'
import HexNum from '../../components/text/HexNum'

interface GrainEntryProps {
  grain: Grain
  isRiceView?: boolean
  isWalletAddress?: boolean
}

export const GrainEntry = ({
  grain,
  isRiceView = false,
  isWalletAddress = false,
}: GrainEntryProps) => {
  const { metadata } = useIndexerStore()
  const tokenMetadata = grain.salt ? metadata[grain.salt] : null

  return (
    grain.id !== grain.lord ? (
      <Entry divide className='indexer-grain' key={grain.id}>
        <Field className='id' name='ID:'>
          <Link href={`/grain/${removeDots(grain.id)}`}>
            <HexNum mono num={removeDots(grain.id)} />
          </Link>
          <CopyIcon text={removeDots(grain.id)}></CopyIcon>
        </Field>
        {isWalletAddress ? (
          <Field name='Lord:'>
            <Link href={`/grain/${removeDots(grain.lord)}`}>
              <HexNum mono num={removeDots(grain.lord)} />
            </Link>
            <CopyIcon text={removeDots(grain.lord)}></CopyIcon>
          </Field>
        ) : (
          grain.holder !== grain.lord && (
            <Field name='Holder:'>
              <Link href={`/address/${removeDots(grain.holder)}`}>
                <HexNum mono num={removeDots(grain.holder)} />
              </Link>
              <CopyIcon text={removeDots(grain.holder)}></CopyIcon>
            </Field>
          )
        )}
        {isRiceView && (
          <Field name='Lord:'>
            <Link href={`/grain/${removeDots(grain.lord)}`}>
              <HexNum mono num={removeDots(grain.lord)} />
            </Link>
            <CopyIcon text={removeDots(grain.lord)}></CopyIcon>
          </Field>
        )}
        {Boolean(tokenMetadata) && (
          <Field name='Token:'>
            <Text mono oneLine>{tokenMetadata?.data?.symbol}</Text>
            <CopyIcon text={tokenMetadata?.data?.symbol!}></CopyIcon>
          </Field>
        )}
        <Field name='Town:'>
          <HexNum mono num={grain.townId.toString()} />
          {/* <CopyIcon text={`${grain.townId}`}></CopyIcon> */}
        </Field>
      </Entry>
    ) : (
      <>
        {grain.owns?.map((id) => (
          <Entry className='grain' key={id}>
            <Field className='id' name='ID:'>
              <Link href={`/grain/${removeDots(id)}`}>
                <HexNum mono num={removeDots(id)} />
              </Link>
            </Field>
            {/* <Row style={{ marginLeft: 28 }}>
              <Text style={{ minWidth: 60 }}>Lord:</Text>
              <Link href={`/grain/${removeDots(grain.lord)}`} className='lord'>
                <Text mono oneLine>{removeDots(grain.lord)}</Text>
              </Link>
            </Row> */}
            {Boolean(tokenMetadata) && (
              <Field name='Token:'>
                <Text mono oneLine>{tokenMetadata?.data?.symbol}</Text>
                <CopyIcon text={tokenMetadata?.data?.symbol!}></CopyIcon>
              </Field>
            )}
            <Field name='Town:'>
              <HexNum mono num={grain.townId.toString()} />
            </Field>
          </Entry>
        ))}
      </>
    )
  )
}
