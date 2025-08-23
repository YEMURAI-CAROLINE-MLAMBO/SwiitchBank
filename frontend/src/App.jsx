import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';
import WalletPage from './pages/WalletPage';
import CardsPage from './pages/CardsPage';
// Import other pages and components as needed

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="cards" element={<CardsPage />} />
          {/* Add other routes here */}
        </Route>{/* Add routes for login, signup, etc. outside the layout if needed */}
        <Route path="/login" element={null} />
        <Route path="/signup" element={null} />
      </Routes>
    </Router>
  );
}

export default App;
