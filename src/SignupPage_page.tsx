import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { countries } from 'countries-list';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://127.0.0.1:8000/api';


interface SignupPageProps {
  setIsAuthenticated: (value: boolean) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ setIsAuthenticated }) => {
  const [isSignup, setIsSignup] = useState(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    country: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (isSignup) {
      if (!formData.first_name) newErrors.first_name = 'First name is required';
      if (!formData.last_name) newErrors.last_name = 'Last name is required';
      if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.country) newErrors.country = 'Country is required';
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (formData.password.length < 8 || !/[A-Z]/.test(formData.password) || !/[a-z]/.test(formData.password) || !/\d/.test(formData.password) || !/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const endpoint = isSignup ? `${API_BASE_URL}/signup` : `${API_BASE_URL}/login`;
        const dataToSend = isSignup ? formData : { email: formData.email, password: formData.password };
        console.log('Sending request to:', endpoint, 'with data:', dataToSend); // Debug log
        const response = await axios.post(endpoint, dataToSend);
        console.log('Response received:', response); // Debug log
        if (response.status === 200) {
          if (isSignup) {
            alert('Signup successful! You can now log in.');
            setIsSignup(false);
          } else {
            const { token } = response.data;
            Cookies.set('auth_token', token, { expires: 7 });
            Cookies.set('user_email', formData.email, { expires: 7 });
            console.log('Cookies set:', Cookies.get()); // Debug log
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Login/Signup error:', error); // Debug log
        alert(isSignup ? 'Signup failed. Please check your information and try again.' : 'Login failed. Please check your credentials.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-purple-800 to-pink-700 animate-gradient-x"></div>
        <div className="absolute inset-0 bg-black opacity-75"></div>
      </div>
      <div className="bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg p-8 rounded-lg shadow-xl w-full max-w-md z-10">
        <h2 className="text-3xl font-bold mb-6 text-center animate-gradient-text">
          {isSignup ? 'Join QueenDahyun' : 'Welcome Back'}
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label htmlFor="first_name" className="block text-sm font-medium mb-1">First Name</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="First Name"
                  />
                  {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
                </div>
                <div className="flex-1">
                  <label htmlFor="last_name" className="block text-sm font-medium mb-1">Last Name</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Last Name"
                  />
                  {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="date_of_birth" className="block text-sm font-medium mb-1">Date of Birth</label>
                <input
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.date_of_birth && <p className="text-red-500 text-xs mt-1">{errors.date_of_birth}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <div className="flex space-x-4">
                  {['Male', 'Female', 'Other'].map((gender) => (
                    <label key={gender} className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value={gender}
                        checked={formData.gender === gender}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      {gender}
                    </label>
                  ))}
                </div>
                {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium mb-1">Country</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a country</option>
                  {Object.entries(countries).map(([code, country]) => (
                    <option key={code} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
              </div>
            </>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Create a password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
          >
            {isSignup ? 'Sign Up' : 'Log In'}
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => setIsSignup(!isSignup)} className="text-blue-400 hover:underline">
            {isSignup ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;