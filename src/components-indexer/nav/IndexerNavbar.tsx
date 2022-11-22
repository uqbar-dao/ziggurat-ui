import { ChangeEvent, KeyboardEvent, useCallback, useState } from 'react'
import Row from '../../components/spacing/Row'
import Link from './Link'
import logo from '../../assets/img/logo192.png'
import Dropdown from '../../components/popups/Dropdown'
import Text from '../../components/text/Text'
import useIndexerStore from '../../stores/indexerStore'
import { abbreviateHex, addHexPrefix, removeDots } from '../../utils/format'
import HexNum from '../../components/text/HexNum'
import '../../components/nav/Navbar.scss'
import { PUBLIC_URL } from '../../utils/constants'
import classNames from 'classnames'
import Button from '../../components/form/Button'
import { FaSearch } from 'react-icons/fa'
import Input from '../../components/form/Input'
import { ADDRESS_REGEX, BLOCK_SEARCH_REGEX, ETH_ADDRESS_REGEX, ITEM_REGEX, TXN_HASH_REGEX } from '../../utils/regex'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const IndexerNavbar = () => {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [inputError, setInputError] = useState('')
  const navigate = useNavigate()

  // TODO spin this & the home searchbar into their own single component
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
      toast.error('Must be in address, txn hash, batch, or town format')
    }
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      search()
    }
  }

  
  const { accounts, importedAccounts } = useIndexerStore()
  const addresses = accounts.map(({ address }) => address).concat(importedAccounts.map(({ address }) => address))

  return (<>
    <style>{`html {
      background-color: #fbeff0;
    }`}</style>
    <Row between className='navbar indexer-nav'>
      <Row>
        <Row className='logo-text'>
          <Link external title='Home' href='/apps/ziggurat' className='nav-link logo'>
            <Row>
              {/* <FaArrowLeft className='mr1' /> */}
              <img src={logo} alt='Uqbar Logo' />
            </Row>
          </Link>
          <Text mr1 className='site-title'>Explorer</Text>
        </Row>
        <Row>
          <Link className={classNames('nav-link', { selected: window.location.pathname.match(new RegExp(PUBLIC_URL+'/indexer$')) })} href='/'>
            Home
          </Link>
          {addresses.length > 0 && (
            <Dropdown value='My Accounts' open={open} toggleOpen={() => setOpen(!open)} className='nav-link dropdown' unstyled style={{ padding: '0 16px', fontSize: 16 }}>
              {addresses.map(a => (
                <Link href={`/address/${a}`} className='account' key={a} style={{ margin: '2px 0' }}>
                  <HexNum num={a} displayNum={abbreviateHex(a, 5, 3)} />
                </Link>
              ))}
            </Dropdown>
          )}
          <Link external className='nav-link' href={PUBLIC_URL+`/wallet`}>
            Wallet
          </Link>
        </Row>
      </Row>
      <Row>
        <Row className='search'>
          <Input
            value={searchValue}
            className='search-input'
            containerStyle={{ width: '80%' }}
            placeholder='Search...'
            onChange={onChange}
            onKeyDown={onKeyDown}
          />
          <Button className='search-button' onClick={search}>
            <FaSearch />
          </Button>
        </Row>
      </Row>
    </Row>
  </>)
}

export default IndexerNavbar
