import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface GoogleSignInPageProps {
  onAuthentication: (token: string) => void;
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';

const GoogleSignInPage: React.FC<GoogleSignInPageProps> = ({ onAuthentication }) => {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    console.log('Google Sign-In Success:', credentialResponse);
    if (credentialResponse.credential) {
      try {
        console.log('Sending token to backend...');
        const response = await axios.post(`${API_BASE_URL}/google-login`, {
          token: credentialResponse.credential
        });
       
        console.log('Backend response:', response.data);
        if (response.data && response.data.access_token) {
          console.log('Calling onAuthentication with token');
          onAuthentication(response.data.access_token);
          console.log('Navigating to root...');
          navigate('/');
        } else {
          throw new Error('No access token received');
        }
      } catch (error) {
        console.error('Google login failed:', error);
        navigate('/home');
      }
    }
  };

  const handleError = () => {
    console.log('Google Sign-In Failed');
    navigate('/home');
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f0f0'
    }}>
      <div style={{
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: 'white',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <h1>Sign in to Your App</h1>
        <p>Please sign in with your Google account to continue.</p>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap={false}
          theme="filled_blue"
          shape="rectangular"
          size="large"
          text="signin_with"
          locale="en"
        />
      </div>
    </div>
  );
};

export default GoogleSignInPage;