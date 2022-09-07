import React, { useState } from 'react'
import Row from '../spacing/Row'
import Link from './Link'
import logo from '../../assets/img/uqbar-logo-text.png'
import './Navbar.scss'
import { isMobileCheck } from '../../utils/dimensions'
import Dropdown from '../popups/Dropdown'
import Text from '../text/Text'
import useExplorerStore from '../../store/explorerStore'

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const isMobile = isMobileCheck()
  const { accounts, importedAccounts } = useExplorerStore()
  const addresses = accounts.map(({ address }) => address).concat(importedAccounts.map(({ address }) => address))

  return (
    <Row className='navbar'>
      <Row style={{ width: '100%', justifyContent: 'space-between' }}>
        <Link className={'nav-link logo'} href="/">
          <img src={logo} alt="Uqbar Logo" />
        </Link>
        <Row>
          <Link className={`nav-link ${window.location.pathname === `${process.env.PUBLIC_URL}/` || window.location.pathname === process.env.PUBLIC_URL ? 'selected' : ''}`} href="/">
            Home
          </Link>
          {addresses.length > -1 && (
            <Dropdown value="My Accounts" open={open} toggleOpen={() => setOpen(!open)} className="nav-link" unstyled style={{ padding: '0 0 0 8px', fontSize: 16 }}>
              {addresses.map(a => (
                <Link href={`/address/${a}`} className="account" key={a}>
                  <Text mono oneLine style={{ maxWidth: 150, padding: '4px 8px' }}>{a}</Text>
                </Link>
              ))}
            </Dropdown>
          )}
        </Row>
      </Row>
    </Row>
  )
}

export default Navbar
