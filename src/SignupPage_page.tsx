import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, LogIn, UserPlus, Mail, Lock, CalendarDays, Globe, User, Search, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { countries } from 'countries-list';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Create properly sorted countries list (once, outside component)
const sortedCountriesList = Object.entries(countries)
  .map(([code, country]) => ({
    code,
    name: country.name
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

// AGI Canvas Background Component
const AGICanvas = () => {
  return (
    <div
      id="agiCanvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        background: 'linear-gradient(45deg, #020010, #05001A, #080026, #05001A, #020010)',
        animation: 'gradientBackgroundAnimation 15s ease infinite',
        opacity: 0.85,
      }}
    >
      <style>
        {`
          @keyframes gradientBackgroundAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          #agiCanvas { background-size: 200% 200%; }
        `}
      </style>
    </div>
  );
};

const customSignupStyles = `
  .gradient-text-flow {
    background: linear-gradient(90deg, #BF00FF, #00E0FF, #7F00FF, #BF00FF);
    background-size: 300% 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradient-flow 10s linear infinite;
  }

  @keyframes gradient-flow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .glass-form-container {
    background: rgba(10, 5, 30, 0.75); 
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border: 1px solid rgba(127, 0, 255, 0.3);
    transition: all 0.3s ease-in-out;
  }

  .fancy-input {
    background-color: rgba(255, 255, 255, 0.05); 
    border: 1px solid rgba(127, 0, 255, 0.3); 
    color: #e0e0e0; 
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }

  .fancy-input::placeholder {
    color: rgba(224, 224, 224, 0.5); 
  }

  .fancy-input:focus {
    outline: none;
    border-color: #00E0FF; 
    box-shadow: 0 0 15px rgba(0, 224, 255, 0.3); 
  }
  
  .fancy-input::-webkit-calendar-picker-indicator {
    filter: invert(0.8) brightness(1.5) sepia(1) hue-rotate(180deg) saturate(5); 
  }

  .glow-button {
    position: relative;
    overflow: hidden;
    background: linear-gradient(90deg, #7F00FF, #00E0FF); 
    transition: all 0.3s ease;
    color: white;
    font-weight: 600;
  }

  .glow-button:hover {
    box-shadow: 0 0 25px #00E0FF, 0 0 15px #7F00FF;
    transform: scale(1.03);
  }
  
  .glow-button::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300%;
    height: 300%;
    background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%);
    transform: translate(-50%, -50%) scale(0);
    transition: transform 0.5s ease;
    opacity: 0;
  }

  .glow-button:hover::before {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }

  .fancy-radio {
    appearance: none;
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(127, 0, 255, 0.4);
    width: 1.15em;
    height: 1.15em;
    border-radius: 50%;
    display: inline-grid;
    place-content: center;
    transition: background-color 0.2s ease, border-color 0.2s ease;
  }
  .fancy-radio::before {
    content: "";
    width: 0.65em;
    height: 0.65em;
    border-radius: 50%;
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    box-shadow: inset 1em 1em #00E0FF; 
  }
  .fancy-radio:checked::before {
    transform: scale(1);
  }
  .fancy-radio:checked {
    border-color: #00E0FF;
  }
  .fancy-radio:focus {
    outline: 2px solid #00E0FF;
    outline-offset: 2px;
  }

  .google-login-container > div { 
    width: 100% !important;
    display: flex !important;
    justify-content: center !important;
    border-radius: 0.375rem !important; 
    overflow: hidden; 
  }
  .google-login-container > div > button { 
     background-color: rgba(255, 255, 255, 0.08) !important;
     border: 1px solid rgba(127, 0, 255, 0.3) !important;
     color: #e0e0e0 !important;
     transition: background-color 0.3s ease, border-color 0.3s ease !important;
  }
   .google-login-container > div > button:hover {
     background-color: rgba(255, 255, 255, 0.15) !important;
     border-color: #00E0FF !important;
   }

  /* Styles for the SearchableCountryDropdown */
  .country-dropdown-container {
    position: relative;
  }
  .country-dropdown-button {
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    cursor: pointer;
  }
  .country-dropdown-list-wrapper {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    z-index: 50;
    background: rgba(15, 10, 40, 0.97);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 1px solid rgba(127, 0, 255, 0.4);
    border-radius: 0.375rem;
    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    padding: 8px;
  }
  .country-search-input-wrapper {
    position: relative;
    margin-bottom: 8px;
  }
  .country-search-input {
    width: 100%;
  }
  .country-options-list {
    max-height: 180px;
    overflow-y: auto;
  }
  .country-option-item {
    padding: 10px 12px;
    cursor: pointer;
    color: #d1d5db;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    transition: background-color 0.2s ease, color 0.2s ease;
  }
  .country-option-item:hover {
    background-color: rgba(127, 0, 255, 0.2);
    color: #f3f4f6;
  }
  .country-option-item.selected {
    background-color: rgba(0, 224, 255, 0.25);
    color: #00E0FF;
    font-weight: 500;
  }
  .country-options-list::-webkit-scrollbar { width: 6px; }
  .country-options-list::-webkit-scrollbar-track { background: rgba(127, 0, 255, 0.1); border-radius:3px; }
  .country-options-list::-webkit-scrollbar-thumb { background: rgba(127, 0, 255, 0.5); border-radius: 3px; }
  .country-options-list::-webkit-scrollbar-thumb:hover { background: rgba(127, 0, 255, 0.7); }
`;

// Searchable Country Dropdown Component
const SearchableCountryDropdown: React.FC<{
  value: string;
  onChange: (countryName: string) => void;
  error?: string;
}> = ({ value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredCountries = React.useMemo(() => 
    sortedCountriesList.filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm]
  );

  const selectedCountryName = sortedCountriesList.find(c => c.name === value)?.name || 'Select a country';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCountry = (countryName: string) => {
    onChange(countryName);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="country-dropdown-container" ref={dropdownRef}>
      <label htmlFor="country-button" className="block text-sm font-medium mb-1 text-cyan-300">
        Country
      </label>
      <div className="relative flex items-center">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 z-10">
          <Globe size={18} />
        </div>
        <button
          type="button"
          id="country-button"
          onClick={() => setIsOpen(!isOpen)}
          className={`country-dropdown-button fancy-input py-2.5 pl-10 pr-10 ${value ? 'text-gray-200' : 'text-gray-500'}`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          {selectedCountryName}
          <ChevronDown 
            size={20} 
            className={`text-cyan-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>
      </div>

      {isOpen && (
        <div className="country-dropdown-list-wrapper">
          <div className="country-search-input-wrapper">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="country-search-input fancy-input pl-10 pr-3 py-2.5"
              autoFocus
            />
          </div>
          <div className="country-options-list">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <div
                  key={country.code}
                  onClick={() => handleSelectCountry(country.name)}
                  className={`country-option-item ${country.name === value ? 'selected' : ''}`}
                  role="option"
                  aria-selected={country.name === value}
                >
                  {country.name}
                </div>
              ))
            ) : (
              <div className="country-option-item text-gray-500">No countries found</div>
            )}
          </div>
        </div>
      )}
      {error && <p className="text-red-400 text-xs mt-1 ml-1">{error}</p>}
    </div>
  );
};

interface SignupPageProps {
  setIsAuthenticated: (token: string) => void;
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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors(prevErrors => ({ ...prevErrors, [e.target.name]: '' }));
    }
  };

  // Specific handler for the custom country dropdown
  const handleCountryChange = (countryName: string) => {
    setFormData(prev => ({ ...prev, country: countryName }));
    if (errors.country) {
      setErrors(prevErrors => ({ ...prevErrors, country: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (isSignup) {
      if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
      if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
      if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
      else {
        const dob = new Date(formData.date_of_birth);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        if (age < 13) newErrors.date_of_birth = 'You must be at least 13 years old.';
      }
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.country) newErrors.country = 'Country is required';
    }
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email address is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setErrors({}); 
      try {
        if (isSignup) {
          const response = await axios.post(`${API_BASE_URL}/signup`, formData);
          alert(response.data.message || 'Signup successful! Please check your email to verify your account.');
          setIsSignup(false); 
          setFormData(prev => ({...prev, password: ''})); 
        } else {
          const response = await axios.post(`${API_BASE_URL}/token`, new URLSearchParams({
            username: formData.email,
            password: formData.password,
          }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          });
          setIsAuthenticated(response.data.access_token);
          navigate('/'); 
        }
      } catch (error: any) {
        console.error(`${isSignup ? 'Signup' : 'Login'} failed:`, error);
        if (error.response && error.response.data) {
          if (typeof error.response.data.detail === 'string') {
            setErrors({ form: error.response.data.detail });
          } else if (Array.isArray(error.response.data.detail)) {
            const fieldErrors: Record<string, string> = {};
            error.response.data.detail.forEach((err: any) => {
              if (err.loc && err.loc.length > 1) {
                fieldErrors[err.loc[1]] = err.msg;
              } else {
                fieldErrors.form = err.msg || 'An unknown error occurred.';
              }
            });
            setErrors(fieldErrors);
          } else {
            setErrors({ form: `An error occurred. ${error.response.data.detail || ''}` });
          }
        } else {
          setErrors({ form: 'An unexpected error occurred. Please try again.' });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    setIsLoading(true);
    setErrors({});
    try {
      const response = await axios.post(`${API_BASE_URL}/google-login`, {
        token: credentialResponse.credential
      });
      if (response.data && response.data.access_token) {
        setIsAuthenticated(response.data.access_token);
        navigate('/'); 
      } else {
        throw new Error('No access token received from Google login');
      }
    } catch (error: any) {
      console.error('Google login failed:', error);
      setErrors({ form: 'Google login failed. Please try again or use email/password.' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleLoginError = () => {
    console.log('Google Login Failed');
    setErrors({ form: 'Google login process was cancelled or failed. Please try again.' });
  };

  const inputField = (
    id: string, 
    label: string, 
    type: string = "text", 
    placeholder: string, 
    icon?: React.ReactNode,
    options?: {max?: string}
  ) => (
    <div className="relative">
      <label htmlFor={id} className="block text-sm font-medium mb-1 text-cyan-300">
        {label}
      </label>
      <div className="relative flex items-center">
        {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400">{icon}</div>}
        <input
          type={type}
          id={id}
          name={id}
          value={formData[id as keyof typeof formData]}
          onChange={handleChange}
          placeholder={placeholder}
          max={options?.max}
          className={`w-full py-2.5 rounded-md fancy-input ${icon ? 'pl-10 pr-3' : 'px-3'}`}
        />
      </div>
      {errors[id] && <p className="text-red-400 text-xs mt-1 ml-1">{errors[id]}</p>}
    </div>
  );

  return (
    <>
      <style>{customSignupStyles}</style>
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <AGICanvas />
        <motion.div
          className="glass-form-container p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg z-10"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center gradient-text-flow">
            {isSignup ? 'Join QueenDahyun' : 'Welcome Back'}
          </h2>
          {errors.form && <p className="text-red-400 text-sm mb-4 text-center bg-red-900/30 p-2 rounded-md">{errors.form}</p>}
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {isSignup && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {inputField("first_name", "First Name", "text", "Ada", <User size={18} />)}
                  {inputField("last_name", "Last Name", "text", "Lovelace", <User size={18} />)}
                </div>
                {inputField("date_of_birth", "Date of Birth", "date", "", <CalendarDays size={18} />, {max: new Date(new Date().setFullYear(new Date().getFullYear() - 13)).toISOString().split("T")[0]})}
                <div>
                  <label className="block text-sm font-medium mb-2 text-cyan-300">Gender</label>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {['Male', 'Female', 'Other'].map((gender) => (
                      <label key={gender} className="flex items-center cursor-pointer text-gray-300 hover:text-white">
                        <input
                          type="radio"
                          name="gender"
                          value={gender}
                          checked={formData.gender === gender}
                          onChange={handleChange}
                          className="mr-2 fancy-radio"
                        />
                        {gender}
                      </label>
                    ))}
                  </div>
                  {errors.gender && <p className="text-red-400 text-xs mt-1 ml-1">{errors.gender}</p>}
                </div>
                
                <SearchableCountryDropdown 
                  value={formData.country}
                  onChange={handleCountryChange}
                  error={errors.country}
                />
              </>
            )}
            {inputField("email", "Email", "email", "ada.lovelace@example.com", <Mail size={18} />)}
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium mb-1 text-cyan-300">Password</label>
              <div className="relative flex items-center">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400"><Lock size={18}/></div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  className="w-full py-2.5 rounded-md fancy-input pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400 hover:text-cyan-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password}</p>}
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 glow-button rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (isSignup ? (
                <span className="flex items-center justify-center"><UserPlus size={20} className="mr-2"/>Sign Up</span>
              ) : (
                <span className="flex items-center justify-center"><LogIn size={20} className="mr-2"/>Log In</span>
              ))}
            </button>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-purple-500/50"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gray-900/0 px-2 text-sm text-gray-400" style={{background: 'rgba(10, 5, 30, 0.75)'}}>Or continue with</span>
            </div>
          </div>

          <div className="google-login-container">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
              width="100%"
              theme="filled_black"
              shape="rectangular"
              logo_alignment="left"
            />
          </div>
          <p className="mt-6 text-sm text-center text-gray-300">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              onClick={() => {
                setIsSignup(!isSignup);
                setErrors({});
                setFormData(prev => ({
                  ...prev, 
                  password: '', 
                  first_name: isSignup ? prev.first_name : '', 
                  last_name: isSignup ? prev.last_name : '', 
                  date_of_birth: isSignup ? prev.date_of_birth : '', 
                  gender: isSignup ? prev.gender : '', 
                  country: isSignup ? prev.country : ''
                }));
              }} 
              className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline"
            >
              {isSignup ? 'Log in' : 'Sign up'}
            </button>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default SignupPage;