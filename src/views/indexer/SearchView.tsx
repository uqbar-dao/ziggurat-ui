import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import PageHeader from "../../components/page/PageHeader"
import Container from "../../components/spacing/Container"
import Entry from "../../components/spacing/Entry"
import { addHexDots, addHexPrefix, removeDots } from "../../utils/format"
import { ITEM_REGEX, } from "../../utils/regex"
import Text from '../../components/text/Text'
import useIndexerStore from "../../stores/indexerStore"
import { HashData } from "../../types/indexer/HashData"
import { Batch } from "../../types/indexer/Batch"
import { Item } from "../../types/indexer/Item"
import { Transaction } from "../../types/indexer/Transaction"
import { Location } from "../../types/indexer/Location"
import Link from "../../components-indexer/nav/Link"
import Card from "../../components-indexer/card/Card"
import HexNum from "../../components/text/HexNum"
import CardHeader from "../../components-indexer/card/CardHeader"
import { FaSearch } from "react-icons/fa"

interface Results {
  batches: Batch[]
  transactions: any[]
  items: any[]
}

const SearchView = () => {
  const location = useLocation()
  const nav = useNavigate()
  const query = location.pathname.split('/')[2]
  const [results, setResults] = useState<Results>()
  const [msg, setMsg] = useState('')
  const { scry } = useIndexerStore()

  const cleanQuery = addHexPrefix(addHexDots((query.trim())))

  useEffect(() => {
    console.log('QUERY: ', cleanQuery)
    if (!query) {
      setMsg('Please enter a search query.')
    } else if (ITEM_REGEX.test(removeDots(cleanQuery))) {
      // do nothing here
    } else {
      setMsg('Query must be a hex number.')
    }
    
    const getData = async () => {
      const result: HashData | undefined = await scry(`/hash/${cleanQuery}`)
      
      console.log ({ result })

      if (!result) return

      const { hash: { batches, items, transactions } } = result
      const bs = Object.entries(batches).map(([hash, b]) => ({ ...b, id: hash }))
      const is = Object.entries(items).map(([hash, i]) => ({ ...i, id: hash }))
      const ts = Object.entries(transactions).map(([hash, t]) => ({ ...t, id: hash }))

      if ([...bs, ...is, ...ts].length == 0) return

      if (bs.length == 1 && !is.length && !ts.length) {
        nav(`/batch/${bs[0].id}`)
      } else if (is.length == 1 && !bs.length && !ts.length) {
        nav(`/item/${is[0].id}`)
      } else if (ts.length == 1 && !bs.length && !is.length) {
        nav(`/tx/${ts[0].id}`)
      } else {
        setResults({ batches: bs, transactions: ts, items: is })
      }
    }

    getData()
  }, [cleanQuery])

  return (<Container>
    <PageHeader title='Search Results' />
    <Entry>
      <Card>
      {results ? <>
          <CardHeader> <FaSearch/> <HexNum num={cleanQuery} /> </CardHeader>
          {(results.batches.length > 0) && <Entry title="Batches">
            {results.batches.map(r => <Link href={`/batch/${r.id}`}>
              <HexNum num={r.id} />
            </Link>)}
          </Entry>}
          {(results.items.length > 0) && <Entry title="Items">
            {results.items.map(r => <Link href={`/item/${r.id}`}>
              <HexNum num={r.id} />
            </Link>)}
          </Entry>}
          {(results.transactions.length > 0) && <Entry title="Transactions">
            {results.transactions.map(r => <Link href={`/tx/${r.id}`}>
              <HexNum num={r.id} />
            </Link>)}
          </Entry>}
        </> : <Text large> {msg || 'No results.'} </Text>}
      </Card>
    </Entry>
  </Container>)
}

export default SearchView