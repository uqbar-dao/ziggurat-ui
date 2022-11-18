import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useWalletStore } from '@uqbar/wallet-ui';
import AccountsView from './wallet/AccountsView';
import AccountView from './wallet/AccountView';
import AssetsView from './wallet/AssetsView';
import TransactionsView from './wallet/TransactionsView';
import TransactionView from './wallet/TransactionView';
import { PUBLIC_URL } from '../utils/constants';
import LoadingOverlay from '../components/popups/LoadingOverlay';
import WalletNavbar from '../components-wallet/WalletNavbar';

function WalletMain() {
  const { initWallet, loadingText } = useWalletStore()

  useEffect(() => {
    initWallet({})
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrowserRouter basename={`${PUBLIC_URL}/wallet`}>
      <WalletNavbar />
      <Routes>
        <Route path="/" element={<AssetsView />} />
        <Route path="accounts/:account" element={<AccountView />} />
        <Route path="accounts" element={<AccountsView />} />
        <Route path="transactions/:hash" element={<TransactionView />} />
        <Route path="transactions" element={<TransactionsView />} />
        <Route path="/:unsignedTransactionHash" element={<AssetsView />} />
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
