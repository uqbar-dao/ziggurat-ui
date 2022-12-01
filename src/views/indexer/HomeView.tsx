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
import { ITEM_REGEX,  } from '../../utils/regex'
import { abbreviateHex, addHexDots, addHexPrefix, removeDots } from '../../utils/format'
import { getRawStatus } from '../../utils/constants'
import Link from '../../components-indexer/nav/Link'
import CardHeader from '../../components-indexer/card/CardHeader'
import Entry from '../../components/spacing/Entry'
import Field from '../../components/spacing/Field'
import Footer from '../../components-indexer/nav/Footer'
import HexNum from '../../components/text/HexNum'
import {toast} from 'react-toastify'

import './HomeView.scss'
import { formatIndexerTimestamp } from '../../utils/date'
import Pill from '../../components/text/Pill'

const HomeView = () => {
  const { batches, transactions } = useIndexerStore()
  const [searchValue, setSearchValue] = useState('')
  const [inputError, setInputError] = useState('')
  const navigate = useNavigate()

  console.log({ batches, transactions })

  // TODO spin this & the navbar searchbar into their own single component
  const search = () => {
    const cleanValue = addHexDots(removeDots(searchValue.trim()))
    if (!searchValue) {
      toast.error('Please enter a search')
    } else if (ITEM_REGEX.test(addHexPrefix(removeDots(cleanValue)))) {
      navigate(`/search/${cleanValue}`)
    } else {
      toast.error('Must be in address, txn hash, batch, or town format')
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
            placeholder='Address, Txn Hash, Batch, Town'
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
                  <Row wrap>
                    <Link href={`/tx/${addHexDots(tx.hash)}`}>
                      <HexNum num={tx.hash} displayNum={abbreviateHex(tx.hash, 4, 2)} />
                    </Link>
                    <Pill label='Nonce' value={''+tx.transaction.shell.caller.nonce} />
                    <Pill label='From'>
                      <Link href={`/address/${addHexDots(tx.transaction.shell.caller.id)}`}>
                        <HexNum num={tx.transaction.shell.caller.id} displayNum={abbreviateHex(tx.transaction.shell.caller.id, 4, 2)} />
                      </Link>
                    </Pill>
                    <Pill label='Status' value={getRawStatus(tx.transaction.shell.status)} />
                  </Row>
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
