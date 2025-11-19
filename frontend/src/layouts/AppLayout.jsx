import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './AppLayout.css'; // Layout specific styles
import SophiaChat from '../components/sophia/SophiaChat';

function AppLayout() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <nav className="app-nav">
          <div className="app-logo">SwiitchBank</div>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/wallet">Wallet</Link></li>
            <li><Link to="/cards">Cards</Link></li>
            <li><Link to="/transactions">Transactions</Link></li>
            <li><Link to="/swiitch-love">SwiitchLove</Link></li>
            <li><Link to="/settings">Settings</Link></li>
            <li><Link to="/swiitch-party/marketplace">SwiitchParty</Link></li>
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
            {/* Add more navigation links */}
          </ul>
        </nav>
      </header>
      <div className="app-body">
        <main className="app-content">
          <Outlet /> {/* Renders the content of the matched nested route */}
        </main>
        <SophiaChat />
      </div>


      <footer className="app-footer">
        {/* Footer content */}
        <p>&copy; 2024 SwiitchBank</p>
      </footer>
    </div>
  );
}

export default AppLayout;
