import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Cookies from 'js-cookie';
import LandingPage from './LandingPage_page.tsx';
import SignupPage from './SignupPage_page.tsx';
import UserPage from './user_page.tsx';
import GoogleSignInPage from './google.tsx';
import SignInSuccessPage from './SignInSuccessPage.tsx';
import BlogList from './BlogList.tsx';
import BlogPost from './BlogPost.tsx';
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const AppContent: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

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
    navigate('/home');
  };

  const handleAuthentication = (token: string, isGoogleSignIn: boolean = false) => {
    console.log('Handling authentication');
    localStorage.setItem('access_token', token);
    setIsAuthenticated(true);
    console.log('isAuthenticated set to true');
    if (isGoogleSignIn) {
      navigate('/signin-success');
    } else {
      navigate('/');
    }
  };

  console.log('Current isAuthenticated state:', isAuthenticated);

  return (
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
            <SignupPage setIsAuthenticated={(token) => handleAuthentication(token, false)} />
          )
        }
      />
      <Route path="/blog" element={<BlogList />} />
      <Route path="/blog/title/:title" element={<BlogPost />} />
      <Route
        path="/singing_google"
        element={
          isAuthenticated ? (
            <Navigate to="/" replace />
          ) : (
            <GoogleSignInPage onAuthentication={(token) => handleAuthentication(token, true)} />
          )
        }
      />
      <Route
        path="/signin-success"
        element={
          isAuthenticated ? (
            <SignInSuccessPage />
          ) : (
            <Navigate to="/home" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <AppContent />
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;