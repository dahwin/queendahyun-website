import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Cookies from 'js-cookie';
import LandingPage from './LandingPage_page.tsx';
import SignupPage from './SignupPage_page.tsx';
import UserPage from './user_page.tsx';

const GOOGLE_CLIENT_ID = "523322493045-4ev8g65gb1vddkem1idqf1e5igei10gh.apps.googleusercontent.com";

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

  const handleAuthentication = (token: string) => {
    Cookies.set('auth_token', token, { expires: 7 }); // Set cookie to expire in 7 days
    setIsAuthenticated(true);
  };

  // Wrapper function to match the expected prop type
  const setIsAuthenticatedWrapper = (value: boolean) => {
    if (value) {
      // If setting to true, we need a token. In this case, we'll use a dummy token.
      // In a real scenario, you might want to handle this differently.
      handleAuthentication("dummy_token");
    } else {
      handleLogout();
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ?
              <UserPage onLogout={handleLogout} /> :
              <Navigate to="/home" />
            }
          />
          <Route path="/home" element={<LandingPage />} />
          <Route
            path="/signup"
            element={
              isAuthenticated ?
              <Navigate to="/" /> :
              <SignupPage setIsAuthenticated={setIsAuthenticatedWrapper} />
            }
          />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;