import React, { useState } from 'react'
import Row from '../../components/spacing/Row'
import Link from './Link'
import logo from '../../assets/img/logo192.png'
import Dropdown from '../../components/popups/Dropdown'
import Text from '../../components/text/Text'
import useIndexerStore from '../../stores/indexerStore'
import { abbreviateHex } from '../../utils/format'

import { FaArrowLeft } from 'react-icons/fa'
import HexNum from '../../components/text/HexNum'

const IndexerNavbar = () => {
  const [open, setOpen] = useState(false)
  const { accounts, importedAccounts } = useIndexerStore()
  const addresses = accounts.map(({ address }) => address).concat(importedAccounts.map(({ address }) => address))

  return (
    <Row className='navbar'>
      <Row between style={{ width: '100%',  }}>
        <Row className='logo-text'>
          <Link external title='Home' href='/apps/ziggurat' className='nav-link logo'>
            <Row>
              {/* <FaArrowLeft className='mr1' /> */}
              <img src={logo} alt='Uqbar Logo' />
            </Row>
          </Link>
          <Text bold mr1>EXPLORER</Text>
        </Row>
        <Row>
          <Link className={`nav-link ${window.location.pathname === `${process.env.PUBLIC_URL}/` || window.location.pathname === process.env.PUBLIC_URL ? 'selected' : ''}`} href='/'>
            Home
          </Link>
          {addresses.length > 0 && (
            <Dropdown value='My Accounts' open={open} toggleOpen={() => setOpen(!open)} className='nav-link dropdown' unstyled style={{ padding: '0 16px' }}>
              {addresses.map(a => (
                <Link href={`/address/${a}`} className='account' key={a} style={{ margin: '2px 0' }}>
                  <HexNum num={a} displayNum={abbreviateHex(a, 5, 3)} />
                </Link>
              ))}
            </Dropdown>
          )}
        </Row>
      </Row>
    </Row>
  )
}

export default IndexerNavbar
