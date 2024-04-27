import React, { useState } from 'react';
import LogInForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import Dashboard from './components/Dashboard';
import ViewOrders from './components/ViewOrders';

function App() {
  const [currentView, setCurrentView] = useState('signUp');

  const handleSignUp = () => {
    setCurrentView('login');
  };

  const handleLogin = () => {
    setCurrentView('dashboard');
  };

  const navigateTo = (view) => {
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case 'signUp':
        return <SignUpForm onSignUp={handleSignUp} />;
      case 'login':
        return <LogInForm onLogin={handleLogin} />;
      case 'dashboard':
        return <Dashboard onNavigate={navigateTo} />;
      case 'viewOrders':
        return <ViewOrders onNavigateBack={() => navigateTo('dashboard')} />;
      default:
        // Handling unexpected views
        return <div>Page not found. Please go back to the main menu.</div>;
    }
  };

  return (
    <div>
      {renderView()}
    </div>
  );
}

export default App;
