import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Box } from '@mui/material';
import CustomerHeader from './components/CustomerHeader';
import DeliveryNotice from './components/DeliveryNotice';
import ScrollToTop from './components/ScrollToTop';
import Breadcrumbs from './components/Breadcrumbs';
import BackToTop from './components/BackToTop';
import PageLoader from './components/PageLoader';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Shop from './pages/Shop';
import Gallery from './pages/Gallery';
import FAQ from './pages/FAQ';
import NotFound from './pages/NotFound';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import './App.css';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial page load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <Router>
      <ScrollToTop />
      <CustomerHeader />
      <Breadcrumbs />
      <AnimatedRoutes />
      <BackToTop />
      <BottomNav />
      {/* Delivery Notice - Desktop only (fixed at bottom) */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <DeliveryNotice />
      </Box>
    </Router>
  );
}

export default App;
