import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Cookies from 'js-cookie';
import LandingPage from './LandingPage_page.tsx';
import SignupPage from './SignupPage_page.tsx';
import UserPage from './user_page.tsx';
import GoogleSignInPage from './google.tsx';

const GOOGLE_CLIENT_ID = "523322493045-4ev8g65gb1vddkem1idqf1e5igei10gh.apps.googleusercontent.com";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('access_token');
      console.log('Checking authentication:', !!token);
      setIsAuthenticated(!!token);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    console.log('Logging out');
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
  };

  const handleAuthentication = (token: string) => {
    console.log('Handling authentication');
    localStorage.setItem('access_token', token);
    setIsAuthenticated(true);
    console.log('isAuthenticated set to true');
  };

  console.log('Current isAuthenticated state:', isAuthenticated);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <UserPage onLogout={handleLogout} />
              ) : (
                <Navigate to="/home" replace />
              )
            }
          />
          <Route path="/home" element={<LandingPage />} />
          <Route
            path="/signup"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <SignupPage setIsAuthenticated={handleAuthentication} />
              )
            }
          />
          <Route
            path="/singing_google"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <GoogleSignInPage onAuthentication={handleAuthentication} />
              )
            }
          />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;