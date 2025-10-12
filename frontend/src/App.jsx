import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';
import WalletPage from './pages/WalletPage';
import CardsPage from './pages/CardsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SettingsPage from './pages/SettingsPage';
import TransactionsPage from './pages/TransactionsPage';
import BusinessOnboarding from './components/BusinessOnboarding';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="cards" element={<CardsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="business-onboarding" element={<BusinessOnboarding />} />
          <Route path="referral" element={<ReferralPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
}

export default App;
