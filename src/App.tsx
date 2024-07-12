import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import LandingPage from './LandingPage_page.tsx';
import SignupPage from './SignupPage_page.tsx';
import UserPage from './user_page.tsx';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('auth_token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          isAuthenticated ? 
          <UserPage onLogout={handleLogout} /> : 
          <Navigate to="/home" />
        } />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/signup" element={
          isAuthenticated ? 
          <Navigate to="/" /> : 
          <SignupPage setIsAuthenticated={setIsAuthenticated} />
        } />
      </Routes>
    </Router>
  );
};

export default App;