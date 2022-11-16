import React, { ChangeEvent, KeyboardEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import Button from '../../components/form/Button'
import Input from '../../components/form/Input'
import Col from '../../components/spacing/Col'
import Row from '../../components/spacing/Row'
import Container from '../../components/spacing/Container'
import Card from '../../components-indexer/card/Card'
import useIndexerStore from '../../stores/indexerStore'
import Text from '../../components/text/Text'
import { ADDRESS_REGEX, BLOCK_SEARCH_REGEX, TXN_HASH_REGEX, ITEM_REGEX, ETH_ADDRESS_REGEX } from '../../utils/regex'
import { abbreviateHex, addHexDots, addHexPrefix, removeDots } from '../../utils/format'
import { getRawStatus } from '../../utils/constants'
import Link from '../../components-indexer/nav/Link'
import CardHeader from '../../components-indexer/card/CardHeader'
import Entry from '../../components/spacing/Entry'
import Field from '../../components/spacing/Field'
import Footer from '../../components-indexer/nav/Footer'
import HexNum from '../../components/text/HexNum'

import './HomeView.scss'
import { formatIndexerTimestamp } from '../../utils/date'

const HomeView = () => {
  const { batches, transactions } = useIndexerStore()
  const [searchValue, setSearchValue] = useState('')
  const [inputError, setInputError] = useState('')
  const navigate = useNavigate()

  console.log({ batches, transactions })

  const search = () => {
    const cleanValue = addHexPrefix(removeDots(searchValue))
    if (!searchValue) {
      setInputError('Please enter a search')
    // check for block
    } else if (BLOCK_SEARCH_REGEX.test(cleanValue)) {
      console.log('BLOCK')
      navigate(`/block/${cleanValue}`)
    } else if (ADDRESS_REGEX.test(cleanValue) || ETH_ADDRESS_REGEX.test(cleanValue)) {
      console.log('ADDRESS')
      navigate(`/address/${cleanValue}`)
    // check for txn hash
    } else if (TXN_HASH_REGEX.test(cleanValue)) {
      console.log('TRANSACTION')
      navigate(`/tx/${cleanValue}`)
    } else if (ITEM_REGEX.test(cleanValue)) {
      console.log('ITEM')
      navigate(`/item/${cleanValue}`)
    } else {
      setInputError('Must be in address, txn hash, or epoch/block/town format (with slashes)')
    }
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (inputError) {
      setInputError('')
    }
    setSearchValue(e.target.value)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      search()
    }
  }

  return (
    <Container className='home'>
      <Col className='splash'>
        <h3>The Uqbar Blockchain Explorer</h3>
        <Row className='search'>
          <Input
            value={searchValue}
            className='search-input'
            containerStyle={{ width: '80%' }}
            placeholder='Address, Txn Hash, Epoch / Block / Town'
            onChange={onChange}
            onKeyDown={onKeyDown}
          />
          <Button className='search-button' onClick={search}>
            <FaSearch />
          </Button>
        </Row>
        {Boolean(inputError) && (
          <Text style={{ padding: 4, color: 'red' }}>{inputError}</Text>
        )}
      </Col>
      <Col className='info'>
        {/* <Card className='highlights'>
          <Row>

          </Row>
        </Card> */}
        <Row className='latest'>
          <Card className='latest-batches title'>
            <CardHeader title='Latest Batches'>
              <Row style={{marginLeft: 'auto'}}> {/* m-l:auto causes alignment to the right of flex container */}
                {/* <Text large style={{marginRight: '1em'}}>Next:</Text>
                <Text large mono>{Math.max(0, timeToNextBlock)}</Text> */}
              </Row>
            </CardHeader>
            <Col>
              {!batches.length && <Text className='mt1'>No batches to display.</Text>}
              {batches.length > 0 && batches.map((bh, index) => (
                <Entry key={bh.id}>
                  <Field name='Time:'>
                    <Text>{formatIndexerTimestamp(bh.timestamp)}</Text>
                  </Field>
                  <Field name='Batch ID:'>
                    <Link href={`/batch/${bh.id}`}>
                      <HexNum mono num={bh.id} />
                    </Link>
                  </Field>
                </Entry>
              ))}
            </Col>
          </Card>
          <Card className='latest-transactions' title='Latest Transactions'>
            <Col>
              {transactions.length < 1 && (
                <Text className='mt1'>There are no transactions in these batches.</Text>
              )}
              {transactions.map((tx, index) => (
                <Entry key={tx.hash || index}>
                  <Field name='Hash:'>
                    <Link href={`/tx/${addHexDots(tx.hash)}`}>
                      <Text mono >{abbreviateHex(tx.hash, 6, 4)}</Text>
                    </Link>
                  </Field>
                  <Field name='From:'>
                    <Link href={`/address/${addHexDots(tx.transaction.shell.caller.id)}`}>
                      <Text mono >{abbreviateHex(tx.transaction.shell.caller.id, 6, 4)}</Text>
                    </Link>
                  </Field>
                  <Field name='Nonce:'>
                    <Text mono >{tx.transaction.shell.caller.nonce}</Text>
                  </Field>
                  <Field name='Status:'>
                    <Text>{getRawStatus(tx.transaction.shell.status)}</Text>
                  </Field>
                </Entry>
              ))}
            </Col>
          </Card>
        </Row>
      </Col>
      <Footer />
    </Container>
  )
}

export default HomeView
