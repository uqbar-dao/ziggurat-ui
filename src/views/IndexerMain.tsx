import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useIndexerStore from '../stores/indexerStore';
import HomeView from './indexer/HomeView';
import BatchesView from './indexer/BatchesView';
import BatchView from './indexer/BatchView';
import TransactionView from './indexer/TransactionView';
import AddressView from './indexer/AddressView';
import ItemView from './indexer/ItemView';
import IndexerNavbar from '../components-indexer/nav/IndexerNavbar';
import LoadingOverlay from '../components/popups/LoadingOverlay';
import { PUBLIC_URL } from '../utils/constants';
import { ToastContainer } from 'react-toastify';
// import TransactionsView from './views/TransactionsView';
// import PendingTransactionsView from './views/PendingTransactionsView';
// import ItemsView from './views/ItemsView';
// import AccountsView from './views/AccountsView';

function IndexerMain() {
  const { init, loadingText } = useIndexerStore()

  useEffect(() => {
    init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrowserRouter basename={`${PUBLIC_URL}/indexer`}>
      <IndexerNavbar />
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="latest-batches/:numBlocks" element={<BatchesView />} />
        <Route path="batch/:batchId" element={<BatchView />} />
        <Route path="batch/:batchId/:townId" element={<BatchView />} />
        <Route path="tx/:tx" element={<TransactionView />} />
        <Route path="address/:address" element={<AddressView />} />
        <Route path="item/:item" element={<ItemView />} />
        {/* <Route path="blocks" element={<BlocksView />} />
        <Route path="txs" element={<TransactionsView />} />
        <Route path="pendingTxs" element={<PendingTransactionsView />} />
        <Route path="projects" element={<ItemsView />} /> */}
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
      <ToastContainer
       autoClose={false}
       hideProgressBar
       closeOnClick
       rtl={false}
       draggable
       theme='colored'
       style={{ fontSize: 14 }}/>
    </BrowserRouter>
  );
}

export default IndexerMain;
