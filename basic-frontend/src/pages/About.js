import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid, Paper, Card, CardContent, IconButton } from '@mui/material';
import { Cake, LocalShipping, Favorite, Star, EmojiEvents, VerifiedUser, Grade, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import frostLogo from '../sample-images/FROST LOGO.jpg';
import fssaiImage from '../sample-images/afbb6beb2bc3e1cd789dd0117c0ee637-removebg-preview.png';
import { pageTransitions } from '../utils/pageTransitions';
import ScrollReveal from '../components/ScrollReveal';
import Footer from '../components/Footer';

const About = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const slides = [
    {
      id: 1,
      type: 'logo',
    },
    {
      id: 2,
      type: 'fssai',
    },
  ];

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [slides.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Touch swipe handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left - next slide
      handleNextSlide();
    }
    if (touchStart - touchEnd < -75) {
      // Swipe right - previous slide
      handlePrevSlide();
    }
  };
  const values = [
    {
      icon: <Cake style={{ fontSize: '48px', color: '#e91e63' }} />,
      title: 'Quality Ingredients',
      description: 'We use only the finest, freshest ingredients in all our baked goods.',
    },
    {
      icon: <LocalShipping style={{ fontSize: '48px', color: '#e91e63' }} />,
      title: 'Fast Delivery',
      description: 'Fresh products delivered to your doorstep with care and speed.',
    },
    {
      icon: <Favorite style={{ fontSize: '48px', color: '#e91e63' }} />,
      title: 'Made with Love',
      description: 'Every item is crafted with passion and attention to detail.',
    },
    {
      icon: <Star style={{ fontSize: '48px', color: '#e91e63' }} />,
      title: 'Customer Satisfaction',
      description: 'Your happiness is our priority. We strive for perfection in every order.',
    },
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransitions.about}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box sx={{ paddingTop: 0, flex: 1 }}>
        
        {/* Carousel Section */}
        <Box sx={{ pt: 0, pb: 0, position: 'relative', zIndex: 1 }}>
          <Box
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            sx={{
              position: 'relative',
              height: { xs: '220px', sm: '350px', md: '400px' },
              width: '100%',
              overflow: 'hidden',
              touchAction: 'pan-y',
              cursor: 'grab',
              marginTop: '6px',
              '&:active': {
                cursor: 'grabbing',
              },
            }}
          >
            <AnimatePresence mode="wait">
              {currentSlide === 0 && (
                <motion.div
                  key="slide1"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  style={{ height: '100%' }}
                >
                  <Box 
                    sx={{ 
                      position: 'relative',
                      height: '100%',
                      width: '100%',
                      backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1920&q=95&auto=format')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Container maxWidth="lg">
                      <Box sx={{ textAlign: 'center', color: '#fff', px: { xs: 2, sm: 3 }, py: { xs: 1, sm: 0 } }}>
                        {/* Logo */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 1, sm: 3 } }}>
                          <img
                            src={frostLogo}
                            alt="Frost & Crinkle Logo"
                            style={{ 
                              width: '100%', 
                              maxWidth: '120px', 
                              height: 'auto', 
                              objectFit: 'contain',
                              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                            }}
                          />
                        </Box>
                        
                        <Typography 
                          variant="h3" 
                          sx={{ 
                            fontWeight: 700, 
                            mb: { xs: 0.5, sm: 2 }, 
                            color: '#fff', 
                            fontSize: { xs: '1.1rem', sm: '2rem', md: '2.5rem' },
                            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                          }}
                        >
                          Our Story
                        </Typography>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: '#fff', 
                            fontSize: { xs: '0.75rem', sm: '1rem', md: '1.1rem' }, 
                            lineHeight: { xs: 1.4, sm: 1.6 },
                            maxWidth: '700px', 
                            mx: 'auto',
                            px: { xs: 1, sm: 0 },
                            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                          }}
                        >
                          Crafting artisan brownies and desserts that elevate every celebration. 
                          Excellence in every bite.
                        </Typography>
                      </Box>
                    </Container>
                  </Box>
                </motion.div>
              )}

              {currentSlide === 1 && (
                <motion.div
                  key="slide2"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  style={{ height: '100%' }}
                >
                  <Box 
                    sx={{ 
                      position: 'relative',
                      height: '100%',
                      width: '100%',
                      backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1920&q=95&auto=format')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Container maxWidth="lg">
                      <Box sx={{ textAlign: 'center', color: '#fff', px: { xs: 2, sm: 3 }, py: { xs: 1, sm: 0 } }}>
                        {/* FSSAI Logo */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 1, sm: 3 } }}>
                          <img
                            src={fssaiImage}
                            alt="FSSAI Certification"
                            style={{ 
                              width: '100%', 
                              maxWidth: '100px', 
                              height: 'auto', 
                              objectFit: 'contain',
                              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                            }}
                          />
                        </Box>
                        
                        <Typography 
                          variant="h3" 
                          sx={{ 
                            fontWeight: 700, 
                            mb: { xs: 0.5, sm: 2 }, 
                            color: '#fff', 
                            fontSize: { xs: '1.1rem', sm: '2rem', md: '2.5rem' },
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                          }}
                        >
                          FSSAI Certified
                        </Typography>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: '#fff', 
                            fontSize: { xs: '0.75rem', sm: '1rem', md: '1.1rem' }, 
                            lineHeight: { xs: 1.4, sm: 1.6 },
                            maxWidth: '700px', 
                            mx: 'auto',
                            mb: { xs: 0.5, sm: 2 },
                            px: { xs: 1, sm: 0 },
                            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                          }}
                        >
                          Certified by Food Safety and Standards Authority of India. 
                          Your health and safety are our top priorities.
                        </Typography>
                        
                        {/* Badge */}
                        <Box
                          sx={{
                            display: 'inline-block',
                            mt: { xs: 0.5, sm: 2 },
                            px: { xs: 2.5, sm: 4 },
                            py: { xs: 0.75, sm: 1.5 },
                            borderRadius: '50px',
                            background: '#fff',
                            color: '#4CAF50',
                            fontSize: { xs: '0.7rem', sm: '0.9rem', md: '1rem' },
                            fontWeight: 700,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                          }}
                        >
                          ✓ Certified & Compliant
                        </Box>
                      </Box>
                    </Container>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Box>

        {/* Awards & Certifications Section */}
        <Box sx={{ background: '#f9f9f9', py: { xs: 6, md: 10 }, mt: { xs: -2, md: -3 } }}>
          <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
            <ScrollReveal animation="slideUp">
              <Typography variant="h3" sx={{ fontWeight: 700, textAlign: 'center', mb: { xs: 1.5, sm: 2 }, color: '#333', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
                Awards & Certifications
              </Typography>
            </ScrollReveal>
            <ScrollReveal animation="slideUp" delay={0.1}>
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#666', mb: { xs: 4, sm: 5, md: 6 }, fontSize: { xs: '0.9rem', sm: '1rem' }, maxWidth: '600px', mx: 'auto' }}>
                Recognized for excellence in quality and service
              </Typography>
            </ScrollReveal>

            <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
              {/* FSSAI - First */}
              <Grid item xs={12} sm={6} md={4}>
                <ScrollReveal animation="slideUp" delay={0.1}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: '12px',
                      border: '2px solid #4CAF50',
                      boxShadow: 'none',
                      transition: 'all 0.3s ease',
                      background: 'linear-gradient(135deg, #ffffff 0%, #f1f8f4 100%)',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(76, 175, 80, 0.25)',
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: { xs: 3, sm: 4 } }}>
                      <Box 
                        sx={{ 
                          mb: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <Box
                          sx={{
                            width: { xs: '120px', md: '150px' },
                            height: { xs: '120px', md: '150px' },
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <img
                            src={fssaiImage}
                            alt="FSSAI Certification"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                            }}
                          />
                        </Box>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#333', fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                        FSSAI Certified
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6 }}>
                        Food Safety and Standards Authority of India certified for hygiene and quality standards
                      </Typography>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              </Grid>

              {/* Best Bakery - Second */}
              <Grid item xs={12} sm={6} md={4}>
                <ScrollReveal animation="slideUp" delay={0.2}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: '12px',
                      border: '1px solid #e0e0e0',
                      boxShadow: 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(233, 30, 99, 0.15)',
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: { xs: 3, sm: 4 } }}>
                      <Box sx={{ mb: 2 }}>
                        <EmojiEvents sx={{ fontSize: { xs: '48px', md: '56px' }, color: '#FFD700' }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#333', fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                        Best Bakery 2024
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6 }}>
                        Awarded by Coimbatore Food Excellence Council for outstanding quality and innovation
                      </Typography>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              </Grid>

              {/* 5-Star Rating - Third */}
              <Grid item xs={12} sm={6} md={4}>
                <ScrollReveal animation="slideUp" delay={0.3}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: '12px',
                      border: '1px solid #e0e0e0',
                      boxShadow: 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(233, 30, 99, 0.15)',
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: { xs: 3, sm: 4 } }}>
                      <Box sx={{ mb: 2 }}>
                        <Grade sx={{ fontSize: { xs: '48px', md: '56px' }, color: '#e91e63' }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#333', fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                        5-Star Rating
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6 }}>
                        Consistently rated 5 stars by our customers for taste, quality, and service excellence
                      </Typography>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Stats Section */}
        <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 }, px: { xs: 2, sm: 3 } }}>
          {/* Stats */}
          <Grid container spacing={{ xs: 3, md: 4 }} sx={{ maxWidth: '600px', mx: 'auto' }} justifyContent="center">
            <Grid item xs={6}>
              <Paper 
                elevation={2}
                sx={{ 
                  p: { xs: 3, sm: 4 }, 
                  textAlign: 'center',
                  borderRadius: '12px',
                  background: '#fff',
                  border: '2px solid #ffe8f0'
                }}
              >
                <Typography variant="h2" sx={{ fontWeight: 700, color: '#e91e63', mb: 1, fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' } }}>
                  2500+
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', fontSize: { xs: '0.9rem', sm: '1rem', md: '1.15rem' }, fontWeight: 500 }}>
                  Happy Customers
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper 
                elevation={2}
                sx={{ 
                  p: { xs: 3, sm: 4 }, 
                  textAlign: 'center',
                  borderRadius: '12px',
                  background: '#fff',
                  border: '2px solid #ffe8f0'
                }}
              >
                <Typography variant="h2" sx={{ fontWeight: 700, color: '#e91e63', mb: 1, fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' } }}>
                  13
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', fontSize: { xs: '0.9rem', sm: '1rem', md: '1.15rem' }, fontWeight: 500 }}>
                  Signature Products
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/* Values Section */}
        <Box sx={{ background: '#ffffff', py: { xs: 6, md: 10 }, position: 'relative', zIndex: 2 }}>
          <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
            <ScrollReveal animation="slideUp">
            <Typography variant="h3" sx={{ fontWeight: 700, textAlign: 'center', mb: { xs: 1.5, sm: 2 }, color: '#333', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
              Our Values
            </Typography>
            </ScrollReveal>
            <ScrollReveal animation="slideUp" delay={0.1}>
            <Typography variant="body1" sx={{ textAlign: 'center', color: '#666', mb: { xs: 4, sm: 5, md: 6 }, fontSize: { xs: '0.9rem', sm: '1rem' }, maxWidth: '600px', mx: 'auto', px: { xs: 2, sm: 0 } }}>
              The principles that guide everything we do
            </Typography>
            </ScrollReveal>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(4, 1fr)',
                },
                gap: { xs: 3, md: 4 },
              }}
            >
              {values.map((value, index) => (
                <ScrollReveal key={index} animation="scale" delay={index * 0.1}>
                <Card
                  sx={{
                    textAlign: 'center',
                    p: { xs: 2.5, sm: 3, md: 4 },
                    borderRadius: { xs: '12px', sm: '8px' },
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(233, 30, 99, 0.15)',
                    },
                  }}
                >
                  <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>{value.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: { xs: 1, sm: 1.5 }, color: '#333', fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                    {value.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6, fontSize: { xs: '0.875rem', sm: '0.95rem' } }}>
                    {value.description}
                  </Typography>
                </Card>
                </ScrollReveal>
              ))}
            </Box>
          </Container>
        </Box>

        {/* Why Choose Us Section */}
        <Box sx={{ background: 'linear-gradient(135deg, #fff5f8 0%, #ffffff 100%)', py: { xs: 6, md: 10 } }}>
          <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
            <ScrollReveal animation="slideUp">
              <Typography variant="h3" sx={{ fontWeight: 700, textAlign: 'center', mb: { xs: 1.5, sm: 2 }, color: '#333', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
                Why Choose Frost & Crinkle?
              </Typography>
            </ScrollReveal>
            <ScrollReveal animation="slideUp" delay={0.1}>
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#666', mb: { xs: 4, sm: 5, md: 6 }, fontSize: { xs: '0.9rem', sm: '1rem' }, maxWidth: '700px', mx: 'auto' }}>
                We're not just another bakery. Here's what makes us special
              </Typography>
            </ScrollReveal>

            <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
              <Grid item xs={12} sm={6} md={3}>
                <ScrollReveal animation="slideUp" delay={0.1}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #e91e63 0%, #ff6b9d 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        boxShadow: '0 4px 12px rgba(233, 30, 99, 0.3)',
                      }}
                    >
                      <Cake sx={{ fontSize: '40px', color: '#fff' }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#333', fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                      Fresh Daily
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6 }}>
                      All products baked fresh every morning using premium ingredients
                    </Typography>
                  </Box>
                </ScrollReveal>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <ScrollReveal animation="slideUp" delay={0.2}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)',
                      }}
                    >
                      <LocalShipping sx={{ fontSize: '40px', color: '#fff' }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#333', fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                      Fast Delivery
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6 }}>
                      Quick delivery within 10 km in Coimbatore, ensuring freshness
                    </Typography>
                  </Box>
                </ScrollReveal>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <ScrollReveal animation="slideUp" delay={0.3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                      }}
                    >
                      <VerifiedUser sx={{ fontSize: '40px', color: '#fff' }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#333', fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                      FSSAI Certified
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6 }}>
                      Fully licensed and compliant with food safety standards
                    </Typography>
                  </Box>
                </ScrollReveal>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <ScrollReveal animation="slideUp" delay={0.4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)',
                      }}
                    >
                      <Favorite sx={{ fontSize: '40px', color: '#fff' }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#333', fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                      Made with Love
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6 }}>
                      Every item crafted with passion and attention to detail
                    </Typography>
                  </Box>
                </ScrollReveal>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Customer Testimonials */}
        <Box sx={{ background: '#fff', py: { xs: 6, md: 10 } }}>
          <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
            <ScrollReveal animation="slideUp">
              <Typography variant="h3" sx={{ fontWeight: 700, textAlign: 'center', mb: { xs: 1.5, sm: 2 }, color: '#333', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
                What Our Customers Say
              </Typography>
            </ScrollReveal>
            <ScrollReveal animation="slideUp" delay={0.1}>
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#666', mb: { xs: 4, sm: 5, md: 6 }, fontSize: { xs: '0.9rem', sm: '1rem' }, maxWidth: '600px', mx: 'auto' }}>
                Real feedback from our happy customers
              </Typography>
            </ScrollReveal>

            <Grid container spacing={{ xs: 3, md: 4 }}>
              <Grid item xs={12} md={4}>
                <ScrollReveal animation="slideUp" delay={0.1}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: '12px',
                      border: '1px solid #f0f0f0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(233, 30, 99, 0.15)',
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                      <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} sx={{ color: '#FFD700', fontSize: '20px' }} />
                        ))}
                      </Box>
                      <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.8, mb: 2, fontStyle: 'italic' }}>
                        "The brownies are absolutely divine! Fresh, rich, and perfectly baked. Best bakery in Coimbatore!"
                      </Typography>
                      <Typography variant="subtitle2" sx={{ color: '#333', fontWeight: 600 }}>
                        Priya Sharma
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#999' }}>
                        Regular Customer
                      </Typography>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              </Grid>

              <Grid item xs={12} md={4}>
                <ScrollReveal animation="slideUp" delay={0.2}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: '12px',
                      border: '1px solid #f0f0f0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(233, 30, 99, 0.15)',
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                      <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} sx={{ color: '#FFD700', fontSize: '20px' }} />
                        ))}
                      </Box>
                      <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.8, mb: 2, fontStyle: 'italic' }}>
                        "Ordered a custom cake for my daughter's birthday. It was stunning and tasted amazing. Highly recommend!"
                      </Typography>
                      <Typography variant="subtitle2" sx={{ color: '#333', fontWeight: 600 }}>
                        Rajesh Kumar
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#999' }}>
                        Happy Parent
                      </Typography>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              </Grid>

              <Grid item xs={12} md={4}>
                <ScrollReveal animation="slideUp" delay={0.3}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: '12px',
                      border: '1px solid #f0f0f0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(233, 30, 99, 0.15)',
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                      <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} sx={{ color: '#FFD700', fontSize: '20px' }} />
                        ))}
                      </Box>
                      <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.8, mb: 2, fontStyle: 'italic' }}>
                        "Quality ingredients, beautiful presentation, and excellent service. Worth every penny!"
                      </Typography>
                      <Typography variant="subtitle2" sx={{ color: '#333', fontWeight: 600 }}>
                        Anita Menon
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#999' }}>
                        Food Enthusiast
                      </Typography>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Mission Section */}
        <Container maxWidth="md" sx={{ padding: { xs: '40px 20px', sm: '60px 20px', md: '80px 20px' } }}>
          <ScrollReveal animation="zoomIn">
          <Paper
            elevation={0}
            sx={{
              padding: { xs: '40px 24px', sm: '50px 32px', md: '60px 40px' },
              borderRadius: { xs: '12px', sm: '16px' },
              background: 'linear-gradient(135deg, #e91e63 0%, #ff6b9d 100%)',
              color: '#fff',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                marginBottom: { xs: '16px', sm: '24px' },
                fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem' },
              }}
            >
              Our Mission
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 400,
                lineHeight: 1.8,
                opacity: 0.95,
                fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' },
              }}
            >
              To redefine the art of dessert-making by delivering unparalleled quality, innovation, and
              customer satisfaction. We're dedicated to creating memorable experiences through our
              handcrafted brownies, bespoke cakes, and artisan desserts.
            </Typography>
          </Paper>
          </ScrollReveal>
        </Container>
        
        
        {/* Footer */}
        <Footer />
        </Box>
      </Box>
    </motion.div>
  );
};

export default About;
