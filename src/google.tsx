import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface GoogleSignInPageProps {
  onAuthentication: (token: string) => void;
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// const JWT_SERVER_URL = process.env.JWT;
const JWT_SERVER_URL = "http://localhost:8080"


const GoogleSignInPage: React.FC<GoogleSignInPageProps> = ({ onAuthentication }) => {
  const navigate = useNavigate();

  const sendJwtToken = async (token: string) => {
    try {
      const response = await axios.get(JWT_SERVER_URL, {
        params: { data: token }
      });
      console.log(`Server responded with: ${response.data}`);
    } catch (error) {
      console.error('Error sending JWT token:', error);
    }
  };

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
          
          // Send JWT token to the server
          await sendJwtToken(response.data.access_token);
         
          // Call onAuthentication instead of navigating directly
          onAuthentication(response.data.access_token);
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome Back!</h1>
        <p className="text-gray-600 mb-8">Sign in to access your account and continue your journey.</p>
        <div className="mb-8">
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
        <p className="text-sm text-gray-500">
          By signing in, you agree to our <a href="#" className="text-blue-500 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default GoogleSignInPage;