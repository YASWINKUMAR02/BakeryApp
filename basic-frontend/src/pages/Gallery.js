import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Box, Typography, Dialog, IconButton, Chip, Card, CardMedia, Button } from '@mui/material';
import { Close, ChevronLeft, ChevronRight, AutoAwesome } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';
import LoadingAnimation from '../components/LoadingAnimation';
import { pageTransitions } from '../utils/pageTransitions';
import img1 from '../sample-images/570961690_18312117046219264_427735923425516223_n.webp';
import img2 from '../sample-images/572136977_18312086584219264_3234845735325165628_n.webp';
import img3 from '../sample-images/572720764_18311989669219264_1318692590944923299_n.webp';
import img4 from '../sample-images/572970496_18311990575219264_2197306569340814514_n.webp';
import img5 from '../sample-images/573598986_18311989333219264_6181450640736486889_n.webp';
import img6 from '../sample-images/573845599_18312400399219264_8377656131075075876_n.webp';
import img8 from '../sample-images/575254343_18312331159219264_1989936078330582217_n.webp';

const Gallery = () => {
  const location = useLocation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Reload when clicking Gallery link while on Gallery page
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [location.key]); // Triggers when navigation occurs

  const galleryImages = [
    { id: 1, url: img1, title: 'Delicious Cake' },
    { id: 2, url: img2, title: 'Premium Brownies' },
    { id: 3, url: img3, title: 'Birthday Cake' },
    { id: 4, url: img4, title: 'Sweet Treats' },
    { id: 5, url: img5, title: 'Celebration Cake' },
    { id: 6, url: img6, title: 'Brownie Box' },
    { id: 7, url: img8, title: 'Dessert Platter' },
  ];

  const carouselSlides = galleryImages;

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselSlides.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? carouselSlides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === carouselSlides.length - 1 ? 0 : prev + 1));
  };

  const handleCarouselTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleCarouselTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleCarouselTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      handleNextSlide();
    }
    if (touchStart - touchEnd < -75) {
      handlePrevSlide();
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  const handleNext = () => {
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % galleryImages.length;
    setSelectedImage(galleryImages[nextIndex]);
  };

  const handlePrev = () => {
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    setSelectedImage(galleryImages[prevIndex]);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left - next image
      handleNext();
    }
    if (touchStart - touchEnd < -75) {
      // Swipe right - previous image
      handlePrev();
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransitions.gallery}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box sx={{ paddingTop: 0, paddingBottom: { xs: '40px', sm: '60px' }, flex: 1, background: '#f5f5f5' }}>
          
          {/* Catchy Banner - All Devices */}
          <Box 
            sx={{ 
              display: 'block',
              background: 'linear-gradient(90deg, #e91e63, #ff6b9d, #e91e63)',
              backgroundSize: '200% 100%',
              animation: 'gradient 3s ease infinite',
              py: { xs: 1.5, md: 2 },
              px: 2,
              mt: { xs: '10px', md: '10px' },
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(233, 30, 99, 0.3)',
              '@keyframes gradient': {
                '0%': {
                  backgroundPosition: '0% 50%',
                },
                '50%': {
                  backgroundPosition: '100% 50%',
                },
                '100%': {
                  backgroundPosition: '0% 50%',
                },
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <AutoAwesome 
                sx={{ 
                  fontSize: '1.2rem',
                  animation: 'spin 3s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }} 
              />
              <Typography
                sx={{
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                  animation: 'pulse 2s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': {
                      transform: 'scale(1)',
                    },
                    '50%': {
                      transform: 'scale(1.05)',
                    },
                  },
                }}
              >
                Swipe to Explore Our Delights
              </Typography>
              <AutoAwesome 
                sx={{ 
                  fontSize: '1.2rem',
                  animation: 'spin 3s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }} 
              />
            </Box>
          </Box>

          {/* Carousel Section - Mobile/Tablet Only */}
          <Box sx={{ pt: 0, pb: 0, position: 'relative', zIndex: 1, display: { xs: 'block', md: 'none' } }}>
            <Box
              onTouchStart={handleCarouselTouchStart}
              onTouchMove={handleCarouselTouchMove}
              onTouchEnd={handleCarouselTouchEnd}
              sx={{
                position: 'relative',
                height: { xs: '220px', sm: '350px' },
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
                {galleryImages.map((image, index) => (
                  currentSlide === index && (
                    <motion.div
                      key={image.id}
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
                          backgroundImage: `url(${image.url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          display: 'flex',
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                        }}
                      >
                        <Box 
                          sx={{ 
                            width: '100%',
                            background: 'linear-gradient(transparent, rgba(0,0,0,0.2))',
                            py: { xs: 1.5, sm: 2 },
                            px: { xs: 2, sm: 3 }
                          }}
                        >
                          <Container maxWidth="lg">
                            <Typography 
                              variant="h5" 
                              sx={{ 
                                fontWeight: 600, 
                                color: '#fff', 
                                fontSize: { xs: '1rem', sm: '1.5rem', md: '1.75rem' },
                                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                textAlign: 'center'
                              }}
                            >
                              {image.title}
                            </Typography>
                          </Container>
                        </Box>
                      </Box>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </Box>
          </Box>

          {loading ? (
            <LoadingAnimation message="Loading our delicious gallery..." />
          ) : (
            <Container maxWidth="lg" sx={{ paddingX: { xs: 2, sm: 3 }, mt: { xs: 3, md: 4 } }}>
              {/* Gallery Stats */}
              <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 }, mt: { xs: 2, md: 3 } }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    color: '#333',
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                    fontWeight: 700,
                    mb: { xs: 1.5, sm: 2 }
                  }}
                >
                  Our Creations
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#666',
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    maxWidth: '600px',
                    mx: 'auto',
                    lineHeight: 1.6
                  }}
                >
                  {galleryImages.length} delicious masterpieces showcasing our craftsmanship
                </Typography>
              </Box>

              {/* Gallery Grid */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { 
                    xs: 'repeat(2, 1fr)', 
                    sm: 'repeat(3, 1fr)', 
                    md: 'repeat(4, 1fr)',
                    lg: 'repeat(4, 1fr)'
                  },
                  gap: { xs: 2, sm: 2.5, md: 3 },
                  mb: { xs: 4, md: 6 }
                }}
              >
                {galleryImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  <Card
                    onClick={() => handleImageClick(image)}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      border: 'none',
                      transition: 'all 0.3s ease',
                      aspectRatio: '1 / 1',
                      overflow: 'hidden',
                      position: 'relative',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(233, 30, 99, 0.2)',
                        '& .image-overlay': {
                          opacity: 1,
                        },
                        '& .MuiCardMedia-root': {
                          transform: 'scale(1.05)',
                        }
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={image.url}
                      alt={image.title}
                      loading="lazy"
                      decoding="async"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        backgroundColor: '#f5f5f5',
                        transition: 'transform 0.3s ease',
                      }}
                    />
                    {/* Hover Overlay */}
                    <Box
                      className="image-overlay"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to top, rgba(233, 30, 99, 0.8) 0%, transparent 60%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: 2,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#fff',
                          fontWeight: 600,
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        }}
                      >
                        {image.title}
                      </Typography>
                    </Box>
                  </Card>
                </motion.div>
                ))}
              </Box>

              {/* Call to Action Section */}
              <Box sx={{ textAlign: 'center', mt: { xs: 6, md: 8 }, mb: { xs: 4, md: 6 } }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 2, 
                      color: '#333',
                      fontSize: { xs: '1.5rem', md: '2rem' }
                    }}
                  >
                    Ready to Order?
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#666', 
                      mb: 3,
                      fontSize: { xs: '0.95rem', md: '1.1rem' },
                      maxWidth: '600px',
                      mx: 'auto'
                    }}
                  >
                    Browse our full collection and place your order today. Fresh baked goods delivered to your doorstep!
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => window.location.href = '/shop'}
                      sx={{
                        backgroundColor: '#e91e63',
                        color: '#fff',
                        px: 4,
                        py: 1.5,
                        fontSize: { xs: '0.95rem', md: '1rem' },
                        fontWeight: 600,
                        borderRadius: '8px',
                        textTransform: 'none',
                        boxShadow: '0 4px 12px rgba(233, 30, 99, 0.3)',
                        '&:hover': {
                          backgroundColor: '#c2185b',
                          boxShadow: '0 6px 16px rgba(233, 30, 99, 0.4)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Shop Now
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => window.location.href = '/contact'}
                      sx={{
                        borderColor: '#e91e63',
                        color: '#e91e63',
                        px: 4,
                        py: 1.5,
                        fontSize: { xs: '0.95rem', md: '1rem' },
                        fontWeight: 600,
                        borderRadius: '8px',
                        textTransform: 'none',
                        borderWidth: '2px',
                        '&:hover': {
                          borderColor: '#c2185b',
                          backgroundColor: 'rgba(233, 30, 99, 0.05)',
                          borderWidth: '2px',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Contact Us
                    </Button>
                  </Box>
                </motion.div>
              </Box>
            </Container>
          )}
        </Box>

        {/* Footer */}
        <Footer />
      </Box>

      {/* Lightbox Dialog */}
      <Dialog
        open={!!selectedImage}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            boxShadow: 'none',
            borderRadius: 0,
          },
        }}
      >
        {selectedImage && (
          <Box 
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            sx={{ position: 'relative', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', touchAction: 'pan-y' }}>
            {/* Close Button */}
            <IconButton
              onClick={handleClose}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                color: '#fff',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
                zIndex: 2,
              }}
            >
              <Close />
            </IconButton>

            {/* Previous Button */}
            <IconButton
              onClick={handlePrev}
              sx={{
                position: 'absolute',
                left: 16,
                color: '#fff',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
                zIndex: 2,
              }}
            >
              <ChevronLeft />
            </IconButton>

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImage.id}
                src={selectedImage.url}
                alt={`Gallery image ${selectedImage.id}`}
                loading="eager"
                decoding="async"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                style={{
                  maxWidth: '90%',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                }}
              />
            </AnimatePresence>

            {/* Next Button */}
            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: 16,
                color: '#fff',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
                zIndex: 2,
              }}
            >
              <ChevronRight />
            </IconButton>
          </Box>
        )}
      </Dialog>
    </motion.div>
  );
};

export default Gallery;
