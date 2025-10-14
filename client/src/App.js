import React, { useEffect } from 'react';
import EnhancedDashboard from './components/dashboard/EnhancedDashboard';
import SophiaChat from './components/SophiaChat.jsx';
import './styles/richmont-enhancement.css';

function App() {
  useEffect(() => {
    // Apply Richmont enhancements globally
    document.body.classList.add('richmont-enhanced-platform');
  }, []);

  return (
    <div className="App enhanced-switchbank-app">
      <SophiaChat />
    </div>
  );
}

export default App;
