import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  gender: string;
  country: string;
}

interface UserPageProps {
  onLogout: () => void;
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const UserPage: React.FC<UserPageProps> = ({ onLogout }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error("No authentication token found");
        }
        const response = await axios.get(`${API_BASE_URL}/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);
        setError(null);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data.detail || "Could not validate credentials");
          if (err.response.status === 401) {
            localStorage.removeItem('access_token');
            onLogout();
            navigate('/signup');
          }
        } else {
          setError("An unexpected error occurred");
        }
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, onLogout]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    onLogout();
    navigate('/home');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-purple-800 to-pink-700 animate-gradient-x"></div>
        <div className="absolute inset-0 bg-black opacity-75"></div>
      </div>
      <main className="flex-1 flex items-center justify-center z-10">
        <div className="text-center bg-black bg-opacity-80 backdrop-blur-lg p-8 rounded-xl shadow-2xl max-w-2xl mx-auto transform transition-all duration-500 hover:scale-105">
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse">
            Coming Soon!
          </h2>
          <p className="text-xl text-gray-300 mb-6">
            We're working hard to bring you an amazing experience. Our full website is under development and will be launching soon. Stay tuned for updates and exciting new features!
          </p>
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
        </div>
      </main>
      <aside className="w-1/4 bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg p-6 z-10 flex flex-col">
        <div>
          <h2 className="text-2xl font-bold text-white animate-gradient-text">Profile</h2>
         
          {error && (
            <div className="mt-4 p-2 bg-red-500 text-white rounded">
              {error}
            </div>
          )}
         
          {userData && (
            <div className="mt-8 bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg p-4 rounded-lg shadow-xl">
              <h1 className="text-2xl font-bold text-white animate-gradient-text">Welcome, {userData.first_name}!</h1>
              <h2 className="text-xl font-semibold text-gray-300 mt-2">User Profile</h2>
              <p className="mt-2 text-gray-300">Name: {userData.first_name} {userData.last_name}</p>
              <p className="mt-1 text-gray-300">Email: {userData.email}</p>
              <p className="mt-1 text-gray-300">Date of Birth: {userData.date_of_birth}</p>
              <p className="mt-1 text-gray-300">Gender: {userData.gender}</p>
              <p className="mt-1 text-gray-300">Country: {userData.country}</p>
            </div>
          )}
        </div>
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300"
          >
            Logout
          </button>
        </div>
      </aside>
    </div>
  );
};

export default UserPage;