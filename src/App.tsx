import React, { AnchorHTMLAttributes } from 'react';
import { PUBLIC_URL } from './utils/constants';
import ZigguratMain from './views/ZigguratMain';
import IndexerMain from './views/IndexerMain';
import WalletMain from './views/WalletMain';
import Container from './components/spacing/Container';
import Text from './components/text/Text'
import Link from './components-indexer/nav/Link'
import logo from './assets/img/uqbar-logo-text.png'
import Entry from './components/spacing/Entry';
import Row from './components/spacing/Row';
import Grid from './components/spacing/Grid';

import './App.scss'
import './SelectAppView.scss'

interface AppTileProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  color: string
  title: string
}
const AppTile: React.FC<AppTileProps> = ({ href, color, children, title, ...props }) => {
  return <a href={href} className='app-tile' style={{ backgroundColor: color }}>
    <Text>{title}</Text>
    {children}
  </a>
}

const SelectAppView = () => {
  return (
    <Container className='select-app'>
        <Grid style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(auto, 250px))' }}>
          <AppTile color='#333' href={`${PUBLIC_URL}/develop`} title='Contract & App Development'>
          </AppTile>
          <AppTile color='#5761ef' href={`${PUBLIC_URL}/wallet`} title='Uqbar Wallet'>
          </AppTile>
          <AppTile color='#cd3c52' href={`${PUBLIC_URL}/indexer`} title='Block Explorer'>
          </AppTile>
        </Grid>
    </Container>
  )
}

function App() {
  if (window.location.href.includes(`${PUBLIC_URL}/develop`)) {
    return <ZigguratMain />
  } else if (window.location.href.includes(`${PUBLIC_URL}/indexer`)) {
    return <IndexerMain />
  } else if (window.location.href.includes(`${PUBLIC_URL}/wallet`)) {
    return <WalletMain />
  }

  return (
    <Entry>
      <Row style={{ borderBottom: '2px solid #f3ced2' }}>
        <Link external className={'nav-link logo'} href='/apps/ziggurat'>
          <img src={logo} alt='Uqbar Logo' />
        </Link>
      </Row>
      <SelectAppView />
    </Entry>
  )

}

export default App;
