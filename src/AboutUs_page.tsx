import React from 'react';
import founderImage from './ceo_pic.jpg'; // Add your founder's image

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-purple-800 to-pink-700 animate-gradient-x"></div>
        <div className="absolute inset-0 bg-black opacity-75"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold mb-12 animate-gradient-text text-center">About Us</h1>
        
        <div className="bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg p-8 rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold mb-6" style={{ color: 'rgb(81, 211, 218)' }}>Our Founder</h2>
          
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            <div className="md:w-1/3">
              <img 
                src={founderImage} 
                alt="Founder" 
                className="rounded-lg w-full h-auto shadow-lg"
              />
            </div>
            
            <div className="md:w-2/3">
              <h3 className="text-2xl font-semibold mb-4">MD Sofiullah</h3>
              <p className="text-gray-300 mb-4">
                Founder & Scientist at QueenDahyun
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Contact Information:</h4>
                  <p className="text-gray-300">Email: md.sofiullah@queendahyun.site</p>
                  <p className="text-gray-300">upwork: https://www.upwork.com/freelancers/~01f7c399507b33e9fc</p>
                </div>
                
                <div>
                  <h4 className="font-semibold">Bio:</h4>
                  <p className="text-gray-300">
                    MD is a visionary entrepreneur and AI researcher who founded QueenDahyun 
                    with the mission to revolutionize autonomous AI systems. Inspired by TWICE's 
                    Kim Dahyun, he has dedicated his career to developing AI that combines 
                    technical excellence with human-like understanding and interaction capabilities.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-900 to-purple-900 p-6 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4">Company History</h3>
            <p className="text-gray-200 leading-relaxed">
              Founded in 2024, QueenDahyun emerged from MD's groundbreaking research 
              in autonomous AI systems. The company's name and vision were inspired by 
              Kim Dahyun from TWICE, whose qualities of intelligence, versatility, and 
              charisma aligned perfectly with our AI's intended characteristics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 