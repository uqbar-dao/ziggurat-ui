import React from 'react'
import { useLocation } from 'react-router-dom'
import Row from '../components/spacing/Row'
import Link from './Link'
// import logoWithText from '../../assets/img/uqbar-logo-text.png'
import logo from '../assets/img/logo192.png'
import { isMobileCheck } from '../utils/dimensions'
import { FaWallet, FaKey, FaHistory, FaArrowLeft } from 'react-icons/fa'
import Text from '../components/text/Text'
import { PUBLIC_URL } from '../utils/constants'

import '../components/nav/Navbar.scss'

const WalletNavbar = () => {
  const isMobile = isMobileCheck()
  const { pathname } = useLocation()

  return (<>
    <style>{`html {
      background-color: #d9dcfc;
    }`}</style>
    <Row className='navbar wallet-nav'>
      <Row>
        <Row className='logo-text'>
          <Link external title='Home' href='/apps/ziggurat' className='nav-link logo'>
            <Row>
              <img src={logo} alt='Uqbar Logo' />
            </ Row>
          </Link>
          <Text mr1 className='site-title'>Wallet</Text>
        </Row>
        <Link className={`nav-link ${(pathname === '/' || pathname.match(/wallet\/?$/)) ? 'selected' : ''}`} href='/'>
          {isMobile ? <FaWallet  /> : 'Assets'}
        </Link>
        <Link className={`nav-link ${pathname.includes('/accounts') ? 'selected' : ''}`} href='/accounts'>
          {isMobile ? <FaKey  /> : 'Accounts'}
        </Link>
        <Link className={`nav-link ${pathname.includes('/transactions') ? 'selected' : ''}`} href='/transactions'>
          {isMobile ? <FaHistory  /> : 'History'}
        </Link>
        <Link external className={`nav-link`} href={PUBLIC_URL+`/indexer`}>
          {isMobile ? <FaHistory  /> : 'Explorer'}
        </Link>
      </Row>
    </Row>
  </>)
}

export default WalletNavbar