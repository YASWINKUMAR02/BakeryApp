import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Container, Typography, Card, CardContent,
  Chip,
  IconButton,
  Button,
} from '@mui/material';
import { Star, ArrowForward, Cake, ShoppingCart, ShoppingBag } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../../components/Footer';
import PullToRefresh from '../../components/PullToRefresh';
import ScrollReveal from '../../components/ScrollReveal';
import { pageTransitions } from '../../utils/pageTransitions';
import { itemAPI, carouselAPI, reviewAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ProductGridSkeleton } from '../../components/LoadingSkeleton';
import { optimizeImageUrl } from '../../utils/imageOptimization';
import CustomerHeader from '../../components/CustomerHeader';
import ProductCard from '../../components/ProductCard';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [itemReviews, setItemReviews] = useState({});

  // Touch swipe handlers for carousel
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (carouselSlides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [carouselSlides.length]);

  const fetchData = async () => {
    try {
      const [itemsResponse, carouselResponse] = await Promise.all([
        itemAPI.getAll(),
        carouselAPI.getActive(),
      ]);

      if (itemsResponse.data.success) {
        const itemsData = itemsResponse.data.data;
        setItems(itemsData);

        // Fetch reviews for items (optional optimization: fetch only for featured)
        const reviewsData = {};
        await Promise.all(
          itemsData.slice(0, 10).map(async (item) => { // Limit to first 10 for perf
            try {
              const reviewResponse = await reviewAPI.getByItem(item.id);
              if (reviewResponse.data.success) {
                reviewsData[item.id] = reviewResponse.data.data;
              }
            } catch (err) {
              reviewsData[item.id] = [];
            }
          })
        );
        setItemReviews(reviewsData);
      }

      if (carouselResponse.data.success) {
        const slides = carouselResponse.data.data.map(slide => ({
          title: slide.title,
          subtitle: slide.subtitle,
          description: slide.description,
          image: slide.imageUrl,
          buttonText: slide.buttonText || 'Shop Now',
          buttonAction: () => {
            if (slide.linkType === 'CATEGORY') {
              navigate(`/shop?categoryId=${slide.linkValue}`);
            } else if (slide.linkType === 'ITEM') {
              navigate(`/item/${slide.linkValue}`);
            } else {
              navigate(slide.linkValue || '/shop');
            }
          },
        }));
        setCarouselSlides(slides);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    await fetchData();
  };

  const nextSlide = () => {
    if (carouselSlides.length > 0)
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    if (carouselSlides.length > 0)
      setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) nextSlide();
    if (touchStart - touchEnd < -75) prevSlide();
  };

  const getItemRatingData = (itemId) => {
    const reviews = itemReviews[itemId] || [];
    if (reviews.length === 0) return { averageRating: 0, reviewCount: 0 };
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return {
      averageRating: (totalRating / reviews.length).toFixed(1),
      reviewCount: reviews.length
    };
  };

  // UI Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1, when: "beforeChildren" }
    }
  };

  const mobileProductVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9, rotateX: 15 },
    visible: (i) => ({
      opacity: 1, y: 0, scale: 1, rotateX: 0,
      transition: {
        delay: i * 0.08, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring", stiffness: 100, damping: 15
      }
    }),
    tap: { scale: 0.95, transition: { duration: 0.1 } }
  };

  // Filter featured or top items for display
  const displayItems = items.filter(i => i.featured).slice(0, 6);
  // Fallback if no featured items
  const finalDisplayItems = displayItems.length > 0 ? displayItems : items.slice(0, 6);

  if (loading && items.length === 0) {
    return (
      <Box sx={{ pt: '100px' }}>
        <ProductGridSkeleton />
      </Box>
    );
  }

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
              height: { xs: '240px', sm: '300px', md: '500px' }, // Adjusted height
              width: '100%',
              overflow: 'hidden',
              background: '#000',
              marginTop: '64px',
              touchAction: 'pan-y',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}
          >
            <AnimatePresence mode="wait">
              {carouselSlides.length > 0 && (
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  }}
                >
                  <Box
                    sx={{
                      width: '100%', height: '100%',
                      backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.7) 100%), url(${carouselSlides[currentSlide].image})`,
                      backgroundSize: 'cover', backgroundPosition: 'center',
                      display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
                      position: 'relative',
                    }}
                    component={motion.div}
                    initial={{ scale: 1.15 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Container maxWidth="lg" sx={{ height: '100%', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                      <Box sx={{ color: '#fff', maxWidth: { xs: '100%', sm: '600px' }, padding: { xs: '20px', sm: '0' } }}>
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <Typography variant="h1" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '28px', md: '56px' }, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                            {carouselSlides[currentSlide].title}
                          </Typography>
                          <Typography variant="h3" sx={{ fontWeight: 600, fontSize: { xs: '18px', md: '32px' }, mb: 3, color: '#e91e63' }}>
                            {carouselSlides[currentSlide].subtitle}
                          </Typography>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <Button
                            variant="contained" size="large"
                            onClick={() => carouselSlides[currentSlide].buttonAction()}
                            endIcon={<ArrowForward />}
                            sx={{
                              background: 'linear-gradient(135deg, #e91e63 0%, #ad1457 100%)',
                              color: '#fff', padding: '14px 32px', borderRadius: '50px',
                              fontWeight: 700, textTransform: 'none',
                              fontSize: '1rem',
                              boxShadow: '0 8px 25px rgba(233, 30, 99, 0.3)',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 12px 30px rgba(233, 30, 99, 0.4)',
                              }
                            }}
                          >
                            {carouselSlides[currentSlide].buttonText}
                          </Button>
                        </motion.div>
                      </Box>
                    </Container>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>

            {carouselSlides.length === 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'white' }}>
                <Typography>No slides available</Typography>
              </Box>
            )}

            {/* Indicators */}
            <Box sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 1, zIndex: 3 }}>
              {carouselSlides.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  sx={{
                    width: currentSlide === index ? 24 : 8, height: 8, borderRadius: 4,
                    background: currentSlide === index ? '#e91e63' : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer', transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Products Section */}
          <Box sx={{ background: '#fafafa', py: { xs: 4, md: 8 }, flex: 1 }}>
            <Container maxWidth="lg">
              <ScrollReveal animation="slideUp">
                <Typography variant="h2" sx={{ textAlign: 'center', fontWeight: 800, mb: 4, fontSize: { xs: '2rem', md: '3.5rem' }, color: '#1a1a1a' }}>
                  Our Delicious Products
                </Typography>
              </ScrollReveal>

              <Box
                component={motion.div}
                variants={containerVariants}
                initial="hidden"
                animate={!loading ? "visible" : "hidden"}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                  gap: { xs: 2, md: 3 },
                }}
              >
                {finalDisplayItems.map((item, index) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    ratingData={getItemRatingData(item.id)}
                    index={index}
                  />
                ))}
              </Box>

              <Box sx={{ textAlign: 'center', mt: 6 }}>
                <Button
                  variant="contained" size="large"
                  onClick={() => navigate('/shop')}
                  endIcon={<ArrowForward />}
                  sx={{
                    background: 'linear-gradient(135deg, #e91e63 0%, #ad1457 100%)',
                    color: '#fff', padding: '16px 40px', borderRadius: '50px',
                    boxShadow: '0 8px 24px rgba(233, 30, 99, 0.3)',
                  }}
                >
                  Browse All Products
                </Button>
              </Box>

            </Container>
          </Box>

          <Footer />
        </Box>
      </PullToRefresh>
    </motion.div>
  );
};

export default Home;
