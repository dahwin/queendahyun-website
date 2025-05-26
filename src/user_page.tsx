import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Send, User, LogOut, Download, MessageSquare, Zap, Globe, Monitor } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

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

// Custom styles for the futuristic theme
const customStyles = `
  .gradient-text-flow {
    background: linear-gradient(90deg, 
      #BF00FF, 
      #00E0FF, 
      #7F00FF, 
      #BF00FF  
    );
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

  .chat-container {
    background: rgba(5, 5, 20, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(127, 0, 255, 0.2);
  }

  .user-sidebar {
    background: rgba(10, 5, 30, 0.9);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border-left: 1px solid rgba(0, 224, 255, 0.2);
  }

  .message-input {
    background: rgba(20, 10, 40, 0.8);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(127, 0, 255, 0.3);
    transition: all 0.3s ease;
  }

  .message-input:focus {
    border-color: rgba(0, 224, 255, 0.6);
    box-shadow: 0 0 20px rgba(0, 224, 255, 0.2);
  }

  .send-button {
    background: linear-gradient(135deg, #7F00FF, #00E0FF);
    transition: all 0.3s ease;
  }

  .send-button:hover {
    box-shadow: 0 0 20px rgba(0, 224, 255, 0.4);
    transform: scale(1.05);
  }

  .floating-particles {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
  }

  .particle {
    position: absolute;
    width: 2px;
    height: 2px;
    background: rgba(127, 0, 255, 0.6);
    border-radius: 50%;
    animation: float 8s infinite linear;
  }

  @keyframes float {
    0% {
      transform: translateY(100vh) translateX(0);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(-100px) translateX(50px);
      opacity: 0;
    }
  }

  .glow-border {
    position: relative;
    overflow: hidden;
  }

  .glow-border::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 224, 255, 0.4), transparent);
    transition: left 0.5s ease;
  }

  .glow-border:hover::before {
    left: 100%;
  }
`;

const FloatingParticles = () => {
  const particles = Array.from({ length: 15 }, (_, i) => (
    <div
      key={i}
      className="particle"
      style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 8}s`,
        animationDuration: `${8 + Math.random() * 4}s`,
      }}
    />
  ));

  return <div className="floating-particles">{particles}</div>;
};

const UserPage: React.FC<UserPageProps> = ({ onLogout }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Mock messages for demonstration
  const [messages] = useState([
    {
      id: 1,
      type: 'system',
      content: 'Welcome to QueenDahyun AI! How can I assist you today?',
      timestamp: new Date(Date.now() - 300000)
    }
  ]);

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

  const handleSendMessage = () => {
    if (message.trim()) {
      // In actual implementation, this would send the message to your AI API
      console.log('Message sent:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDownloadRedirect = () => {
    window.location.href = '/home#download';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-cyan-400 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-2xl gradient-text-flow">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{customStyles}</style>
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <FloatingParticles />
        
        {/* Main Layout */}
        <div className="flex h-screen relative z-10">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="chat-container border-b border-purple-500/20 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="text-cyan-400" size={24} />
                  <h1 className="text-xl font-bold gradient-text-flow">QueenDahyun AI Assistant</h1>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-400">Server Mode: Offline</span>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 chat-container overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Service Unavailable Message */}
                <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-2xl p-8 text-center backdrop-blur-xl">
                  <div className="flex justify-center mb-4">
                    <Globe className="text-cyan-400" size={48} />
                  </div>
                  <h2 className="text-2xl font-bold gradient-text-flow mb-4">
                    Web-Based AI Service Coming Soon
                  </h2>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    Our cloud-based AI assistant with remote desktop environment is currently under development. 
                    Experience the power of QueenDahyun AI locally with our desktop application, available now 
                    for immediate download and use.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                      onClick={handleDownloadRedirect}
                      className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-cyan-600 px-6 py-3 rounded-full hover:from-purple-500 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 glow-border"
                    >
                      <Download size={20} />
                      <span>Download Desktop App</span>
                    </button>
                    <div className="flex items-center space-x-2 text-cyan-400">
                      <Monitor size={20} />
                      <span>Available for Windows</span>
                    </div>
                  </div>
                </div>

                {/* System Messages */}
                {messages.map((msg) => (
                  <div key={msg.id} className="flex justify-start">
                    <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/30 rounded-2xl px-6 py-4 max-w-2xl backdrop-blur-md">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Zap size={16} className="text-white" />
                        </div>
                        <div>
                          <p className="text-gray-200 leading-relaxed">{msg.content}</p>
                          <span className="text-xs text-gray-500 mt-2 block">
                            {msg.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="chat-container border-t border-purple-500/20 p-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex space-x-4">
                  <div className="flex-1 relative">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={true}
                      placeholder="Web interface coming soon... Use our desktop app for AI assistance"
                      className="message-input w-full px-4 py-3 rounded-2xl text-white placeholder-gray-500 resize-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      rows={1}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={true}
                    className="send-button p-3 rounded-2xl text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <Send size={20} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Desktop application provides full AI capabilities locally on your computer
                </p>
              </div>
            </div>
          </div>

          {/* User Sidebar */}
          <div className="w-80 user-sidebar flex flex-col">
            {/* User Profile Section */}
            <div className="p-6 border-b border-cyan-500/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <User className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    {userData?.first_name || 'Loading...'}
                  </h3>
                  <p className="text-sm text-gray-400">{userData?.email || 'Loading...'}</p>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Stats/Info Section */}
            <div className="flex-1 p-6">
              <div className="space-y-4">
                <div className="bg-black/30 border border-purple-500/20 rounded-xl p-4 backdrop-blur-md">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Service Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Web Service:</span>
                      <span className="text-red-400">Offline</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Desktop App:</span>
                      <span className="text-green-400">Available</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black/30 border border-cyan-500/20 rounded-xl p-4 backdrop-blur-md">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Quick Actions</h4>
                  <button
                    onClick={handleDownloadRedirect}
                    className="w-full bg-gradient-to-r from-purple-600/50 to-cyan-600/50 border border-purple-500/30 rounded-lg py-2 px-3 text-sm text-white hover:from-purple-600/70 hover:to-cyan-600/70 transition-all duration-300 mb-2"
                  >
                    Download Desktop App
                  </button>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <div className="p-6 border-t border-gray-700/50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 bg-red-600/20 border border-red-500/30 text-red-300 py-2 px-4 rounded-lg hover:bg-red-600/30 hover:border-red-500/50 transition-all duration-300 text-sm"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPage;