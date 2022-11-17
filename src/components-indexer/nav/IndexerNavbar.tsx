import { useState } from 'react'
import Row from '../../components/spacing/Row'
import Link from './Link'
import logo from '../../assets/img/logo192.png'
import Dropdown from '../../components/popups/Dropdown'
import Text from '../../components/text/Text'
import useIndexerStore from '../../stores/indexerStore'
import { abbreviateHex } from '../../utils/format'
import HexNum from '../../components/text/HexNum'
import '../../components/nav/Navbar.scss'
import { PUBLIC_URL } from '../../utils/constants'
import classNames from 'classnames'

const IndexerNavbar = () => {
  const [open, setOpen] = useState(false)
  const { accounts, importedAccounts } = useIndexerStore()
  const addresses = accounts.map(({ address }) => address).concat(importedAccounts.map(({ address }) => address))

  return (<>
    <style>{`html {
      background-color: #fbeff0;
    }`}</style>
    <Row className='navbar indexer-nav'>
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
    </Row>
  </>)
}

export default IndexerNavbar
