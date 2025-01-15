import React, { useState } from 'react';
import { Download, Menu, X } from 'lucide-react';
import dahyunImage from './dahyun.png';
import robotImage from './robot.png';
import './App.css';

const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const blueColor = 'rgb(81, 211, 218)';

  const handleGetStarted = () => {
    window.open('/signup', '_blank');
  };

  const handleDownload = () => {
    window.location.href = 'https://huggingface.co/dahwinsingularity/fluxfp8/resolve/main/queendahyun.zip';
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Gradient Animation Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-purple-800 to-pink-700 animate-gradient-x"></div>
        <div className="absolute inset-0 bg-black opacity-75"></div>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg fixed w-full z-20">
          <nav className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold animate-pulse" style={{ color: blueColor }}>QueenDahyun</div>
              <div className="hidden md:flex space-x-6">
                <a href="#home" className="hover:text-blue-400 transition duration-300">Home</a>
                <a href="#features" className="hover:text-blue-400 transition duration-300">Features</a>
                <a href="#product" className="hover:text-blue-400 transition duration-300">Product</a>
                <a href="#download" className="hover:text-blue-400 transition duration-300">Download</a>
                <a href="#clients" className="hover:text-blue-400 transition duration-300">Clients</a>
                <a href="/about" className="hover:text-blue-400 transition duration-300">About Us</a>
              </div>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </nav>
          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-black bg-opacity-95 backdrop-filter backdrop-blur-lg">
              <a href="#home" className="block py-2 px-4 hover:bg-blue-900">Home</a>
              <a href="#features" className="block py-2 px-4 hover:bg-blue-900">Features</a>
              <a href="#product" className="block py-2 px-4 hover:bg-blue-900">Product</a>
              <a href="#download" className="block py-2 px-4 hover:bg-blue-900">Download</a>
              <a href="#clients" className="block py-2 px-4 hover:bg-blue-900">Clients</a>
              <a href="/about" className="block py-2 px-4 hover:bg-blue-900">About Us</a>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section id="home" className="pt-24 pb-32">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-6xl font-bold mb-4 animate-gradient-text">
              The State Of The Art
            </h1>
            <div className="flex justify-center items-center mb-8">
              <p className="text-2xl typewriter" style={{ color: blueColor }}>
                <span>Autonomous AI Agent: QueenDahyun</span>
              </p>
            </div>
            <button 
              onClick={handleGetStarted}
              className="text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-opacity-80 transition duration-300 transform hover:scale-105 animate-gradient-button"
            >
              Get Started : SingIn
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12 animate-gradient-text">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="bg-gradient-to-br from-blue-900 to-black p-8 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
                <h3 className="text-2xl font-semibold mb-4" style={{ color: blueColor }}>100% Secured</h3>
                <p className="text-gray-300">Shielding Progress, Safeguarding Future: Your AI Security Partner</p>
              </div>
              <div className="bg-gradient-to-br from-blue-900 to-black p-8 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
                <h3 className="text-2xl font-semibold mb-4" style={{ color: blueColor }}>Our Vision</h3>
                <p className="text-gray-300">Revolutionizing Work, Redefining Play: AI Excellence for Every Day.</p>
              </div>
              <div className="bg-gradient-to-br from-blue-900 to-black p-8 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
                <h3 className="text-2xl font-semibold mb-4" style={{ color: blueColor }}>Your Journey</h3>
                <p className="text-gray-300">Unleash the power of the most groundbreaking software ever created!</p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Section */}
        <section id="product" className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12 animate-gradient-text">Product</h2>
            <div className="bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg p-8 rounded-lg shadow-xl">
              <div className="flex flex-col md:flex-row items-center mb-6">
                <img src={dahyunImage} alt="Kim Dahyun" className="w-45 h-60 rounded-full mb-4 md:mb-0 md:mr-6" />
                <p className="text-2xl typewriter" style={{ color: blueColor }}>
                  <span>QueenDahyun: A Affection to Inspiration in Innovation</span>
                </p>
              </div>
              <p className="mb-8 text-gray-300 leading-relaxed">
                QueenDahyun is a sophisticated autonomous computer program equipped with an extensive software library. 
                Possessing advanced capabilities in natural language processing, vision, and audio, it can perform a wide 
                range of tasks on a computer with unparalleled efficiency and versatility.
              </p>
              <div className="bg-gradient-to-br from-blue-900 to-purple-900 p-6 rounded-lg mb-8 animate-gradient-bg">
                <p className="text-gray-200 leading-relaxed">
                  In the genesis of our startup, MD, our esteemed founder and chief scientist, discovered profound inspiration in Kim Dahyun, an illustrious member of the acclaimed girl group TWICE. Professing Dahyun as his dearest and most significant muse. Driven by an enduring affection, he christened his creations with Dahyun's name, a gesture reflecting her remarkable personality. The program, meticulously designed, embodies the essence of Dahyun, although certain elements, constrained by security, remain undisclosed. To MD, Dahyun is the reigning queen, a sentiment he ardently professes, declaring his love for her surpasses even the value of his own life. "Queendahyun" stands as a testament to a harmonious blend of love and innovation, an ode to the captivating spirit of Kim Dahyun.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Download Section */}
        <section id="download" className="py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-12 animate-gradient-text">Download</h2>
            <div className="bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg p-8 rounded-lg shadow-xl">
              <button 
                onClick={handleDownload}
                className="text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-opacity-80 transition duration-300 flex items-center justify-center mx-auto mb-6 animate-gradient-button"
              >
                <Download className="mr-2" />
                Download For Windows
              </button>
              <p className="text-lg animate-pulse" style={{ color: blueColor }}>Coming Soon In Aug 2024</p>
            </div>
          </div>
        </section>

        {/* Clients Section */}
        <section id="clients" className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12 animate-gradient-text">What People Say About Us</h2>
            <div className="bg-gradient-to-br from-blue-900 to-purple-900 p-8 rounded-lg shadow-xl animate-gradient-bg">
              <p className="text-xl italic text-gray-300 leading-relaxed">
                "Our revolutionary AI software, generously offered for free testing, empowers users to experience 
                transformative capabilities locally. We extend heartfelt thanks to early adopters for shaping the 
                future with valuable feedback. Anticipate a paradigm shift in task execution, as our software integrates 
                NLP, vision, and audio seamlessly, ushering in a new era of innovation."
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black bg-opacity-75 py-12">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <h3 className="text-xl font-semibold mb-4 animate-gradient-text">Useful Links</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-blue-400 transition duration-300">Content</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-blue-400 transition duration-300">How it Works</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-blue-400 transition duration-300">Create</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-blue-400 transition duration-300">Explore</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-blue-400 transition duration-300">Terms & Services</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 animate-gradient-text">Community</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-blue-400 transition duration-300">Help Center</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-blue-400 transition duration-300">Partners</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-blue-400 transition duration-300">Suggestions</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-blue-400 transition duration-300">Blog</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-blue-400 transition duration-300">Newsletters</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 animate-gradient-text">Partner</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-blue-400 transition duration-300">Our Partner</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-blue-400 transition duration-300">Become a Partner</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-blue-900 mt-12 pt-8 text-sm text-center text-gray-400">
              Copyright © 2024 QueenDahyun. All Rights Reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;