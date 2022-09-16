import React, { ChangeEvent, KeyboardEvent, useState } from 'react'
import moment from 'moment'
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
import { ADDRESS_REGEX, BLOCK_SEARCH_REGEX, TXN_HASH_REGEX, GRAIN_REGEX, ETH_ADDRESS_REGEX } from '../../utils/regex'
import { abbreviateHex, addHexPrefix, removeDots } from '../../utils/format'
import { getRawStatus } from '../../utils/constants'
import Link from '../../components-indexer/nav/Link'
import CardHeader from '../../components-indexer/card/CardHeader'
import Entry from '../../components/spacing/Entry'
import Field from '../../components/spacing/Field'
import Footer from '../../components-indexer/nav/Footer'
import HexNum from '../../components/text/HexNum'

import './HomeView.scss'

const HomeView = () => {
  const { batches, transactions } = useIndexerStore()
  const [searchValue, setSearchValue] = useState('')
  const [inputError, setInputError] = useState('')
  const navigate = useNavigate()

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
    } else if (GRAIN_REGEX.test(cleanValue)) {
      console.log('GRAIN')
      navigate(`/grain/${cleanValue}`)
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
          <Card className='latest-blocks title'>
            <CardHeader title='Latest Batches'>
              <Row style={{marginLeft: 'auto'}}> {/* m-l:auto causes alignment to the right of flex container */}
                {/* <Text large style={{marginRight: '1em'}}>Next:</Text>
                <Text large mono>{Math.max(0, timeToNextBlock)}</Text> */}
              </Row>
            </CardHeader>
            <Col>
              {batches.map((bh, index) => (
                <Entry key={bh.id}>
                  <Field name='Time:'>
                    <Text>{moment(bh.timestamp).format('YYYY-MM-DD hh:mm')}</Text>
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
                <Text style={{ padding: '8px 16px' }}>There are no transactions in these blocks.</Text>
              )}
              {transactions.map((tx, index) => (
                <Entry key={tx.hash || index}>
                  <Field name='Hash:'>
                    <Link href={`/tx/${addHexPrefix(removeDots(tx.hash))}`}>
                      <Text mono >{abbreviateHex(tx.hash, 6, 4)}</Text>
                    </Link>
                  </Field>
                  <Field name='From:'>
                    <Link href={`/address/${addHexPrefix(removeDots(tx.egg.shell.from.id))}`}>
                      <Text mono >{abbreviateHex(tx.egg.shell.from.id, 6, 4)}</Text>
                    </Link>
                  </Field>
                  <Field name='Nonce:'>
                    <Text mono >{tx.egg.shell.from.nonce}</Text>
                  </Field>
                  <Field name='Status:'>
                    <Text>{getRawStatus(tx.egg.shell.status)}</Text>
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
