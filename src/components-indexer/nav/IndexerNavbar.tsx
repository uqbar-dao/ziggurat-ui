import React, { useState } from 'react'
import Row from '../../components/spacing/Row'
import Link from './Link'
import logo from '../../assets/img/logo192.png'
import { isMobileCheck } from '../../utils/dimensions'
import Dropdown from '../../components/popups/Dropdown'
import Text from '../../components/text/Text'
import useIndexerStore from '../../stores/indexerStore'
import { abbreviateHex } from '../../utils/format'

import { FaArrowLeft, FaBackward } from 'react-icons/fa'

const IndexerNavbar = () => {
  const [open, setOpen] = useState(false)
  const isMobile = isMobileCheck()
  const { accounts, importedAccounts } = useIndexerStore()
  const addresses = accounts.map(({ address }) => address).concat(importedAccounts.map(({ address }) => address))

  return (
    <Row className='navbar'>
      <Row style={{ width: '100%', justifyContent: 'space-between' }}>
        <Row className='logo-text'>
          <Link title='Home' className={'nav-link logo'} href='/'>
            <Row>
              <FaArrowLeft className='mr1' />
              <img src={logo} alt='Uqbar Logo' />
            </Row>
          </Link>
          <Text bold mr1>EXPLORER</Text>
        </Row>
        <Row>
          <Link className={`nav-link ${window.location.pathname === `${process.env.PUBLIC_URL}/` || window.location.pathname === process.env.PUBLIC_URL ? 'selected' : ''}`} href='/'>
            Home
          </Link>
          {addresses.length > -1 && (
            <Dropdown value='My Accounts' open={open} toggleOpen={() => setOpen(!open)} className='nav-link' unstyled style={{ padding: '0 0 0 8px', fontSize: 16 }}>
              {addresses.map(a => (
                <Link href={`/address/${a}`} className='account' key={a}>
                  <Text mono oneLine style={{ maxWidth: 150, padding: '4px 8px' }}>{abbreviateHex(a, 6, 4)}</Text>
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
