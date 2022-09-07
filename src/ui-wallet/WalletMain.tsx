import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useWalletStore from './store/walletStore';
import AccountsView from './views/AccountsView';
import AccountView from './views/AccountView';
import AssetsView from './views/AssetsView';
import TransactionsView from './views/TransactionsView';
import TransactionView from './views/TransactionView';
import { PUBLIC_URL } from '../utils/constants';
import LoadingOverlay from '../components-zig/popups/LoadingOverlay';
import Navbar from '../components-wallet/nav/Navbar';

function WalletMain() {
  const { init, loadingText } = useWalletStore()

  useEffect(() => {
    init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrowserRouter basename={`${PUBLIC_URL}/wallet`}>
      <Navbar />
      <Routes>
        <Route path="/" element={<AssetsView />} />
        <Route path="accounts/:account" element={<AccountView />} />
        <Route path="accounts" element={<AccountsView />} />
        <Route path="transactions/:hash" element={<TransactionView />} />
        <Route path="transactions" element={<TransactionsView />} />
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

export default WalletMain;
