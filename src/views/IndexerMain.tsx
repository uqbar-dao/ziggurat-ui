import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useIndexerStore from '../stores/indexerStore';
import HomeView from './indexer/HomeView';
import BlocksView from './indexer/BlocksView';
import BlockView from './indexer/BlockView';
import TransactionView from './indexer/TransactionView';
import AddressView from './indexer/AddressView';
import Navbar from '../components-indexer/nav/Navbar';
import LoadingOverlay from '../components-indexer/popups/LoadingOverlay';
import { PUBLIC_URL } from '../utils/constants';
// import TransactionsView from './views/TransactionsView';
// import PendingTransactionsView from './views/PendingTransactionsView';
// import GrainsView from './views/GrainsView';
// import AccountsView from './views/AccountsView';

function IndexerMain() {
  const { init, loadingText } = useIndexerStore()

  useEffect(() => {
    init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrowserRouter basename={`${PUBLIC_URL}/indexer`}>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="latest-blocks/:numBlocks" element={<BlocksView />} />
        <Route path="block/:epoch/:block/:town" element={<BlockView />} />
        <Route path="tx/:tx" element={<TransactionView />} />
        <Route path="address/:address" element={<AddressView />} />
        <Route path="grain/:grain" element={<AddressView />} />
        {/* <Route path="blocks" element={<BlocksView />} />
        <Route path="txs" element={<TransactionsView />} />
        <Route path="pendingTxs" element={<PendingTransactionsView />} />
        <Route path="contracts" element={<GrainsView />} /> */}
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>
      <LoadingOverlay loading={Boolean(loadingText)} text={loadingText || ''} />
    </BrowserRouter>
  );
}

export default IndexerMain;
