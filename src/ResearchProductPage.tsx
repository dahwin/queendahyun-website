import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card, // Keep Card for potential internal use if needed, but GlassCard is primary
  CardContent, // Keep for potential internal use
  Button,
  useMediaQuery,
  useTheme,
  Tooltip,
  Dialog, // Import Dialog components
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton, // For close button
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

// Import icons
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import MemoryIcon from '@mui/icons-material/Memory';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ComputerIcon from '@mui/icons-material/Computer';
import TouchAppIcon from '@mui/icons-material/TouchApp'; // Icon for click interaction hint
import CloseIcon from '@mui/icons-material/Close'; // Icon for dialog close

// Custom styled components (Keep all existing styled components as they are)
const GradientBackground = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #000000 0%, #050520 100%)',
  color: 'white',
  minHeight: '100vh',
  overflow: 'hidden',
  position: 'relative',
}));

const GlowingOrb = styled(Box)(({ theme, $size, $color, $top, $left, $blur }) => ({
  position: 'absolute',
  width: $size,
  height: $size,
  borderRadius: '50%',
  background: $color,
  filter: `blur(${$blur}px)`,
  opacity: 0.5,
  top: $top,
  left: $left,
  zIndex: 0,
}));

const ParticleCanvas = styled('canvas')({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 1,
  pointerEvents: 'none',
});

const PageSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  padding: theme.spacing(15, 0),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(8, 0),
  },
}));

// --- Enhanced GlassCard with Animated Background ---
const animatedGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const GlassCard = styled(motion.div)(({ theme }) => ({
  background: 'rgba(10, 10, 30, 0.6)', // Darker base
  backdropFilter: 'blur(12px)',
  borderRadius: theme.spacing(2),
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
  padding: theme.spacing(3),
  height: '100%',
  transition: 'all 0.5s ease',
  overflow: 'hidden',
  position: 'relative', // Needed for pseudo-elements
  '&::before': { // Subtle animated gradient border effect
    content: '""',
    position: 'absolute',
    inset: 0,
    borderRadius: theme.spacing(2),
    padding: '1px',
    background: 'linear-gradient(120deg, rgba(106, 17, 203, 0.3), rgba(37, 117, 252, 0.3), rgba(106, 17, 203, 0.3))',
    backgroundSize: '200% 200%',
    animation: `${animatedGradient} 8s ease infinite`,
    WebkitMask:
      'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    pointerEvents: 'none',
  },
  '&:hover': {
    background: 'rgba(20, 20, 40, 0.7)',
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 45px 0 rgba(31, 38, 135, 0.3)',
  },
}));
// --- End Enhanced GlassCard ---

const GlowingButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
  borderRadius: '50px',
  padding: theme.spacing(1.5, 5),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 60%)',
    transform: 'rotate(30deg)',
    transition: 'all 0.5s ease',
    opacity: 0,
  },
  '&:hover::before': {
    opacity: 1,
    transform: 'rotate(0deg)',
  },
  '&:hover': {
    boxShadow: '0 0 20px rgba(106, 17, 203, 0.8)',
  },
}));

const ProgressBar = styled(motion.div)(({ theme, $percentage, $color }) => ({
  height: '6px',
  width: '100%',
  background: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '10px',
  position: 'relative',
  overflow: 'hidden', // Ensure shadow stays within bounds
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: `${$percentage}%`,
    background: $color || 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
    borderRadius: '10px',
    boxShadow: $color ? `0 0 8px ${$color}` : '0 0 8px rgba(106, 17, 203, 0.8)', // Slightly reduced shadow
  },
}));

const FloatingGrid = styled(Grid)(({ theme }) => ({
  '& > div': {
    marginBottom: theme.spacing(4),
  },
}));

const BenchmarkCard = styled(motion.div)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(5px)',
  borderRadius: theme.spacing(2),
  border: '1px solid rgba(255, 255, 255, 0.05)',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  position: 'relative', // For the line indicator
}));

// --- Chart Specific Styles ---
const pulseAnimation = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 10px var(--glow-color); }
  50% { transform: scale(1.1); box-shadow: 0 0 18px var(--glow-color); }
  100% { transform: scale(1); box-shadow: 0 0 10px var(--glow-color); }
`;

const ChartDataPoint = styled(motion.div)(({ theme, $color }) => ({
  position: 'absolute',
  width: '15px',
  height: '15px',
  borderRadius: '50%',
  background: $color,
  '--glow-color': $color, // CSS variable for glow
  boxShadow: `0 0 10px ${$color}`,
  zIndex: 11, // Above lines
  cursor: 'pointer', // Indicate points are interactive (though whole area is)
  animation: `${pulseAnimation} 2s infinite ease-in-out`,
  transformOrigin: 'center center',
}));

const ChartGridLine = styled(Box)({
  position: 'absolute',
  background: 'rgba(255, 255, 255, 0.1)', // Slightly more visible grid
  boxShadow: '0 0 5px rgba(255, 255, 255, 0.05)', // Subtle glow
});

const ClickIndicator = styled(motion.div)({
    position: 'absolute',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.8)',
    border: '2px solid #fff',
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.7)',
    pointerEvents: 'none', // Don't interfere with clicks
    zIndex: 15, // Above everything
    transform: 'translate(-50%, -50%)' // Center on click point
});

const ValueDisplayBox = styled(motion.div)(({ theme }) => ({
    position: 'absolute',
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(5px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1, 1.5),
    color: 'white',
    fontSize: '0.8rem',
    pointerEvents: 'none',
    zIndex: 16,
    transform: 'translate(-50%, -130%)', // Position above the indicator
    whiteSpace: 'nowrap',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
}));
// --- End Chart Specific Styles ---

// --- Styled Dialog for better theme integration ---
const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        background: 'rgba(15, 15, 35, 0.9)', // Dark, slightly transparent background
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: theme.spacing(2),
        color: 'white',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
    },
    '& .MuiDialogTitle-root': {
        background: 'linear-gradient(90deg, rgba(106, 17, 203, 0.3) 0%, rgba(37, 117, 252, 0.3) 100%)',
        paddingBottom: theme.spacing(1.5),
        paddingTop: theme.spacing(1.5),
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    },
    '& .MuiDialogContentText-root': {
        color: 'rgba(255, 255, 255, 0.85)',
        fontSize: '1.1rem',
        wordBreak: 'break-all', // Ensure email doesn't overflow weirdly
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1, 3, 2, 3),
    }
}));
// --- End Styled Dialog ---


const ResearchProductPage = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const particlesRef = useRef(null);
  const chartAreaRef = useRef(null); // Ref for the chart plotting area
  const [hasLoaded, setHasLoaded] = useState(false);

  // State for chart click interaction
  const [clickData, setClickData] = useState(null); // { x, y, accuracy, cost }

  // State for email popup dialog
  const [openEmailDialog, setOpenEmailDialog] = useState(false);

  // Handlers for email dialog
  const handleOpenEmailDialog = () => {
    setOpenEmailDialog(true);
  };

  const handleCloseEmailDialog = () => {
    setOpenEmailDialog(false);
  };

  // Animation variants (keep as they are)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // Intersection observer hooks (keep as they are)
  const [innovationRef, innovationInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [performanceRef, performanceInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [achievementsRef, achievementsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [futureRef, futureInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Benchmark data (keep as is)
  const benchmarks = [
    { name: '7B Model', accuracy: 67, cost: 430, color: '#4CAF50' }, // Low cost, lower accuracy
    { name: '30B Model', accuracy: 95, cost: 3400, color: '#2196F3' }, // Mid cost, high accuracy
    // { name: '30B Model (Extended)', accuracy: 100, cost: 9500, color: '#6a11cb' }, // Higher cost, highest accuracy
    { name: 'OpenAI O3 (Comparison)', accuracy: 87, cost: 1000000, color: '#FF9800' }, // Very high cost, good accuracy
  ];

  // Feature data (keep as is)
  const features = [
    { title: 'Self Evolution Architecture', description: 'A hybrid version of existing transformer with Adaptation mechanism that allows the AI to effectively adapt itself at inference time.', icon: <AutorenewIcon sx={{ fontSize: 40 }} />, color: '#6a11cb' },
    { title: 'Knowledge Retention & Utilization', description: 'Designed to utilize previous logical analysis or reasoning, avoiding unnecessary repetition and enabling more efficient problem-solving.', icon: <MemoryIcon sx={{ fontSize: 40 }} />, color: '#2575fc' },
    { title: 'Real-time Learning Algorithm', description: 'Updates neuron parameters through gained experience and knowledge during inference time, enabling continuous improvement.', icon: <PsychologyIcon sx={{ fontSize: 40 }} />, color: '#00bcd4' },
    { title: 'Zero-shot GUI Control', description: 'Ability to operate any software interface without prior specific training, from video editing to professional software like AutoCAD.', icon: <ComputerIcon sx={{ fontSize: 40 }} />, color: '#e91e63' },
  ];

  // Achievements data (keep as is)
  const achievements = [
    { title: 'GUI Control & Software Interaction', stats: 'Open GUI Accuracy: 99%', description: 'Our AI can operate any software interface, from video editing to professional tools like AutoCAD and Maya, with remarkable accuracy and minimal training.' },
    { title: 'Software Engineering', stats: 'SWE Bench Verified Accuracy: 94%', description: 'Excels in web development, software development, AI development, mobile app development, and cybersecurity tasks with minimal human intervention.' },
    { title: 'Academic Performance', stats: 'Humanity\'s Last Exam Accuracy: 80%', description: 'Our model demonstrates strong reasoning capabilities across diverse academic challenges.' },
  ];

  // Particle animation (keep as is)
  useEffect(() => {
    const canvas = particlesRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const particles = [];
    const resizeCanvas = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    class Particle { // Particle class definition (keep as is)
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.color = `rgba(255, 255, 255, ${Math.random() * 0.7 + 0.3})`;
        }
        update() {
            this.x += this.speedX; this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) { this.speedX = -this.speedX; }
            if (this.y < 0 || this.y > canvas.height) { this.speedY = -this.speedY; }
        }
        draw() {
            ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
        }
    }
    const createParticles = () => { for (let i = 0; i < 100; i++) { particles.push(new Particle()); } };
    createParticles();
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x; const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 150) {
            const gradient = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
            gradient.addColorStop(0, `rgba(106, 17, 203, ${0.2 * (1 - distance/150)})`);
            gradient.addColorStop(1, `rgba(37, 117, 252, ${0.2 * (1 - distance/150)})`);
            ctx.beginPath(); ctx.strokeStyle = gradient; ctx.lineWidth = 1.5 - (distance / 150);
            ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
            ctx.beginPath(); ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 * (1 - distance/150)})`;
            ctx.lineWidth = 3 - (distance / 75);
            ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
          }
        }
        particles[i].update(); particles[i].draw();
      }
      requestAnimationFrame(animate);
    };
    animate();
    setTimeout(() => { setHasLoaded(true); }, 500);
    return () => { window.removeEventListener('resize', resizeCanvas); };
  }, []);


  // --- Chart Calculation Logic (keep as is) ---
  const chartConfig = {
    padding: { top: 20, right: 30, bottom: 60, left: 50 }, // Increased bottom padding for legend space
    axisMinMax: {
      accuracy: { min: 0, max: 100 },
      cost: { min: 0, maxVisual: 10000, maxActual: 1000000, splitPoint: 10000, splitXPercent: 0.75 }
    },
    numGridLines: { x: 5, y: 5 },
  };

  const getChartCoordinates = (accuracy, cost, chartWidth, chartHeight) => {
    const { axisMinMax } = chartConfig;
    const { min: minAcc, max: maxAcc } = axisMinMax.accuracy;
    const { min: minCost, maxVisual, maxActual, splitPoint, splitXPercent } = axisMinMax.cost;
    const yPercent = Math.max(0, Math.min(100, ((accuracy - minAcc) / (maxAcc - minAcc)) * 100));
    let xPercent;
    if (cost <= splitPoint) {
      xPercent = (cost / splitPoint) * splitXPercent * 100;
    } else {
      const costInRange = cost - splitPoint;
      const rangeSize = maxActual - splitPoint;
      const percentInRange = costInRange / rangeSize;
      xPercent = (splitXPercent + percentInRange * (1 - splitXPercent)) * 100;
    }
     xPercent = Math.max(0, Math.min(100, xPercent));
    return {
      left: `${xPercent}%`,
      bottom: `${yPercent}%`,
      rawX: xPercent,
      rawY: yPercent,
    };
  };

  const chartPoints = benchmarks.map(b => ({
    ...b,
    coords: getChartCoordinates(b.accuracy, b.cost, 100, 100),
  }));

  const ourModelsPoints = chartPoints.filter(p => p.name !== 'OpenAI O3 (Comparison)').sort((a, b) => a.cost - b.cost);
  const svgPathD = ourModelsPoints.length > 0
    ? `M ${ourModelsPoints[0].coords.rawX}% ${100 - ourModelsPoints[0].coords.rawY}% ` +
      ourModelsPoints.slice(1).map(p => `L ${p.coords.rawX}% ${100 - p.coords.rawY}%`).join(' ')
    : "";

  // --- Chart Click Handler (keep as is) ---
  const handleChartClick = (event) => {
    if (!chartAreaRef.current) return;
    const rect = chartAreaRef.current.getBoundingClientRect();
    const chartWidth = chartAreaRef.current.offsetWidth;
    const chartHeight = chartAreaRef.current.offsetHeight;
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    const relativeX = Math.max(0, Math.min(chartWidth, clickX));
    const relativeY = Math.max(0, Math.min(chartHeight, clickY));

    const { axisMinMax } = chartConfig;
    const { min: minAcc, max: maxAcc } = axisMinMax.accuracy;
    const { min: minCost, maxVisual, maxActual, splitPoint, splitXPercent } = axisMinMax.cost;
    const yPercentClicked = (relativeY / chartHeight);
    const calculatedAccuracy = Math.round((1 - yPercentClicked) * (maxAcc - minAcc) + minAcc);
    const xPercentClicked = (relativeX / chartWidth);
    let calculatedCost;
    if (xPercentClicked <= splitXPercent) {
        calculatedCost = Math.round((xPercentClicked / splitXPercent) * splitPoint);
    } else {
        const percentInSecondSegment = (xPercentClicked - splitXPercent) / (1 - splitXPercent);
        calculatedCost = Math.round(splitPoint + percentInSecondSegment * (maxActual - splitPoint));
    }
    const formattedCost = calculatedCost >= 10000
        ? `$${(calculatedCost / 1000).toFixed(0)}k`
        : `$${calculatedCost.toLocaleString()}`;
     const formattedCostFull = `$${calculatedCost.toLocaleString()}`;

    setClickData({
        x: relativeX,
        y: relativeY,
        accuracy: Math.max(0, Math.min(100, calculatedAccuracy)),
        cost: formattedCost,
        costFull: formattedCostFull,
    });
  };


  return (
    <GradientBackground>
      <ParticleCanvas ref={particlesRef} />

      {/* Glowing orbs (keep as is) */}
      <GlowingOrb $size="300px" $color="#6a11cb" $top="10%" $left="10%" $blur={100} />
      <GlowingOrb $size="500px" $color="#2575fc" $top="40%" $left="60%" $blur={150} />
      <GlowingOrb $size="250px" $color="#e91e63" $top="70%" $left="20%" $blur={80} />
      <GlowingOrb $size="350px" $color="#00bcd4" $top="85%" $left="75%" $blur={120} />

      {/* Hero Section (keep as is) */}
      <PageSection>
        <Container maxWidth="lg">
           {/* ... (Hero section content remains the same) ... */}
           <Box sx={{ textAlign: 'center', mb: 12 }}>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}>
              <Typography variant="h1" sx={{ fontSize: { xs: '3rem', md: '5rem' }, fontWeight: 900, background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 2, filter: 'drop-shadow(0px 0px 10px rgba(106, 17, 203, 0.3))' }}>
                Self Evolution AI
              </Typography>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Typography variant="h4" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.8)' }}>
                Pioneering the Next Generation of Artificial General Intelligence
              </Typography>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <Typography variant="body1" sx={{ maxWidth: '800px', mx: 'auto', mb: 5, color: 'rgba(255, 255, 255, 0.7)' }}>
                QueenDahyun AGI's revolutionary Self Evolution architecture represents a breakthrough in AI capability, efficiency, and adaptability.
              </Typography>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }}>
              <GlowingButton variant="contained" size="large" endIcon={<ArrowForwardIcon />}>
                Explore Our Technology
              </GlowingButton>
            </motion.div>
          </Box>
          {/* 3D model placeholder (keep as is) */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: hasLoaded ? 1 : 0 }} transition={{ duration: 1, delay: 1 }}>
            <Box sx={{ height: { xs: '250px', md: '400px' }, width: '100%', position: 'relative', overflow: 'hidden', borderRadius: '20px', background: 'rgba(0, 0, 0, 0.2)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
              <motion.div animate={{ rotateY: [0, 360], }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} style={{ width: '80%', height: '80%', position: 'relative', transformStyle: 'preserve-3d', }}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '120px', md: '200px' }, height: { xs: '120px', md: '200px' }, borderRadius: '50%', background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', boxShadow: '0 0 50px rgba(106, 17, 203, 0.8)', filter: 'blur(5px)', }} />
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '100px', md: '160px' }, height: { xs: '100px', md: '160px' }, borderRadius: '50%', border: '2px solid rgba(255, 255, 255, 0.5)', boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)', }} />
              </motion.div>
              <Typography variant="h6" sx={{ position: 'absolute', bottom: '20px', color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center' }}>
                Self Evolution Neural Network Visualization
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </PageSection>

      {/* Innovation Section (keep as is) */}
      <PageSection ref={innovationRef}>
        <Container maxWidth="lg">
           {/* ... (Innovation section content remains the same) ... */}
           <motion.div variants={containerVariants} initial="hidden" animate={innovationInView ? "visible" : "hidden"}>
            <motion.div variants={itemVariants}>
              <Typography variant="h2" sx={{ mb: 8, background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', position: 'relative', display: 'inline-block', '&::after': { content: '""', position: 'absolute', bottom: '-10px', left: '0', width: '80px', height: '4px', background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', } }}>
                Our Innovation
              </Typography>
            </motion.div>
            <Grid container spacing={6}>
              <Grid item xs={12} md={6}>
                <motion.div variants={itemVariants}>
                  <Typography variant="body1" paragraph sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem', lineHeight: 1.8 }}>
                    We have created a new AI architecture called "Self Evolution" - a hybrid version of existing transformer with Adaptation mechanism. This breakthrough technology allows our models to overcome limitations quickly and efficiently by adapting themselves during inference time.
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem', lineHeight: 1.8 }}>
                    Unlike traditional models that may struggle with previously unseen scenarios, our Self Evolution architecture learns from its experiences and builds upon them, similar to how human expertise develops over time.
                  </Typography>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div variants={itemVariants}>
                  <GlassCard whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Box sx={{ position: 'relative', p: 2, textAlign: 'center', '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle, rgba(106, 17, 203, 0.2) 0%, rgba(37, 117, 252, 0) 70%)', borderRadius: '16px', } }}>
                      <Typography variant="h5" sx={{ mb: 3, color: '#2575fc' }}> Self Evolution Advantage </Typography>
                      <Grid container spacing={2}>
                        {['Adaptive Learning', 'Contextual Understanding', 'Memory Optimization', 'Real-time Adaptation', 'Problem-solving Enhancement', 'Continuous Improvement'].map((item, index) => (
                          <Grid item xs={6} key={index}> <Box sx={{ p: 2, borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', }}> <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}> {item} </Typography> </Box> </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </GlassCard>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </PageSection>

      {/* Core Features Section (keep as is) */}
      <PageSection ref={featuresRef}>
        <Container maxWidth="lg">
           {/* ... (Core Features section content remains the same) ... */}
           <motion.div variants={containerVariants} initial="hidden" animate={featuresInView ? "visible" : "hidden"}>
            <motion.div variants={itemVariants}>
              <Typography variant="h2" sx={{ mb: 8, background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', position: 'relative', display: 'inline-block', '&::after': { content: '""', position: 'absolute', bottom: '-10px', left: '0', width: '80px', height: '4px', background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', } }}>
                Core Features
              </Typography>
            </motion.div>
            <FloatingGrid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div variants={itemVariants} whileHover={{ y: -10, transition: { type: "spring", stiffness: 300, damping: 20 } }}>
                    <GlassCard style={{ height: '100%' }} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: "spring", stiffness: 100, }}>
                      <Box sx={{ mb: 2, color: feature.color }}> {feature.icon} </Box>
                      <Typography variant="h5" component="h3" gutterBottom sx={{ color: feature.color }}> {feature.title} </Typography>
                      <Box sx={{ width: '40px', height: '3px', background: feature.color, mb: 2, borderRadius: '2px', }} />
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}> {feature.description} </Typography>
                    </GlassCard>
                  </motion.div>
                </Grid>
              ))}
            </FloatingGrid>
          </motion.div>
        </Container>
      </PageSection>

      {/* --- Performance Section (Updated Chart - keep as is, legend position adjusted) --- */}
      <PageSection ref={performanceRef}>
        <Container maxWidth="lg">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={performanceInView ? "visible" : "hidden"}
          >
            {/* Title and Description (keep as is) */}
            <motion.div variants={itemVariants}>
              <Typography variant="h2" sx={{ mb: 8, background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', position: 'relative', display: 'inline-block', '&::after': { content: '""', position: 'absolute', bottom: '-10px', left: '0', width: '80px', height: '4px', background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', } }}>
                Breakthrough Performance
              </Typography>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Typography variant="body1" paragraph sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem', mb: 5 }}>
                Our models have achieved remarkable results on the Arc AGI benchmark, demonstrating unprecedented efficiency compared to industry leaders:
              </Typography>
            </motion.div>

            {/* Benchmark List (keep as is) */}
            <Box sx={{ mb: 8 }}>
              {benchmarks.map((benchmark, index) => (
                <motion.div key={index} variants={itemVariants} custom={index} whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <BenchmarkCard>
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs={12} sm={3}>
                        <Typography variant="h6" sx={{ color: benchmark.color, position: 'relative', '&::before': { content: '""', position: 'absolute', left: '-15px', top: '50%', transform: 'translateY(-50%)', width: '5px', height: '80%', background: benchmark.color, borderRadius: '3px', } }}>
                          {benchmark.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={7}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1, delay: index * 0.2 }}>
                              <ProgressBar $percentage={benchmark.accuracy} $color={benchmark.color} />
                            </motion.div>
                          </Box>
                          <Box sx={{ minWidth: 50 }}> <Typography variant="body2" sx={{ color: benchmark.color, fontWeight: 'bold' }}> {`${Math.round(benchmark.accuracy)}%`} </Typography> </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={2}> <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}> Cost: ${benchmark.cost.toLocaleString()} </Typography> </Grid>
                    </Grid>
                  </BenchmarkCard>
                </motion.div>
              ))}
            </Box>

            {/* --- Interactive Chart (keep as is) --- */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <GlassCard style={{ padding: theme.spacing(4), paddingBottom: theme.spacing(6) }}> {/* Added extra bottom padding */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h5" sx={{ color: '#fff' }}>Performance vs Cost Analysis</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255, 255, 255, 0.6)' }}>
                        <TouchAppIcon fontSize="small" />
                        <Typography variant="caption">Click to explore</Typography>
                    </Box>
                </Box>

                {/* Chart Container */}
                <Box
                  sx={{
                    height: '350px', // Keep height fixed for chart area itself
                    width: '100%',
                    position: 'relative',
                    mt: 2,
                    cursor: 'crosshair',
                  }}
                  onClick={handleChartClick}
                >
                  {/* Plotting Area */}
                  <Box
                    ref={chartAreaRef}
                    sx={{
                      position: 'absolute',
                      top: `${chartConfig.padding.top}px`,
                      left: `${chartConfig.padding.left}px`,
                      right: `${chartConfig.padding.right}px`,
                      bottom: `${chartConfig.padding.bottom}px`, // Use padding value
                    }}
                  >
                    {/* Grid Lines */}
                    {Array.from({ length: chartConfig.numGridLines.x + 1 }).map((_, i) => (
                      <ChartGridLine key={`v-${i}`} sx={{ left: `${(i / chartConfig.numGridLines.x) * 100}%`, top: 0, bottom: 0, width: '1px', }} />
                    ))}
                    {Array.from({ length: chartConfig.numGridLines.y + 1 }).map((_, i) => (
                      <ChartGridLine key={`h-${i}`} sx={{ top: `${(i / chartConfig.numGridLines.y) * 100}%`, left: 0, right: 0, height: '1px', }} />
                    ))}

                    {/* Data Points */}
                    <AnimatePresence>
                      {chartPoints.map((point, index) => (
                        <ChartDataPoint
                          key={point.name}
                          $color={point.color}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1, left: point.coords.left, bottom: point.coords.bottom }}
                          transition={{ duration: 0.5, delay: 0.5 + index * 0.1, type: 'spring', stiffness: 150 }}
                          whileHover={{ scale: 1.3 }}
                        />
                      ))}
                    </AnimatePresence>

                    {/* Connecting Line */}
                    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'visible', zIndex: 10 }}>
                      <defs>
                        <linearGradient id="lineGradientChart" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor={ourModelsPoints[0]?.color || '#4CAF50'} />
                          <stop offset="50%" stopColor={ourModelsPoints[1]?.color || '#2196F3'} />
                          <stop offset="100%" stopColor={ourModelsPoints[2]?.color || '#6a11cb'} />
                        </linearGradient>
                      </defs>
                      <motion.path
                        d={svgPathD}
                        fill="none"
                        stroke="url(#lineGradientChart)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
                      />
                    </svg>

                    {/* Click Interaction Indicator */}
                    <AnimatePresence>
                        {clickData && (
                            <>
                                <ClickIndicator
                                    key="indicator"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1, top: clickData.y, left: clickData.x }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                />
                                <ValueDisplayBox
                                    key="valuebox"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0, top: clickData.y, left: clickData.x }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Tooltip title={`Full Cost: ${clickData.costFull}`} placement="top" arrow>
                                        <Box>
                                            Acc: {clickData.accuracy}% <br /> Cost: {clickData.cost}
                                        </Box>
                                    </Tooltip>
                                </ValueDisplayBox>
                            </>
                        )}
                    </AnimatePresence>

                  </Box> {/* End Plotting Area */}

                  {/* Axis Labels */}
                  <Typography variant="caption" sx={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%) rotate(-90deg)', color: 'rgba(255, 255, 255, 0.7)', transformOrigin: 'left center' }}>Accuracy (%)</Typography>
                  {/* --- MODIFIED X-AXIS LABEL --- */}
                  <Typography variant="caption" sx={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' }}>
                    Cost (USD - Pseudo-Log Scale)
                  </Typography>
                  {/* --- END MODIFIED X-AXIS LABEL --- */}

                  {/* Axis Ticks/Values */}
                  {Array.from({ length: chartConfig.numGridLines.y + 1 }).map((_, i) => {
                      const value = chartConfig.axisMinMax.accuracy.max - (i / chartConfig.numGridLines.y) * (chartConfig.axisMinMax.accuracy.max - chartConfig.axisMinMax.accuracy.min);
                      const chartHeight = 350 - chartConfig.padding.top - chartConfig.padding.bottom; // Calculate actual plot height
                      return (
                          <Typography key={`ytick-${i}`} variant="caption" sx={{ position: 'absolute', top: `${chartConfig.padding.top + (i / chartConfig.numGridLines.y) * chartHeight}px`, left: `${chartConfig.padding.left - 10}px`, transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.5)', textAlign: 'right', width: '30px', }}>
                              {Math.round(value)}
                          </Typography>
                      );
                  })}
                  <Typography variant="caption" sx={{ position: 'absolute', bottom: `${chartConfig.padding.bottom - 20}px`, left: `${chartConfig.padding.left}px`, transform: 'translateX(-50%)', color: 'rgba(255, 255, 255, 0.5)' }}>$0</Typography>
                  <Typography variant="caption" sx={{ position: 'absolute', bottom: `${chartConfig.padding.bottom - 20}px`, left: `${chartConfig.padding.left + (chartAreaRef.current?.offsetWidth || 0) * chartConfig.axisMinMax.cost.splitXPercent}px`, transform: 'translateX(-50%)', color: 'rgba(255, 255, 255, 0.5)' }}>~$10k</Typography>
                   <Typography variant="caption" sx={{ position: 'absolute', bottom: `${chartConfig.padding.bottom - 20}px`, right: `${chartConfig.padding.right}px`, transform: 'translateX(50%)', color: 'rgba(255, 255, 255, 0.5)' }}>$1M</Typography>

                  {/* --- MODIFIED LEGEND POSITION --- */}
                  <Box sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      flexWrap: 'wrap',
                      gap: theme.spacing(1, 2),
                      mt: 1, // Keep margin-top
                      position: 'absolute',
                      bottom: -theme.spacing(3), // Move legend below the x-axis label area
                      left: chartConfig.padding.left,
                      right: chartConfig.padding.right,
                      width: `calc(100% - ${chartConfig.padding.left + chartConfig.padding.right}px)`, // Ensure it fits within padding
                    }}>
                    {benchmarks.map((item) => (
                      <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {item.name.replace(' (Comparison)', '').replace(' (Extended)', ' (Ext)')}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  {/* --- END MODIFIED LEGEND POSITION --- */}
                </Box> {/* End Chart Container */}
              </GlassCard>
            </motion.div>
            {/* --- End Interactive Chart --- */}

          </motion.div>
        </Container>
      </PageSection>
      {/* --- End Performance Section --- */}


      {/* Achievements Section (keep as is) */}
      <PageSection ref={achievementsRef}>
        <Container maxWidth="lg">
          {/* ... (Achievements section content remains the same) ... */}
          <motion.div variants={containerVariants} initial="hidden" animate={achievementsInView ? "visible" : "hidden"}>
            <motion.div variants={itemVariants}>
              <Typography variant="h2" sx={{ mb: 8, background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', position: 'relative', display: 'inline-block', '&::after': { content: '""', position: 'absolute', bottom: '-10px', left: '0', width: '80px', height: '4px', background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', } }}>
                Additional Achievements
              </Typography>
            </motion.div>
            <Grid container spacing={4}>
              {achievements.map((achievement, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div variants={itemVariants} whileHover={{ scale: 1.03, boxShadow: '0 20px 30px rgba(0, 0, 0, 0.2)' }}>
                    <GlassCard style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
                      <Box sx={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: index === 0 ? 'rgba(233, 30, 99, 0.3)' : index === 1 ? 'rgba(0, 188, 212, 0.3)' : 'rgba(156, 39, 176, 0.3)', filter: 'blur(30px)', }} />
                      <Typography variant="h5" component="h3" gutterBottom sx={{ color: index === 0 ? '#e91e63' : index === 1 ? '#00bcd4' : '#9c27b0', mb: 3, position: 'relative', zIndex: 1, }}> {achievement.title} </Typography>
                      <Box sx={{ p: 2, mb: 3, borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', }}>
                        <Typography variant="body1" sx={{ color: index === 0 ? '#e91e63' : index === 1 ? '#00bcd4' : '#9c27b0', fontWeight: 'bold' }}> {achievement.stats} </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', position: 'relative', zIndex: 1 }}> {achievement.description} </Typography>
                    </GlassCard>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </PageSection>

      {/* Future Development Section (Update Buttons & Roadmap Height) */}
      <PageSection ref={futureRef}>
        <Container maxWidth="lg">
          <motion.div variants={containerVariants} initial="hidden" animate={futureInView ? "visible" : "hidden"}>
            <motion.div variants={itemVariants}>
              <Typography variant="h2" sx={{ mb: 8, background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', position: 'relative', display: 'inline-block', '&::after': { content: '""', position: 'absolute', bottom: '-10px', left: '0', width: '80px', height: '4px', background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', } }}>
                Future Development
              </Typography>
            </motion.div>
            <Grid container spacing={6} alignItems="stretch"> {/* Changed alignItems to stretch */}
              <Grid item xs={12} md={6}>
                <motion.div variants={itemVariants} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}> {/* Added flex styles */}
                  <Box sx={{ flexGrow: 1 }}> {/* Allow text content to grow */}
                    <Typography variant="body1" paragraph sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem', lineHeight: 1.8 }}> Our current implementation utilizes the open-source Qwen model enhanced with our mechanism, as we don't currently have the massive infrastructure to build models from scratch. However, our original self-evolution architecture uses diffusion mechanism instead of autoregressive approaches. </Typography>
                    <Typography variant="body1" paragraph sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem', lineHeight: 1.8 }}> We've built a 0.5B parameter proof-of-concept model from scratch that performs equivalent to traditional 7B parameter models. Additionally, our Qwen implementation provides 5-6x faster inference than our experimental model. </Typography>
                    <Typography variant="body1" paragraph sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem', lineHeight: 1.8, mb: 4 }}> With substantial funding, we plan to build large models from scratch on the original self-evolution architecture, which will increase performance and efficiency by orders of magnitude. </Typography>
                  </Box>
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} sx={{ mt: 'auto' }}> {/* Push button to bottom */}
                    {/* --- UPDATED BUTTON --- */}
                    <GlowingButton
                        variant="contained"
                        size="large"
                        endIcon={<ArrowForwardIcon />}
                        onClick={handleOpenEmailDialog} // Add onClick handler
                    >
                        Partner With Us
                    </GlowingButton>
                    {/* --- END UPDATED BUTTON --- */}
                  </motion.div>
                </motion.div>
              </Grid>
              {/* --- MODIFIED ROADMAP SECTION --- */}
              <Grid item xs={12} md={6}>
                <motion.div variants={itemVariants} style={{ height: '100%' }}> {/* Ensure motion div takes full height */}
                  <Box sx={{
                      position: 'relative',
                      minHeight: '400px', // Use minHeight instead of fixed height
                      height: '100%', // Allow it to take full grid item height
                      borderRadius: '20px',
                      // overflow: 'hidden', // Remove overflow hidden to allow content visibility
                      background: 'rgba(0, 0, 0, 0.2)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex', // Use flex for internal layout
                      flexDirection: 'column', // Stack title and phases vertically
                    }}>
                    <Box sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}> {/* Adjust padding and flex */}
                      <Typography variant="h5" sx={{ mb: 4, color: '#fff', textAlign: 'center' }}> Development Roadmap </Typography>
                      <Box> {/* Container for phases */}
                        {[
                          { phase: 'Phase 1: Completed', title: 'Proof of Concept', details: '0.5B parameter model development', color: '#4CAF50', done: true },
                          { phase: 'Phase 2: In Progress', title: 'Optimization & Scaling', details: 'Performance tuning and infrastructure scaling', color: '#2196F3', done: false },
                          { phase: 'Phase 3: Future', title: 'Custom Architecture Build', details: 'Building full-scale models on proprietary architecture', color: '#9c27b0', done: false },
                          { phase: 'Phase 4: Future', title: 'Commercial Deployment', details: 'Enterprise-grade AGI solutions deployment', color: '#e91e63', done: false },
                        ].map((phase, index, arr) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: index === arr.length - 1 ? 0 : 3 }}> {/* Align items start, remove mb on last item */}
                            <Box sx={{ width: 20, height: 20, borderRadius: '50%', background: phase.done ? phase.color : 'rgba(255, 255, 255, 0.2)', border: `2px solid ${phase.color}`, mr: 2, mt: 0.5, flexShrink: 0, position: 'relative', '&::after': phase.done ? { content: '""', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '10px', height: '10px', borderRadius: '50%', background: 'white', } : {} }} />
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" sx={{ color: phase.color, fontWeight: 'bold' }}> {phase.phase} </Typography>
                              <Typography variant="body1" sx={{ color: '#fff' }}> {phase.title} </Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}> {phase.details} </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                    {/* Adjust line position/height if needed, maybe make relative to content */}
                    <Box sx={{
                        position: 'absolute',
                        top: '100px', // Adjust start point if needed based on title height
                        left: '30px', // Corresponds to icon center
                        width: '2px',
                        bottom: '40px', // Adjust end point dynamically or use fixed value
                        // height: 'calc(100% - 140px)', // Example dynamic height calculation
                        background: 'linear-gradient(to bottom, #4CAF50, #2196F3, #9c27b0, #e91e63)',
                        zIndex: 0
                      }} />
                  </Box>
                </motion.div>
              </Grid>
              {/* --- END MODIFIED ROADMAP SECTION --- */}
            </Grid>
            {/* Final CTA Section (Update Buttons) */}
            <Box sx={{ mt: 12, textAlign: 'center' }}>
              <motion.div variants={itemVariants}>
                <Typography variant="h4" sx={{ color: '#fff', mb: 4 }}> Ready to revolutionize AI with us? </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 6, maxWidth: 700, mx: 'auto' }}> Join us on our mission to develop the most efficient and capable AI systems ever created. Partner with QueenDahyun AGI to shape the future of artificial general intelligence. </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                  {/* --- UPDATED BUTTON --- */}
                  <GlowingButton
                    variant="contained"
                    size="large"
                    sx={{ background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', minWidth: '180px' }}
                    onClick={handleOpenEmailDialog} // Add onClick handler
                  >
                     Contact Us
                  </GlowingButton>
                  {/* --- END UPDATED BUTTON --- */}
                  {/* --- UPDATED BUTTON --- */}
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{ borderColor: 'rgba(255, 255, 255, 0.3)', color: '#fff', minWidth: '180px', '&:hover': { borderColor: 'rgba(255, 255, 255, 0.6)', background: 'rgba(255, 255, 255, 0.05)' } }}
                    onClick={handleOpenEmailDialog} // Add onClick handler
                  >
                     Request Demo
                  </Button>
                  {/* --- END UPDATED BUTTON --- */}
                </Box>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </PageSection>

      {/* --- Email Display Dialog --- */}
      <StyledDialog
        open={openEmailDialog}
        onClose={handleCloseEmailDialog}
        aria-labelledby="email-dialog-title"
        aria-describedby="email-dialog-description"
      >
        <DialogTitle id="email-dialog-title">
          Contact Information
           <IconButton
              aria-label="close"
              onClick={handleCloseEmailDialog}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="email-dialog-description" sx={{ mt: 2 }}>
            Please reach out to us via the following email address:
          </DialogContentText>
          <Typography variant="h6" sx={{ mt: 1, mb: 2, color: '#2575fc', userSelect: 'all' }}>
            md.sofiullah@queendahyun.site
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseEmailDialog}
            variant="outlined"
            sx={{ borderColor: 'rgba(255, 255, 255, 0.3)', color: '#fff', '&:hover': { borderColor: 'rgba(255, 255, 255, 0.6)', background: 'rgba(255, 255, 255, 0.05)' } }}
          >
            Close
          </Button>
        </DialogActions>
      </StyledDialog>
      {/* --- End Email Display Dialog --- */}

    </GradientBackground>
  );
};

export default ResearchProductPage;