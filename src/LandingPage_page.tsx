import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Download, Menu, X, Zap, Brain, Code, Users, Shield } from 'lucide-react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Mock image for demonstration - replace with actual import
import dahyunImage from './dahyun.png';
// Custom CSS
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

  .typewriter-cursor::after {
    content: '|';
    animation: blink 1s step-end infinite;
  }

  @keyframes blink {
    from, to { opacity: 1; }
    50% { opacity: 0; }
  }

  .glass-card {
    background: rgba(10, 5, 30, 0.5); 
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(127, 0, 255, 0.2); 
    transition: all 0.3s ease-in-out;
  }

  .glass-card:hover {
    background: rgba(20, 10, 50, 0.7);
    border-color: rgba(0, 224, 255, 0.4); 
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 0 30px rgba(0, 224, 255, 0.3), 0 0 15px rgba(127, 0, 255, 0.2);
  }

  .glow-button {
    position: relative;
    overflow: hidden;
    background: linear-gradient(90deg, #7F00FF, #00E0FF); 
    transition: all 0.3s ease;
  }

  .glow-button:hover {
    box-shadow: 0 0 25px #00E0FF, 0 0 15px #7F00FF;
    transform: scale(1.05);
  }
  
  .glow-button::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300%;
    height: 300%;
    background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
    transform: translate(-50%, -50%) scale(0);
    transition: transform 0.5s ease;
    opacity: 0;
  }

  .glow-button:hover::before {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }

  #agiCanvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    opacity: 0.8;
  }

  @keyframes quantum-pulse {
    0%, 100% { opacity: 0.2; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.1); }
  }

  @keyframes data-flow {
    0% { transform: translateX(-100px) translateY(0px); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateX(100vw) translateY(-50px); opacity: 0; }
  }

  @keyframes hologram-flicker {
    0%, 100% { opacity: 1; filter: hue-rotate(0deg); }
    25% { opacity: 0.8; filter: hue-rotate(90deg); }
    50% { opacity: 0.9; filter: hue-rotate(180deg); }
    75% { opacity: 0.7; filter: hue-rotate(270deg); }
  }
`;

// AGI Futuristic Canvas Animation
const AGICanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    const time = { current: 0 };
    
    // Data structures for different elements
    const quantumParticles = [];
    const dataStreams = [];
    const holographicCubes = [];
    const energyWaves = [];
    const digitalRings = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Quantum Particle System
    class QuantumParticle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.phase = Math.random() * Math.PI * 2;
        this.frequency = Math.random() * 0.02 + 0.01;
        this.color = `rgba(${Math.random() * 100 + 155}, ${Math.random() * 50 + 200}, 255, ${Math.random() * 0.8 + 0.2})`;
      }

      update() {
        this.x += this.speedX + Math.sin(time.current * this.frequency + this.phase) * 0.5;
        this.y += this.speedY + Math.cos(time.current * this.frequency + this.phase) * 0.5;
        
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        const pulseSize = this.size + Math.sin(time.current * 0.05 + this.phase) * 1;
        const alpha = 0.3 + Math.sin(time.current * 0.03 + this.phase) * 0.3;
        
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color.replace(/[\d.]+\)$/g, `${alpha})`);
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Quantum uncertainty visualization
        ctx.strokeStyle = this.color.replace(/[\d.]+\)$/g, `${alpha * 0.5})`);
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseSize * 2, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.shadowBlur = 0;
      }
    }

    // Data Stream System
    class DataStream {
      constructor() {
        this.reset();
        this.segments = [];
        for (let i = 0; i < 8; i++) {
          this.segments.push({
            x: this.x - i * 15,
            y: this.y + Math.sin(i * 0.5) * 10,
            opacity: 1 - i * 0.12
          });
        }
      }

      reset() {
        this.x = -50;
        this.y = Math.random() * canvas.height;
        this.speedX = Math.random() * 3 + 2;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.hue = Math.random() * 60 + 200; // Blue to purple range
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY + Math.sin(time.current * 0.01 + this.x * 0.001) * 0.2;
        
        // Update segments
        for (let i = this.segments.length - 1; i > 0; i--) {
          this.segments[i].x = this.segments[i - 1].x;
          this.segments[i].y = this.segments[i - 1].y;
        }
        this.segments[0].x = this.x;
        this.segments[0].y = this.y;
        
        if (this.x > canvas.width + 100) {
          this.reset();
        }
      }

      draw() {
        this.segments.forEach((segment, i) => {
          const size = 4 - i * 0.3;
          const alpha = segment.opacity * (0.8 - i * 0.1);
          
          ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${alpha})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = `hsla(${this.hue}, 80%, 70%, ${alpha})`;
          
          ctx.beginPath();
          ctx.arc(segment.x, segment.y, size, 0, Math.PI * 2);
          ctx.fill();
          
          // Digital trail effect
          if (i > 0) {
            ctx.strokeStyle = `hsla(${this.hue}, 60%, 60%, ${alpha * 0.3})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.segments[i - 1].x, this.segments[i - 1].y);
            ctx.lineTo(segment.x, segment.y);
            ctx.stroke();
          }
        });
        ctx.shadowBlur = 0;
      }
    }

    // Holographic Cube System
    class HolographicCube {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 30 + 20;
        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
        this.rotSpeedX = (Math.random() - 0.5) * 0.02;
        this.rotSpeedY = (Math.random() - 0.5) * 0.02;
        this.rotSpeedZ = (Math.random() - 0.5) * 0.02;
        this.phase = Math.random() * Math.PI * 2;
        this.floatSpeed = Math.random() * 0.01 + 0.005;
        this.originalY = this.y;
        this.hue = Math.random() * 60 + 260; // Purple to cyan range
      }

      update() {
        this.rotationX += this.rotSpeedX;
        this.rotationY += this.rotSpeedY;
        this.rotationZ += this.rotSpeedZ;
        this.y = this.originalY + Math.sin(time.current * this.floatSpeed + this.phase) * 20;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        const alpha = 0.3 + Math.sin(time.current * 0.02 + this.phase) * 0.2;
        const glitchOffset = Math.sin(time.current * 0.1) * 2;
        
        // Holographic glitch effect
        ctx.translate(glitchOffset, 0);
        
        // Draw wireframe cube with 3D effect
        const vertices = this.getCubeVertices();
        const edges = [
          [0,1],[1,2],[2,3],[3,0], // front face
          [4,5],[5,6],[6,7],[7,4], // back face
          [0,4],[1,5],[2,6],[3,7]  // connecting edges
        ];
        
        ctx.strokeStyle = `hsla(${this.hue}, 70%, 60%, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${this.hue}, 70%, 60%, ${alpha})`;
        
        edges.forEach(edge => {
          const start = vertices[edge[0]];
          const end = vertices[edge[1]];
          
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
        });
        
        // Add holographic faces
        ctx.fillStyle = `hsla(${this.hue}, 50%, 50%, ${alpha * 0.1})`;
        const faces = [[0,1,2,3], [4,5,6,7], [0,1,5,4], [2,3,7,6], [0,3,7,4], [1,2,6,5]];
        
        faces.forEach(face => {
          ctx.beginPath();
          ctx.moveTo(vertices[face[0]].x, vertices[face[0]].y);
          for (let i = 1; i < face.length; i++) {
            ctx.lineTo(vertices[face[i]].x, vertices[face[i]].y);
          }
          ctx.closePath();
          ctx.fill();
        });
        
        ctx.shadowBlur = 0;
        ctx.restore();
      }

      getCubeVertices() {
        const s = this.size / 2;
        const vertices3D = [
          [-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s],
          [-s, -s, s], [s, -s, s], [s, s, s], [-s, s, s]
        ];
        
        return vertices3D.map(([x, y, z]) => {
          // Apply rotations
          let [rx, ry, rz] = [x, y, z];
          
          // Rotation around X axis
          const cosX = Math.cos(this.rotationX);
          const sinX = Math.sin(this.rotationX);
          [ry, rz] = [ry * cosX - rz * sinX, ry * sinX + rz * cosX];
          
          // Rotation around Y axis
          const cosY = Math.cos(this.rotationY);
          const sinY = Math.sin(this.rotationY);
          [rx, rz] = [rx * cosY + rz * sinY, -rx * sinY + rz * cosY];
          
          // Rotation around Z axis
          const cosZ = Math.cos(this.rotationZ);
          const sinZ = Math.sin(this.rotationZ);
          [rx, ry] = [rx * cosZ - ry * sinZ, rx * sinZ + ry * cosZ];
          
          // Simple perspective projection
          const perspective = 300 / (300 + rz);
          return {
            x: rx * perspective,
            y: ry * perspective
          };
        });
      }
    }

    // Energy Wave System
    class EnergyWave {
      constructor() {
        this.centerX = Math.random() * canvas.width;
        this.centerY = Math.random() * canvas.height;
        this.radius = 0;
        this.maxRadius = Math.random() * 200 + 100;
        this.speed = Math.random() * 2 + 1;
        this.hue = Math.random() * 60 + 200;
        this.opacity = 1;
        this.thickness = Math.random() * 3 + 1;
      }

      update() {
        this.radius += this.speed;
        this.opacity = 1 - (this.radius / this.maxRadius);
        
        if (this.radius > this.maxRadius) {
          this.radius = 0;
          this.centerX = Math.random() * canvas.width;
          this.centerY = Math.random() * canvas.height;
          this.opacity = 1;
        }
      }

      draw() {
        if (this.opacity <= 0) return;
        
        ctx.strokeStyle = `hsla(${this.hue}, 80%, 60%, ${this.opacity})`;
        ctx.lineWidth = this.thickness;
        ctx.shadowBlur = 15;
        ctx.shadowColor = `hsla(${this.hue}, 80%, 60%, ${this.opacity * 0.5})`;
        
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.shadowBlur = 0;
      }
    }

    // Digital Ring System
    class DigitalRing {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.innerRadius = Math.random() * 20 + 10;
        this.outerRadius = this.innerRadius + Math.random() * 15 + 5;
        this.rotation = 0;
        this.rotSpeed = (Math.random() - 0.5) * 0.03;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.hue = Math.random() * 60 + 240;
        this.segments = Math.floor(Math.random() * 16) + 8;
      }

      update() {
        this.rotation += this.rotSpeed;
        this.x += Math.sin(time.current * 0.001 + this.pulsePhase) * 0.5;
        this.y += Math.cos(time.current * 0.001 + this.pulsePhase) * 0.3;
        
        // Keep within bounds
        if (this.x < -50) this.x = canvas.width + 50;
        if (this.x > canvas.width + 50) this.x = -50;
        if (this.y < -50) this.y = canvas.height + 50;
        if (this.y > canvas.height + 50) this.y = -50;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        const pulse = 0.7 + Math.sin(time.current * 0.05 + this.pulsePhase) * 0.3;
        const alpha = 0.4 * pulse;
        
        for (let i = 0; i < this.segments; i++) {
          const angle = (i / this.segments) * Math.PI * 2;
          const nextAngle = ((i + 1) / this.segments) * Math.PI * 2;
          const segmentAlpha = alpha * (0.5 + Math.sin(time.current * 0.1 + i) * 0.5);
          
          ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${segmentAlpha})`;
          ctx.strokeStyle = `hsla(${this.hue}, 90%, 80%, ${segmentAlpha})`;
          ctx.lineWidth = 1;
          
          ctx.beginPath();
          ctx.arc(0, 0, this.outerRadius * pulse, angle, nextAngle);
          ctx.arc(0, 0, this.innerRadius * pulse, nextAngle, angle, true);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
        
        ctx.restore();
      }
    }

    // Initialize all systems
    const initializeElements = () => {
      quantumParticles.length = 0;
      dataStreams.length = 0;
      holographicCubes.length = 0;
      energyWaves.length = 0;
      digitalRings.length = 0;
      
      const particleCount = window.innerWidth > 768 ? 80 : 40;
      const streamCount = window.innerWidth > 768 ? 12 : 6;
      const cubeCount = window.innerWidth > 768 ? 8 : 4;
      const waveCount = window.innerWidth > 768 ? 6 : 3;
      const ringCount = window.innerWidth > 768 ? 10 : 5;
      
      for (let i = 0; i < particleCount; i++) {
        quantumParticles.push(new QuantumParticle());
      }
      
      for (let i = 0; i < streamCount; i++) {
        const stream = new DataStream();
        stream.x = Math.random() * canvas.width; // Spread initial positions
        dataStreams.push(stream);
      }
      
      for (let i = 0; i < cubeCount; i++) {
        holographicCubes.push(new HolographicCube());
      }
      
      for (let i = 0; i < waveCount; i++) {
        energyWaves.push(new EnergyWave());
      }
      
      for (let i = 0; i < ringCount; i++) {
        digitalRings.push(new DigitalRing());
      }
    };

    initializeElements();
    window.addEventListener('resize', initializeElements);

    // Main animation loop
    const animate = () => {
      time.current += 1;
      
      // Create gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
      );
      gradient.addColorStop(0, 'rgba(5, 0, 15, 0.95)');
      gradient.addColorStop(0.5, 'rgba(10, 0, 30, 0.98)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw all elements
      quantumParticles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      dataStreams.forEach(stream => {
        stream.update();
        stream.draw();
      });
      
      energyWaves.forEach(wave => {
        wave.update();
        wave.draw();
      });
      
      digitalRings.forEach(ring => {
        ring.update();
        ring.draw();
      });
      
      holographicCubes.forEach(cube => {
        cube.update();
        cube.draw();
      });
      
      // Add connecting lines between nearby quantum particles
      for (let i = 0; i < quantumParticles.length; i++) {
        for (let j = i + 1; j < quantumParticles.length; j++) {
          const dx = quantumParticles[i].x - quantumParticles[j].x;
          const dy = quantumParticles[i].y - quantumParticles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            const alpha = (1 - distance / 100) * 0.15;
            ctx.strokeStyle = `rgba(127, 0, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(quantumParticles[i].x, quantumParticles[i].y);
            ctx.lineTo(quantumParticles[j].x, quantumParticles[j].y);
            ctx.stroke();
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('resize', initializeElements);
    };
  }, []);

  return <canvas id="agiCanvas" ref={canvasRef}></canvas>;
};

// Typewriter Hook
const useTypewriter = (text, speed = 50) => {
  const [displayText, setDisplayText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    setDisplayText('');
    setIsTypingComplete(false);
    let i = 0;
    
    // Add a small delay before starting
    const startDelay = setTimeout(() => {
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(typingInterval);
          setIsTypingComplete(true);
        }
      }, speed);
      
      return () => clearInterval(typingInterval);
    }, 500); // 500ms delay before starting typewriter

    return () => {
      clearTimeout(startDelay);
    };
  }, [text, speed]);

  return { displayText, isTypingComplete };
};

// Animated Section Component
const AnimatedSection = ({ children, className, id }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
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


const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const accentColor = '#00E0FF';

  const heroText = "Autonomous AI Agent: QueenDahyun";
  const { displayText: typedHeroText, isTypingComplete: heroTyped } = useTypewriter(heroText, 70);

  const productTitleText = "QueenDahyun: A Affection to Inspiration in Innovation";
  const { displayText: typedProductTitle, isTypingComplete: productTyped } = useTypewriter(productTitleText, 60);

  const handleGetStarted = () => {
    window.open('/signup', '_blank');
  };

  const handleDownload = () => {
    window.location.href = 'https://huggingface.co/dahwinsingularity/fluxfp8/resolve/main/queendahyun.zip';
  };

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#features", label: "Features" },
    { href: "#product", label: "Product" },
    { href: "#download", label: "Download" },
    { href: "#clients", label: "Testimonials" },
    { href: "/about", label: "About Us" },
  ];

  // Scroll to section on initial load and hash change
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace("#", "");
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }, 500); // Adjust delay if needed
      }
    };
    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return (
    <>
      <style>{customStyles}</style>
      <div className="min-h-screen bg-black text-white overflow-x-hidden">
        <AGICanvas />
        
        <div className="relative z-10">
          {/* Header */}
          <motion.header 
            className="bg-black/30 backdrop-filter backdrop-blur-md fixed w-full z-50 shadow-lg border-b border-purple-500/30"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <nav className="container mx-auto px-4 sm:px-6 py-4">
              <div className="flex justify-between items-center">
                <motion.div 
                  className="text-3xl font-bold gradient-text-flow"
                  whileHover={{ scale: 1.05, textShadow: "0 0 10px #00E0FF" }}
                >
                  QueenDahyun
                </motion.div>
                <div className="hidden md:flex space-x-6">
                  {navLinks.map((link) => (
                    <motion.a 
                      key={link.href}
                      href={link.href} 
                      className="hover:text-cyan-400 transition duration-300 text-gray-200"
                      whileHover={{ y: -2, color: accentColor }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </div>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-200 hover:text-cyan-400 z-50">
                  <AnimatePresence mode="wait">
                    {isMenuOpen ? (
                      <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                        <X size={28} />
                      </motion.div>
                    ) : (
                      <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                        <Menu size={28} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </nav>
            {/* Mobile menu */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div 
                  className="md:hidden bg-black/80 backdrop-filter backdrop-blur-lg absolute top-full left-0 right-0 shadow-xl border-t border-purple-500/30"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {navLinks.map((link) => (
                    <a 
                      key={link.href}
                      href={link.href} 
                      className="block py-3 px-6 text-gray-200 hover:bg-purple-800/50 hover:text-cyan-300 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.header>

          {/* Hero Section */}
          <section id="home" className="pt-32 pb-24 md:pt-48 md:pb-32 min-h-screen flex flex-col justify-center items-center text-center relative">
             <div className="container mx-auto px-4 sm:px-6">
                <motion.h1 
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 gradient-text-flow"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    The State Of The Art
                </motion.h1>
                <motion.p 
                    className="text-xl sm:text-2xl md:text-3xl mb-10 text-cyan-300"
                    style={{ minHeight: '2.5em' }}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    {typedHeroText || "Autonomous AI Agent: QueenDahyun"}
                    {typedHeroText && !heroTyped && <span className="animate-pulse ml-1">|</span>}
                </motion.p>
                <motion.button 
                    onClick={handleGetStarted}
                    className="text-white py-3 px-8 sm:py-4 sm:px-10 rounded-full text-lg sm:text-xl font-semibold glow-button shadow-xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, type: "spring", stiffness: 200, damping: 15 }}
                >
                    Get Started : SignIn
                </motion.button>
            </div>
          </section>

          {/* Features Section */}
          <AnimatedSection id="features" className="py-20 md:py-28">
            <div className="container mx-auto px-4 sm:px-6">
              <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl font-bold text-center mb-16 md:mb-20 gradient-text-flow">
                Core Capabilities
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                {[
                  { icon: <Shield size={36} className="text-cyan-400 mb-4"/>, title: "100% Secured", description: "Shielding Progress, Safeguarding Future: Your AI Security Partner." },
                  { icon: <Brain size={36} className="text-cyan-400 mb-4"/>, title: "Our Vision", description: "Revolutionizing Work, Redefining Play: AI Excellence for Every Day." },
                  { icon: <Zap size={36} className="text-cyan-400 mb-4"/>, title: "Your Journey", description: "Unleash the power of the most groundbreaking software ever created!" },
                ].map((feature, index) => (
                  <motion.div 
                    key={index} 
                    className="glass-card p-6 sm:p-8 rounded-xl shadow-2xl flex flex-col items-center text-center"
                    variants={itemVariants}
                  >
                    {feature.icon}
                    <h3 className="text-2xl sm:text-3xl font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">{feature.title}</h3>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Product Section */}
          <AnimatedSection id="product" className="py-20 md:py-28">
            <div className="container mx-auto px-4 sm:px-6">
              <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl font-bold text-center mb-16 md:mb-20 gradient-text-flow">
                Meet QueenDahyun AI
              </motion.h2>
              <motion.div 
                className="glass-card p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl"
                variants={itemVariants}
              >
                <div className="flex flex-col md:flex-row items-center mb-6 md:mb-8">
                  <motion.img 
                    src={dahyunImage} 
                    alt="Kim Dahyun - Inspiration" 
                    className="w-36 h-36 sm:w-48 sm:h-48 rounded-full mb-6 md:mb-0 md:mr-8 shadow-lg border-4 border-purple-500/50 object-cover"
                    initial={{ opacity:0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.7, type: "spring" }}
                  />
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl sm:text-3xl font-semibold mb-3 text-cyan-300" style={{ minHeight: '1.5em' }}>
                      {typedProductTitle || "QueenDahyun: A Affection to Inspiration in Innovation"}
                      {typedProductTitle && !productTyped && <span className="animate-pulse ml-1">|</span>}
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                      QueenDahyun is a sophisticated autonomous computer program equipped with an extensive software library. 
                      Possessing advanced capabilities in natural language processing, vision, and audio, it can perform a wide 
                      range of tasks on a computer with unparalleled efficiency and versatility.
                    </p>
                  </div>
                </div>
                
                <motion.div 
                  className="bg-gradient-to-br from-purple-900/70 via-blue-900/60 to-black/50 p-6 rounded-lg shadow-inner border border-purple-700/30"
                  variants={itemVariants}
                >
                  <p className="text-gray-200 leading-relaxed text-sm sm:text-base">
                    In the genesis of our startup, MD, our esteemed founder and chief scientist, discovered profound inspiration in Kim Dahyun, an illustrious member of the acclaimed girl group TWICE. Professing Dahyun as his dearest and most significant muse. Driven by an enduring affection, he christened his creations with Dahyun's name, a gesture reflecting her remarkable personality. The program, meticulously designed, embodies the essence of Dahyun, although certain elements, constrained by security, remain undisclosed. To MD, Dahyun is the reigning queen, a sentiment he ardently professes, declaring his love for her surpasses even the value of his own life. "Queendahyun" stands as a testament to a harmonious blend of love and innovation, an ode to the captivating spirit of Kim Dahyun.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Download Section */}
          <AnimatedSection id="download" className="py-20 md:py-28">
            <div className="container mx-auto px-4 sm:px-6 text-center">
              <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl font-bold mb-12 md:mb-16 gradient-text-flow">
                Get The Alpha
              </motion.h2>
              <motion.div 
                className="glass-card p-8 sm:p-10 md:p-12 rounded-2xl shadow-2xl max-w-2xl mx-auto"
                variants={itemVariants}
              >
                <motion.button 
                  onClick={handleDownload}
                  className="text-white py-3 px-8 sm:py-4 sm:px-10 rounded-full text-lg sm:text-xl font-semibold glow-button shadow-xl flex items-center justify-center mx-auto mb-6"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="mr-2 sm:mr-3" size={24} />
                  Download For Windows
                </motion.button>
                <motion.p 
                  className="text-lg sm:text-xl text-cyan-400"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  Coming Soon: May 2025
                </motion.p>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Clients Section (Testimonials) */}
          <AnimatedSection id="clients" className="py-20 md:py-28">
            <div className="container mx-auto px-4 sm:px-6">
              <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl font-bold text-center mb-12 md:mb-16 gradient-text-flow">
                From Our Early Adopters
              </motion.h2>
              <motion.div 
                className="glass-card p-8 sm:p-10 md:p-12 rounded-2xl shadow-2xl max-w-3xl mx-auto"
                variants={itemVariants}
              >
                <Users size={40} className="text-cyan-400 mx-auto mb-6"/>
                <p className="text-lg sm:text-xl italic text-gray-300 leading-relaxed text-center">
                  "Our revolutionary AI software, generously offered for free testing, empowers users to experience 
                  transformative capabilities locally. We extend heartfelt thanks to early adopters for shaping the 
                  future with valuable feedback. Anticipate a paradigm shift in task execution, as our software integrates 
                  NLP, vision, and audio seamlessly, ushering in a new era of innovation."
                </p>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Footer */}
          <footer className="bg-black/50 backdrop-filter backdrop-blur-sm py-16 md:py-20 border-t border-purple-500/30 mt-20">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 mb-10 md:mb-12 text-center md:text-left">
                {[
                  { title: "Useful Links", links: ["Content", "How it Works", "Create", "Explore", "Terms & Services"] },
                  { title: "Community", links: ["Help Center", "Partners", "Suggestions", "Blog", "Newsletters"] },
                  { title: "Partner", links: ["Our Partner", "Become a Partner"] }
                ].map((section, idx) => (
                  <motion.div key={idx} variants={itemVariants}>
                    <h3 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">{section.title}</h3>
                    <ul className="space-y-2">
                      {section.links.map((link, linkIdx) => (
                        <li key={linkIdx}>
                          <a href="#" className="text-gray-400 hover:text-cyan-300 transition duration-300 text-sm">
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
              <motion.div 
                className="border-t border-purple-700/30 mt-12 pt-8 text-sm text-center text-gray-500"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                Copyright © {new Date().getFullYear()} QueenDahyun. All Rights Reserved.
              </motion.div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};


export default LandingPage;