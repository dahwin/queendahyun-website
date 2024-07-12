import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

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

const BASE_URL = "http://localhost:8000/api";

const UserPage: React.FC<UserPageProps> = ({ onLogout }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const email = Cookies.get('user_email');
      console.log('All cookies:', Cookies.get()); // Debug log

      if (!email) {
        console.log('user_email cookie not found'); // Debug log
        setError("User email not found in cookie");
        return;
      }

      try {
        console.log('Fetching user data for email:', email); // Debug log
        const response = await axios.get(`${BASE_URL}/user/${email}`);
        if (response.status === 200) {
          console.log('User data received:', response.data); // Debug log
          setUserData(response.data);
        } else {
          console.log('Failed to fetch user data, status:', response.status); // Debug log
          setError("Failed to fetch user data");
        }
      } catch (err) {
        console.error('Error fetching user data:', err); // Debug log
        setError("An error occurred while fetching user data");
      }
    };

    fetchUserData();
  }, []);


  const handleLogout = () => {
    Cookies.remove('auth_token');
    Cookies.remove('user_email');
    onLogout();
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-purple-800 to-pink-700 animate-gradient-x"></div>
        <div className="absolute inset-0 bg-black opacity-75"></div>
      </div>
      <main className="flex-1 flex items-center justify-center z-10">
        {/* Main content area */}
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