import React, { useEffect } from 'react';
import EnhancedDashboard from './components/dashboard/EnhancedDashboard';
import './styles/richmont-enhancement.css';

function App() {
  useEffect(() => {
    // Apply Richmont enhancements globally
    document.body.classList.add('richmont-enhanced-platform');
  }, []);

  return (
    <div className="App enhanced-switchbank-app">
      <EnhancedDashboard />
    </div>
  );
}

export default App;
