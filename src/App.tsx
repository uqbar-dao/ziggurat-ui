import React from 'react';
import { PUBLIC_URL } from './utils/constants';
import ZigguratMain from './views/ZigguratMain';
import IndexerMain from './views/IndexerMain';
import WalletMain from './views/WalletMain';
import Col from './components/spacing/Col';
import Container from './components/spacing/Container';

import './App.scss'

const SelectAppView = () => {
  return (
    <Container>
      <Col style={{ justifyContent: 'center' }}>
        <h3>What are you looking for?</h3>
        <a className='mt1' href={`${PUBLIC_URL}/develop`}>Contract & App Development</a>
        <a className='mt1' href={`${PUBLIC_URL}/wallet`}>Uqbar Wallet</a>
        <a className='mt1' href={`${PUBLIC_URL}/indexer`}>Block Explorer (Indexer)</a>
      </Col>
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

  return <SelectAppView />
}

export default App;
