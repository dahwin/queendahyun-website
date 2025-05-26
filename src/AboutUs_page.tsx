import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Briefcase, Mail, Building, BarChart, Target, Linkedin, Github } from 'lucide-react'; // Ensured Linkedin, Github are here

// Assume founderImage is correctly imported
import founderImage from './ceo_pic.jpg'; // MAKE SURE THIS PATH IS CORRECT

// --- Re-usable components and styles (Ideally import from shared files) ---

// Mock AGICanvas for this example if not importing
// If you have AGICanvas as a separate component, import it:
// import AGICanvas from './AGICanvas'; // or wherever it's located
const AGICanvas = () => {
  // This is a placeholder. For the full effect, you'd use the
  // complex AGICanvas component from your LandingPage_page.tsx
  // or ensure its styles are globally available and it's rendered.
  return (
    <div
      id="agiCanvas" // Ensure CSS for #agiCanvas is applied
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        // A simplified gradient if the full canvas isn't running
        background: 'linear-gradient(45deg, #020010, #05001A, #080026, #05001A, #020010)',
        animation: 'gradientBackgroundAnimation 15s ease infinite',
        opacity: 0.7, // Adjust opacity as needed
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


const customStyles = `
  .gradient-text-flow {
    background: linear-gradient(90deg, 
      #BF00FF, /* Bright Purple */
      #00E0FF, /* Bright Cyan */
      #7F00FF, /* Deep Purple */
      #BF00FF  /* Bright Purple again for smooth loop */
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

  .glass-card {
    background: rgba(10, 5, 30, 0.65); /* Slightly more opaque for readability */
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 1px solid rgba(127, 0, 255, 0.25); /* Purple border */
    transition: all 0.3s ease-in-out;
  }

  .glass-card:hover {
    background: rgba(20, 10, 50, 0.75);
    border-color: rgba(0, 224, 255, 0.45); /* Cyan border on hover */
    transform: translateY(-6px) scale(1.015); /* More pronounced hover */
    box-shadow: 0 0 30px rgba(0, 224, 255, 0.25), 0 0 15px rgba(127, 0, 255, 0.2);
  }

  /* Ensure #agiCanvas styles from LandingPage_page.tsx are also available if using the full canvas */
  /* The inline style for AGICanvas component above handles its basic fixed positioning */
`;


const AnimatedSection: React.FC<{ children: React.ReactNode; className?: string; id?: string }> = ({ children, className, id }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  React.useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.section
      id={id}
      ref={ref}
      className={className}
      initial="hidden"
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 } },
        hidden: { opacity: 0, y: 50 },
      }}
    >
      {children}
    </motion.section>
  );
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// --- End of Re-usable components ---

const AboutUsPage: React.FC = () => {
  return (
    <>
      <style>{customStyles}</style>
      <div className="min-h-screen bg-black text-white overflow-x-hidden">
        <AGICanvas /> {/* This renders the animated background */}

        <div className="relative z-10">
          {/* Optional: Add a similar header to LandingPage if needed */}
          {/* <header className="bg-black/30 backdrop-filter backdrop-blur-md fixed w-full z-50 shadow-lg border-b border-purple-500/30"> ... </header> */}
          
          <div className="pt-24 pb-16 md:pt-32 md:pb-24"> {/* Adjust padding if you have a fixed header */}
            
            <AnimatedSection className="container mx-auto px-4 sm:px-6 mb-16 md:mb-24">
              <motion.h1 
                variants={itemVariants} 
                className="text-5xl sm:text-6xl font-black text-center mb-6 gradient-text-flow"
              >
                About QueenDahyun
              </motion.h1>
              <motion.p 
                variants={itemVariants} 
                className="text-xl sm:text-2xl text-cyan-300 text-center max-w-3xl mx-auto"
              >
                Pioneering the future of autonomous AI with inspiration, dedication, and cutting-edge technology.
              </motion.p>
            </AnimatedSection>

            {/* Founder Section */}
            <AnimatedSection id="founder" className="container mx-auto px-4 sm:px-6 mb-16 md:mb-24">
              <motion.h2 
                variants={itemVariants} 
                className="text-4xl sm:text-5xl font-bold text-center mb-12 md:mb-16 gradient-text-flow"
              >
                Meet Our Visionary
              </motion.h2>
              <motion.div 
                variants={itemVariants}
                className="glass-card p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl max-w-4xl mx-auto"
              >
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                  <motion.div 
                    className="md:w-1/3 flex-shrink-0"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.7, type: "spring" }}
                  >
                    <img
                      src={founderImage}
                      alt="MD Sofiullah, Founder of QueenDahyun"
                      className="rounded-full w-48 h-48 sm:w-60 sm:h-60 object-cover mx-auto md:mx-0 border-4 border-purple-500/70 shadow-xl"
                    />
                  </motion.div>
                  <div className="md:w-2/3 text-center md:text-left">
                    <motion.h3 variants={itemVariants} className="text-3xl sm:text-4xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                      MD Sofiullah
                    </motion.h3>
                    <motion.p variants={itemVariants} className="text-lg text-cyan-400 mb-4">
                      Founder & Chief Scientist
                    </motion.p>
                    <motion.p variants={itemVariants} className="text-gray-300 leading-relaxed mb-6 text-sm sm:text-base">
                      MD is a visionary entrepreneur and AI researcher who founded QueenDahyun
                      with the mission to revolutionize autonomous AI systems. Inspired by TWICE's
                      Kim Dahyun, he has dedicated his career to developing AI that combines
                      technical excellence with human-like understanding and interaction capabilities.
                    </motion.p>
                    <motion.div variants={itemVariants} className="space-y-3 text-sm sm:text-base">
                      {/* Email Link */}
                      <div className="flex items-center justify-center md:justify-start">
                        <Mail size={18} className="mr-3 text-cyan-400 flex-shrink-0" />
                        <a href="mailto:md.sofiullah@queendahyun.site" className="text-gray-300 hover:text-cyan-300 transition-colors break-all">
                          md.sofiullah@queendahyun.site
                        </a>
                      </div>
                      {/* Upwork Profile Link */}
                      <div className="flex items-center justify-center md:justify-start">
                        <Briefcase size={18} className="mr-3 text-cyan-400 flex-shrink-0" />
                        <a 
                          href="https://www.upwork.com/freelancers/~01f7c399507b33e9fc" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gray-300 hover:text-cyan-300 transition-colors break-all"
                        >
                          Upwork Profile
                        </a>
                      </div>
                      {/* LinkedIn Profile Link - THIS IS WHERE IT'S ADDED */}
                      <div className="flex items-center justify-center md:justify-start">
                        <Linkedin size={18} className="mr-3 text-cyan-400 flex-shrink-0" />
                        <a 
                          href="https://www.linkedin.com/in/md-sofiullah-us/" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gray-300 hover:text-cyan-300 transition-colors break-all"
                        >
                          LinkedIn Profile
                        </a>
                      </div>
                      {/* GitHub Profile Link - THIS IS WHERE IT'S ADDED */}
                      <div className="flex items-center justify-center md:justify-start">
                        <Github size={18} className="mr-3 text-cyan-400 flex-shrink-0" />
                        <a 
                          href="https://github.com/dahwin" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gray-300 hover:text-cyan-300 transition-colors break-all"
                        >
                          GitHub Profile
                        </a>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>

            {/* Our Story Section */}
            <AnimatedSection id="story" className="container mx-auto px-4 sm:px-6 mb-16 md:mb-24">
              <motion.h2 
                variants={itemVariants} 
                className="text-4xl sm:text-5xl font-bold text-center mb-12 md:mb-16 gradient-text-flow"
              >
                Our Genesis
              </motion.h2>
              <motion.div 
                variants={itemVariants}
                className="glass-card p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl max-w-3xl mx-auto"
              >
                <div className="flex justify-center mb-6">
                    <Building size={40} className="text-cyan-400"/>
                </div>
                <motion.h3 variants={itemVariants} className="text-2xl sm:text-3xl font-semibold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  The Spark of Innovation
                </motion.h3>
                <motion.p variants={itemVariants} className="text-gray-300 leading-relaxed text-center md:text-left text-sm sm:text-base">
                  Founded in 2024, QueenDahyun emerged from MD's groundbreaking research
                  in autonomous AI systems. The company's name and vision were profoundly
                  inspired by Kim Dahyun from the iconic group TWICE. Her remarkable qualities
                  of intelligence, versatility, and captivating charisma resonated deeply with
                  the aspirational characteristics intended for our AI. QueenDahyun is more
                  than a name; it's a tribute to the muse that fuels our pursuit of excellence
                  in artificial intelligence.
                </motion.p>
              </motion.div>
            </AnimatedSection>

            {/* Mission and Vision Section */}
            <AnimatedSection id="mission-vision" className="container mx-auto px-4 sm:px-6 mb-16 md:mb-24"> {/* Added bottom margin */}
              <motion.h2 
                variants={itemVariants} 
                className="text-4xl sm:text-5xl font-bold text-center mb-12 md:mb-16 gradient-text-flow"
              >
                Our Guiding Principles
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <motion.div variants={itemVariants} className="glass-card p-6 sm:p-8 rounded-xl shadow-2xl">
                  <div className="flex items-center mb-4">
                    <Target size={32} className="text-cyan-400 mr-4 flex-shrink-0"/>
                    <h3 className="text-2xl sm:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Our Mission</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    To develop and deploy highly autonomous AI agents that seamlessly integrate with human workflows, enhancing productivity, creativity, and decision-making across diverse domains.
                  </p>
                </motion.div>
                <motion.div variants={itemVariants} className="glass-card p-6 sm:p-8 rounded-xl shadow-2xl">
                  <div className="flex items-center mb-4">
                    <BarChart size={32} className="text-cyan-400 mr-4 flex-shrink-0"/>
                    <h3 className="text-2xl sm:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Our Vision</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    To be at the forefront of the AGI revolution, creating intelligent systems that not only perform tasks but also understand context, learn adaptively, and collaborate intuitively, inspired by the multifaceted brilliance of our namesake.
                  </p>
                </motion.div>
              </div>
            </AnimatedSection>
            
            {/* Optional: Add a similar footer to LandingPage if needed */}
            {/* 
            <footer className="bg-black/50 backdrop-filter backdrop-blur-sm py-12 border-t border-purple-500/30">
              <div className="container mx-auto px-4 sm:px-6 text-center text-gray-500 text-sm">
                Copyright © {new Date().getFullYear()} QueenDahyun. All Rights Reserved.
              </div>
            </footer> 
            */}
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUsPage;