import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Homepage from './HomePage';
import AuthPage from './AuthPage';
import Logout from './Logout'; 
import PaymentPage from './PaymentPage'; 
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/login" element={<AuthPage onLogin={handleLogin} />} />
          <Route path="/logout" element={<Logout onLogout={handleLogout} />} /> 
          <Route path="/payment" element={<PaymentPage />} /> 
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
