import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StudentOnboarding from './components/onboarding/StudentOnboarding';
import KYCVerification from './pages/KYCVerification';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/onboarding/student" component={StudentOnboarding} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
          <PrivateRoute path="/kyc" component={KYCVerification} />
          <Route path="/" component={Login} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
