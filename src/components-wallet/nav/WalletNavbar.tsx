import React from 'react'
import Row from '../../components/spacing/Row'
import Link from './Link'
// import logoWithText from '../../assets/img/uqbar-logo-text.png'
import logo from '../../assets/img/logo192.png'
import { isMobileCheck } from '../../utils/dimensions'
import { FaWallet, FaKey, FaHistory, FaArrowLeft } from 'react-icons/fa'
import useWalletStore from '../../stores/walletStore'
import Text from '../../components/text/Text'
import '../../components/nav/Navbar.scss'

const WalletNavbar = () => {
  const isMobile = isMobileCheck()
  const { pathname } = useWalletStore()

  return (
    <Row className='navbar'>
      <Row>
        <Row>
          <Link external title='Home' href='/apps/ziggurat' className="nav-link logo">
            <Row>
              <FaArrowLeft className='mr1' />
              <img src={logo} alt="Uqbar Logo" />
            </ Row>
          </Link>
          <Text bold mr1>WALLET</Text>
        </Row>
        <Link className={`nav-link ${(pathname === '/' || pathname.match('/wallet/?$')) ? 'selected' : ''}`} href="/">
          {isMobile ? <FaWallet  /> : 'Assets'}
        </Link>
        <Link className={`nav-link ${pathname.includes('/accounts') ? 'selected' : ''}`} href="/accounts">
          {isMobile ? <FaKey  /> : 'Accounts'}
        </Link>
        <Link className={`nav-link ${pathname.includes('/transactions') ? 'selected' : ''}`} href="/transactions">
          {isMobile ? <FaHistory  /> : 'History'}
        </Link>
      </Row>
    </Row>
  )
}

export default WalletNavbar
