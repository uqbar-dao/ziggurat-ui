import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import Button from '../../../components-indexer/form/Button'
import Input from '../../../components-indexer/form/Input'
import Col from '../../../components-indexer/spacing/Col'
import Row from '../../../components-indexer/spacing/Row'

import './HomeView.scss'
import Container from '../../../components-indexer/spacing/Container'
import Card from '../../../components-indexer/card/Card'
import useIndexerStore from '../../../stores/indexerStore'
import Text from '../../../components-indexer/text/Text'
import { ADDRESS_REGEX, BLOCK_SEARCH_REGEX, TXN_HASH_REGEX, GRAIN_REGEX, ETH_ADDRESS_REGEX } from '../../../utils/regex'
import { addHexPrefix, removeDots } from '../../../utils/format'
import { getStatus } from '../../../utils/constants'
import Link from '../../../components-indexer/nav/Link'
import CardHeader from '../../../components-indexer/card/CardHeader'
import Entry from '../../../components-indexer/card/Entry'
import Field from '../../../components-indexer/card/Field'
import Footer from '../../../components-indexer/nav/Footer'

const getOffset = (nextBlockTime: number) => Math.round((nextBlockTime - new Date().getTime()) / 1000)

const HomeView = () => {
  const { blockHeaders, transactions, nextBlockTime, init } = useIndexerStore()
  const [searchValue, setSearchValue] = useState('')
  const [inputError, setInputError] = useState('')
  const [timeToNextBlock, setTimeToNextBlock] = useState(getOffset(nextBlockTime || new Date().getTime()))
  const navigate = useNavigate()


  useEffect(() => {
    try {
      init()
    } catch (err) {}
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (nextBlockTime !== null) {
      const interval = setInterval(() => setTimeToNextBlock(getOffset(nextBlockTime)), 1000)
      return () => clearInterval(interval)
    }
  }, [nextBlockTime])

  const search = () => {
    if (!searchValue) {
      setInputError('Please enter a search')
    // check for block
    } else if (BLOCK_SEARCH_REGEX.test(searchValue)) {
      console.log('BLOCK')
      navigate(`/block/${searchValue}`)
    } else if (ADDRESS_REGEX.test(addHexPrefix(removeDots(searchValue))) || ETH_ADDRESS_REGEX.test(addHexPrefix(removeDots(searchValue)))) {
      console.log('ADDRESS')
      navigate(`/address/${addHexPrefix(removeDots(searchValue))}`)
    // check for txn hash
    } else if (TXN_HASH_REGEX.test(addHexPrefix(removeDots(searchValue)))) {
      console.log('TRANSACTION')
      navigate(`/tx/${addHexPrefix(removeDots(searchValue))}`)
    } else if (GRAIN_REGEX.test(addHexPrefix(removeDots(searchValue)))) {
      console.log('GRAIN')
      navigate(`/grain/${addHexPrefix(removeDots(searchValue))}`)
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
            <CardHeader title='Latest Blocks'>
              <Row style={{marginLeft: 'auto'}}> {/* m-l:auto causes alignment to the right of flex container */}
                <Text large style={{marginRight: '1em'}}>Next:</Text>
                <Text large mono>{Math.max(0, timeToNextBlock)}</Text>
              </Row>
            </CardHeader>
            <Col>
              {blockHeaders.map((bh, index) => (
                <Entry key={bh.epochNum}>
                    <Field name='Epoch:'>
                      <Link href={`/block/${bh.epochNum}/${bh.blockHeader.num}/1`}>
                        <Text>{bh.epochNum}</Text>
                      </Link>
                    </Field>
                    <Field name='Block:'>
                      <Text>{bh.blockHeader.num}</Text>
                    </Field>
                    <Field name='Hash:'>
                      <Text mono oneLine>{removeDots(bh.blockHeader.dataHash)}</Text>
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
                    <Text mono >{removeDots(tx.hash)}</Text>
                  </Field>
                  <Field name='ID:'>
                    <Link href={`/tx/${addHexPrefix(removeDots(tx.hash))}`}>
                      <Text mono >{tx.egg.shell.from.id}</Text>
                    </Link>
                  </Field>
                  <Field name='Nonce:'>
                    <Text mono >{tx.egg.shell.from.nonce}</Text>
                  </Field>
                  <Field name='Zigs:'>
                    <Text mono >{tx.egg.shell.from.zigs}</Text>
                  </Field>
                  <Field name='Status:'>
                    <Text>{getStatus(tx.egg.shell.status)}</Text>
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
