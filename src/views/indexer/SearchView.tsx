import { useCallback, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import PageHeader from "../../components/page/PageHeader"
import Container from "../../components/spacing/Container"
import Entry from "../../components/spacing/Entry"
import { addHexDots, addHexPrefix, removeDots } from "../../utils/format"
import { ADDRESS_REGEX, BATCH_HASH_REGEX, CONTRACT_REGEX, ETH_ADDRESS_REGEX, ITEM_REGEX, TXN_HASH_REGEX } from "../../utils/regex"
import Text from '../../components/text/Text'
import { Batches } from "../../types/indexer/Batch"
import { Transaction } from "../../types/indexer/Transaction"
import useIndexerStore from "../../stores/indexerStore"
import Loader from "../../components/popups/Loader"

const SearchView = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const query = location.pathname.split('/')[2]
  let results: any[] = []
  const [msg, setMsg] = useState('')
  const { scry } = useIndexerStore()

  const val = addHexPrefix(removeDots(query))
  if (!query) {
    setMsg('Please enter a search query.')
  } else if (ITEM_REGEX.test(val)) {
    if (ETH_ADDRESS_REGEX.test(val) || ADDRESS_REGEX.test(val)) {
      navigate(`/address/${val}`)
    } else if (CONTRACT_REGEX.test(val) || !BATCH_HASH_REGEX.test(val)) {
      navigate(`/item/${val}`)
    } else {
      // it's a batch or tx... proceed to scry
    }
  } else {
    setMsg('Must be in address, txn hash, batch, or town format')
  }

  useEffect(() => {
    const getData = async () => {
      // if we find a batch, go there
      const bresult = await scry<Batches>(`/batch/${addHexDots(val)}`)
      console.log({ bresult })
      if (bresult?.batch) {
        navigate(`/batch/${bresult.batch.id}`)
        results = [...results, bresult.batch]
      }
      
      // if we find a tx, go there
      const tresult = await scry<{ transaction: { [key: string]: Transaction } }>(`/json/transaction/${addHexDots(val)}`)
      console.log({ tresult })
      if (tresult && tresult.transaction && Object.values(tresult.transaction)[0]) {
        navigate(`/tx/${addHexDots(Object.keys(tresult.transaction)[0])}`)
        results = [...results, tresult.transaction]
      }
    }

    getData()
  }, [val])

  return (<Container>
    <PageHeader title={`Search: ${query}`} />
    {msg && <Entry>
      {msg}
    </Entry>}
    {(results.length > 0) && <Entry>
      {results.map(r => <Text>{r}</Text>)}
    </Entry> || <Entry>
      <Text large> No results. </Text>
    </Entry>}
  </Container>)
}

export default SearchView