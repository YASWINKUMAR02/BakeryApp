import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, IconButton, Button } from '@mui/material';
import { ChevronLeft, ChevronRight, Star, ArrowForward } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import ProductModal from '../components/ProductModal';
import PullToRefresh from '../components/PullToRefresh';
import ScrollReveal from '../components/ScrollReveal';
import DeliveryNotice from '../components/DeliveryNotice';
import { pageTransitions } from '../utils/pageTransitions';
import customizedCakeImage from '../sample-images/WhatsApp Image 2025-11-03 at 14.33.23_ebc72c8a.jpg';
import customizedCakesCarousel from '../sample-images/CUSTOMIZED_CAKES.png';

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const carouselSlides = [
    {
      title: 'Premium Brownies',
      subtitle: 'Crafted to Perfection',
      description: 'Indulge in our signature collection of premium brownies',
      image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=1920&q=95&auto=format',
      buttonText: 'Shop Now',
      buttonAction: 'shop',
    },
    {
      title: 'Customized Birthday Cakes',
      subtitle: 'Personalized Just for You',
      description: 'Create unforgettable moments with our bespoke celebration cakes',
      image: customizedCakesCarousel,
      buttonText: 'Shop Now',
      buttonAction: 'shop',
    },
    {
      title: 'Artisan Desserts',
      subtitle: 'Handcrafted with Love',
      description: 'Discover our exquisite range of desserts made fresh daily',
      image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=1920&q=95&auto=format',
      buttonText: 'Shop Now',
      buttonAction: 'shop',
    },
    {
      title: 'Order Your Favorites',
      subtitle: 'Call Us Now!',
      description: 'Place your order directly - We deliver within 10 km in Coimbatore',
      image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=1920&q=95&auto=format',
      buttonText: 'Call Now',
      buttonAction: 'call',
    },
  ];

  // Get minimum price for a product based on available weight options
  const getMinimumPrice = (product) => {
    // Birthday cakes start at 500g = ₹400
    if (product.name === 'Customized Birthday Cakes') {
      return 400;
    }
    // Kunafa Chocolate - 100g is minimum
    if (product.name === 'Kunafa Chocolate') {
      return Math.round(product.price * 0.5); // 100g = half of 200g price
    }
    // Chocolate Dream Cake - 250g is minimum
    if (product.name === 'Chocolate Dream Cake') {
      return 250;
    }
    // For brownies and other items, base price is the minimum
    return product.price;
  };

  const products = [
    { id: 9, name: 'Customized Birthday Cakes', category: 'Cakes', price: 800, rating: 5.0, reviews: 95, description: 'Personalized celebration cakes', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=400&fit=crop&auto=format', grams: 1000, pieces: 1 },
    { id: 1, name: 'Classic Brownie', category: 'Brownies', price: 150, rating: 4.8, reviews: 45, description: 'Rich chocolate fudge brownie', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop&auto=format', grams: 250, pieces: 1 },
    { id: 14, name: 'Kunafa Chocolate', category: 'Desserts', price: 220, rating: 4.9, reviews: 42, description: 'Crispy kunafa with rich chocolate', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop&auto=format', grams: 200, pieces: 1 },
    { id: 7, name: 'Nutella Brownie', category: 'Brownies', price: 200, rating: 5.0, reviews: 75, description: 'Loaded with creamy Nutella', image: 'https://images.unsplash.com/photo-1588187418531-95d8d83e39c5?w=400&h=400&fit=crop&auto=format', grams: 250, pieces: 1 },
    { id: 11, name: 'Cookies', category: 'Cookies', price: 150, rating: 4.7, reviews: 62, description: 'Freshly baked cookies', image: 'https://images.unsplash.com/photo-1481391032119-d89fee407e44?w=400&h=400&fit=crop&auto=format', grams: 250, pieces: 12 },
    { id: 13, name: 'Cup Cakes', category: 'Cakes', price: 80, rating: 4.6, reviews: 55, description: 'Bite-sized sweet treats', image: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=400&h=400&fit=crop&auto=format', grams: 100, pieces: 1 },
  ];

  // Preload first carousel image
  useEffect(() => {
    const firstImage = new Image();
    firstImage.src = carouselSlides[0].image;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [carouselSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const handleRefresh = async () => {
    // Simulate refresh - reload page data
    return new Promise((resolve) => {
      setTimeout(() => {
        setCurrentSlide(0);
        resolve();
      }, 1000);
    });
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  // Enhanced Animation variants with smooth transitions
  const containerVariants = {
    hidden: { 
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };


  // Touch swipe handlers for carousel
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left - next slide
      nextSlide();
    }

    if (touchStart - touchEnd < -75) {
      // Swipe right - previous slide
      prevSlide();
    }
  };

  // Animation variants for mobile
  const mobileCarouselVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      x: 50,
      transition: { duration: 0.4 }
    }
  };

  const mobileProductVariants = {
    hidden: { 
      opacity: 0, 
      y: 40, 
      scale: 0.9,
      rotateX: 15
    },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }),
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const mobileTapVariants = {
    tap: { scale: 0.95 }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransitions.home}
    >
      <PullToRefresh onRefresh={handleRefresh}>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>

      {/* Hero Carousel Section */}
        <Box 
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          sx={{ 
            position: 'relative', 
            height: { xs: '240px', sm: '300px', md: '350px' }, 
            width: '100%',
            overflow: 'hidden', 
            background: '#000',
            marginTop: '64px',
            touchAction: 'pan-y',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}
        >
        {carouselSlides.map((slide, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: currentSlide === index ? 1 : 0,
            }}
            transition={{ 
              duration: 1.2, 
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: currentSlide === index ? 1 : 0,
              willChange: 'opacity'
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%), url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, rgba(233, 30, 99, 0.1) 0%, rgba(156, 39, 176, 0.1) 100%)',
                  zIndex: 1,
                }
              }}
            >
              <Container maxWidth="lg" sx={{ height: '100%', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                <motion.div
                  key={`content-${index}`}
                  initial={{ opacity: 0, x: -60, y: 20 }}
                  animate={currentSlide === index ? { 
                    opacity: 1, 
                    x: 0, 
                    y: 0,
                    transition: { 
                      duration: 0.8, 
                      delay: 0.3,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }
                  } : { 
                    opacity: 0, 
                    x: -60, 
                    y: 20 
                  }}
                  style={{ width: '100%' }}
                >
                  <Box sx={{ 
                    color: '#fff', 
                    maxWidth: { xs: '100%', sm: '600px', md: '700px' }, 
                    padding: { xs: '20px', sm: '0 40px', md: '0' },
                    background: { xs: 'transparent', sm: 'transparent' },
                    borderRadius: { xs: '0', sm: '0' },
                    backdropFilter: { xs: 'none', sm: 'none' },
                    margin: { xs: '0 16px', sm: '0' },
                    textAlign: { xs: 'center', sm: 'left' },
                    border: { xs: 'none', sm: 'none' },
                    boxShadow: { xs: 'none', sm: 'none' }
                  }}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={currentSlide === index ? { 
                        opacity: 1, 
                        y: 0,
                        transition: { duration: 0.6, delay: 0.5 }
                      } : { opacity: 0, y: 30 }}
                    >
                      <Typography 
                        variant="h1" 
                        sx={{ 
                          fontWeight: 800, 
                          marginBottom: { xs: '8px', sm: '16px', md: '20px' }, 
                          fontSize: { xs: '24px', sm: '40px', md: '52px' }, 
                          lineHeight: { xs: 1.2, sm: 1.2 }, 
                          textShadow: { xs: '2px 2px 8px rgba(0,0,0,0.8)', sm: '3px 3px 12px rgba(0,0,0,0.7)' },
                          color: '#fff',
                          letterSpacing: { xs: '0', sm: '-0.02em' },
                        }}
                      >
                        {slide.title}
                      </Typography>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={currentSlide === index ? { 
                        opacity: 1, 
                        y: 0,
                        transition: { duration: 0.6, delay: 0.7 }
                      } : { opacity: 0, y: 30 }}
                    >
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          fontWeight: 600, 
                          fontSize: { xs: '16px', sm: '22px', md: '28px' }, 
                          lineHeight: 1.3, 
                          marginBottom: { xs: '8px', sm: '16px', md: '20px' },
                          color: '#e91e63',
                          textShadow: { xs: '1px 1px 4px rgba(0,0,0,0.8)', sm: '2px 2px 8px rgba(0,0,0,0.6)' },
                          letterSpacing: { xs: '0.3px', sm: '0.5px' },
                        }}
                      >
                        {slide.subtitle}
                      </Typography>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={currentSlide === index ? { 
                        opacity: 1, 
                        y: 0,
                        transition: { duration: 0.6, delay: 0.9 }
                      } : { opacity: 0, y: 30 }}
                    >
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontSize: { xs: '13px', sm: '15px', md: '16px' }, 
                          fontWeight: 400, 
                          letterSpacing: { xs: '0.3px', sm: '0.5px' }, 
                          marginBottom: { xs: '16px', sm: '28px', md: '32px' }, 
                          color: '#fff',
                          opacity: { xs: 0.95, sm: 0.9 },
                          textShadow: { xs: '1px 1px 3px rgba(0,0,0,0.8)', sm: '1px 1px 4px rgba(0,0,0,0.6)' },
                          lineHeight: { xs: 1.4, sm: 1.6 },
                          maxWidth: { xs: '100%', sm: '500px' },
                        }}
                      >
                        {slide.description}
                      </Typography>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={currentSlide === index ? { 
                        opacity: 1, 
                        y: 0,
                        transition: { duration: 0.6, delay: 1.1 }
                      } : { opacity: 0, y: 30 }}
                    >
                      <Button
                        variant="contained"
                        size="large"
                        component={slide.buttonAction === 'call' ? 'a' : 'button'}
                        href={slide.buttonAction === 'call' ? 'tel:+918072156286' : undefined}
                        onClick={slide.buttonAction === 'shop' ? () => navigate('/shop') : undefined}
                        onTouchStart={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                        onTouchEnd={(e) => e.stopPropagation()}
                        endIcon={<ArrowForward sx={{ fontSize: { xs: '16px', sm: '18px', md: '20px' } }} />}
                        sx={{
                          background: 'linear-gradient(135deg, #e91e63 0%, #ad1457 100%)',
                          color: '#fff',
                          padding: { xs: '12px 24px', sm: '14px 28px', md: '16px 32px' },
                          fontSize: { xs: '14px', sm: '16px', md: '16px' },
                          fontWeight: 600,
                          textTransform: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 14px rgba(233, 30, 99, 0.4)',
                          textDecoration: 'none',
                          border: 'none',
                          transition: 'all 0.3s ease',
                          minWidth: { xs: '140px', sm: '160px' },
                          height: { xs: '44px', sm: '48px', md: '52px' },
                          '&:hover': {
                            background: 'linear-gradient(135deg, #d81b60 0%, #e91e63 100%)',
                            boxShadow: '0 6px 20px rgba(233, 30, 99, 0.6)',
                            transform: 'translateY(-2px)',
                          }
                        }}
                      >
                        {slide.buttonText}
                      </Button>
                    </motion.div>
                  </Box>
                </motion.div>
              </Container>
            </Box>
          </motion.div>
        ))}


        {/* Enhanced Carousel Indicators */}
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: '8px', sm: '12px', md: '16px' },
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: { xs: '4px', sm: '6px' },
            zIndex: 3,
            background: { xs: 'rgba(0,0,0,0.5)', sm: 'rgba(0,0,0,0.3)' },
            backdropFilter: { xs: 'none', sm: 'blur(8px)' },
            padding: { xs: '4px 8px', sm: '6px 12px' },
            borderRadius: { xs: '15px', sm: '18px' },
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          {carouselSlides.map((_, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              animate={{ 
                scale: currentSlide === index ? 1.1 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <Box
                onClick={() => setCurrentSlide(index)}
                sx={{
                  width: currentSlide === index ? { xs: '16px', sm: '20px', md: '24px' } : { xs: '6px', sm: '8px', md: '10px' },
                  height: { xs: '6px', sm: '8px', md: '10px' },
                  borderRadius: { xs: '3px', sm: '4px', md: '5px' },
                  background: currentSlide === index 
                    ? 'linear-gradient(135deg, #e91e63 0%, #ad1457 100%)' 
                    : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: currentSlide === index ? '0 2px 6px rgba(233, 30, 99, 0.4)' : 'none',
                  border: 'none',
                  '&:hover': {
                    background: currentSlide === index 
                      ? 'linear-gradient(135deg, #ad1457 0%, #e91e63 100%)' 
                      : 'rgba(255,255,255,0.7)',
                    transform: 'scale(1.05)',
                  }
                }}
              />
            </motion.div>
          ))}
        </Box>

      </Box>

      {/* Delivery Notice - Mobile */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <DeliveryNotice />
      </Box>

      {/* Products Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)', 
        padding: { xs: '36px 0 60px', sm: '48px 0 80px', md: '60px 0 100px' },
        position: 'relative',
        marginTop: 0,
        width: '100%'
      }}>
        <Container maxWidth="lg" sx={{ paddingX: { xs: 2, sm: 4.5, md: 6 } }}>
          <ScrollReveal animation="slideUp">
            <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 6, md: 8 } }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 800, 
                  color: '#1a1a1a', 
                  mb: { xs: 2, sm: 3 }, 
                  fontSize: { xs: '2rem', sm: '2.75rem', md: '3.5rem' },
                  lineHeight: { xs: 1.2, sm: 1.1 },
                  letterSpacing: { xs: '-0.01em', sm: '-0.02em' },
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Our Delicious Products
              </Typography>
            </Box>
          </ScrollReveal>

          <Box
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(3, 1fr)',
                xl: 'repeat(3, 1fr)',
              },
              gap: { xs: 1.5, sm: 2.5, md: 3 },
              width: '100%',
            }}
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                custom={index}
                variants={mobileProductVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                whileTap="tap"
                style={{ height: '100%' }}
              >
              <Card 
                onClick={() => handleProductClick(product)}
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  borderRadius: { xs: '8px', sm: '12px' }, 
                  border: '1px solid rgba(0,0,0,0.06)',
                  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
                  height: { xs: '220px', sm: '360px', md: '380px' },
                  background: '#fff',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(233, 30, 99, 0.02) 0%, rgba(173, 20, 87, 0.02) 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    zIndex: 1,
                  },
                  '@media (hover: hover)': {
                    '&:hover': {
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.06)',
                      transform: 'translateY(-8px) scale(1.02)',
                      border: '1px solid rgba(233, 30, 99, 0.1)',
                      '&::before': {
                        opacity: 1,
                      },
                      '& .product-image': {
                        transform: 'scale(1.08)',
                      },
                      '& .product-content': {
                        transform: 'translateY(-2px)',
                      },
                      '& .product-rating': {
                        color: '#e91e63',
                      }
                    }
                  },
                  '&:active': {
                    transform: 'translateY(-4px) scale(0.98)',
                  }
                }}
              >
                <Box sx={{ 
                  height: { xs: '100px', sm: '200px' }, 
                  position: 'relative', 
                  overflow: 'hidden', 
                  backgroundColor: '#f8f8f8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      className="product-image"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                        borderRadius: 4
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 600,
                        letterSpacing: '0.5px'
                      }}
                    >
                      {product.name}
                    </Box>
                  )}
                </Box>
                <CardContent 
                  className="product-content"
                  sx={{ 
                    px: { xs: 1.5, sm: 3 },
                    py: { xs: 1.25, sm: 2.5 },
                    flex: 1,
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                    position: 'relative',
                    zIndex: 2,
                    transition: 'transform 0.3s ease',
                  }}
                >
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        fontSize: { xs: '0.75rem', sm: '1.1rem' },
                        marginBottom: { xs: 0.5, sm: 1.5 },
                        lineHeight: 1.3,
                        color: '#1a1a1a',
                        minHeight: { xs: '1.5rem', sm: '2.8rem' },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Box 
                      className="product-rating"
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.5, 
                        marginBottom: { xs: 0.5, sm: 1.5 },
                        transition: 'color 0.3s ease'
                      }}
                    >
                      <Star sx={{ color: '#ffa726', fontSize: { xs: '0.8rem', sm: '1.1rem' } }} />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 700, 
                          color: '#1a1a1a', 
                          fontSize: { xs: '0.7rem', sm: '0.9rem' } 
                        }}
                      >
                        {product.rating}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#666', 
                          fontSize: { xs: '0.65rem', sm: '0.85rem' },
                          fontWeight: 500
                        }}
                      >
                        ({product.reviews})
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        fontSize: { xs: '0.6rem', sm: '0.8rem' },
                        lineHeight: 1.4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {product.description}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'baseline', 
                    gap: 0.5,
                    mt: { xs: 1, sm: 2 }
                  }}>
                    <Typography 
                      component="span"
                      sx={{ 
                        fontSize: { xs: '0.5rem', sm: '0.6rem' },
                        fontWeight: 600,
                        color: '#999',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      From
                    </Typography>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: '#e91e63', 
                        fontWeight: 700, 
                        fontSize: { xs: '1rem', sm: '1.5rem' },
                        lineHeight: 1,
                      }}
                    >
                      ₹{getMinimumPrice(product)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
              </motion.div>
            ))}
          </Box>

          {/* Browse All Products Button */}
          <Box sx={{ textAlign: 'center', marginTop: { xs: 4, sm: 6, md: 8 } }}>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: 0.4,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward sx={{ ml: 1, transition: 'transform 0.3s ease' }} />}
              onClick={() => navigate('/shop')}
              sx={{
                background: 'linear-gradient(135deg, #e91e63 0%, #ad1457 100%)',
                color: '#fff',
                padding: { xs: '16px 32px', sm: '18px 40px' },
                fontSize: { xs: '15px', sm: '17px' },
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: '50px',
                boxShadow: '0 8px 24px rgba(233, 30, 99, 0.3)',
                border: '2px solid transparent',
                position: 'relative',
                overflow: 'hidden',
                minWidth: { xs: '200px', sm: '240px' },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  transition: 'left 0.6s ease',
                },
                '&:hover': {
                  background: 'linear-gradient(135deg, #d81b60 0%, #e91e63 100%)',
                  boxShadow: '0 12px 32px rgba(233, 30, 99, 0.5)',
                  transform: 'translateY(-2px)',
                  border: '2px solid rgba(255,255,255,0.1)',
                  '&::before': {
                    left: '100%',
                  },
                  '& .MuiSvgIcon-root': {
                    transform: 'translateX(4px)',
                  }
                }
              }}
            >
              Browse All Products
            </Button>
            </motion.div>
          </Box>
        </Container>
      </Box>


      {/* Footer */}
      <Footer />
    </Box>

    {/* Product Modal */}
    <ProductModal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      product={selectedProduct}
    />
    </PullToRefresh>
    </motion.div>
  );
};

export default Home;
