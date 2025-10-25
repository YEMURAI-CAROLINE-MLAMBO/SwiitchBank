import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import UnifiedDashboard from './components/Dashboard/UnifiedDashboard';
import WalletPage from './pages/WalletPage';
import CardsPage from './pages/CardsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SettingsPage from './pages/SettingsPage';
import TransactionsPage from './pages/TransactionsPage';
import BusinessOnboarding from './components/BusinessOnboarding';
import ReferralPage from './pages/ReferralPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import OnboardingPage from './pages/OnboardingPage';
import CreateTicketPage from './pages/CreateTicketPage';
import CheckoutPage from './pages/CheckoutPage';
import MoonPayPage from './pages/MoonPayPage';
import SecurityDashboard from './components/SecurityDashboard';
import ExecutionDashboard from './components/ExecutionDashboard';
import Marketplace from './pages/SwiitchParty/Marketplace';
import FunderDashboard from './pages/SwiitchParty/FunderDashboard';
import BorrowerDashboard from './pages/SwiitchParty/BorrowerDashboard';
import AboutUsPage from './pages/AboutUsPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import TermsOfUsePage from './pages/TermsOfUsePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

function App() {
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  return (
    <Router>
      <Routes>
        {onboardingComplete ? (
          <>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<UnifiedDashboard />} />
              <Route path="wallet" element={<WalletPage />} />
              <Route path="cards" element={<CardsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="business-onboarding" element={<BusinessOnboarding />} />
              <Route path="referral" element={<ReferralPage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="security" element={<SecurityDashboard />} />
              <Route path="execution-dashboard" element={<ExecutionDashboard />} />
              <Route path="create-ticket" element={<CreateTicketPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="moonpay" element={<MoonPayPage />} />
              <Route path="swiitch-party/marketplace" element={<Marketplace />} />
              <Route path="swiitch-party/funder-dashboard" element={<FunderDashboard />} />
              <Route path="swiitch-party/borrower-dashboard" element={<BorrowerDashboard />} />
              <Route path="about-us" element={<AboutUsPage />} />
              <Route path="terms-and-conditions" element={<TermsAndConditionsPage />} />
              <Route path="terms-of-use" element={<TermsOfUsePage />} />
              <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </>
        ) : (
          <>
            <Route path="/onboarding" element={<OnboardingPage onComplete={() => setOnboardingComplete(true)} />} />
            <Route path="*" element={<Navigate to="/onboarding" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
