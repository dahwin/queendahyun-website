import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignInSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  const handleReturn = () => {
    // Navigate to the home page or wherever you want the user to go
    navigate('/');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Success!</h1>
        <p className="text-gray-600 mb-8">
          You are all set! Go Back To QueenDahyun Desktop App.
          <br />
          You are logged in.
        </p>
        <button
          onClick={handleReturn}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Return to QueenDahyun.com
        </button>
      </div>
    </div>
  );
};

export default SignInSuccessPage;