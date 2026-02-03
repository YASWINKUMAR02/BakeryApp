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
import { alpha } from '@mui/material/styles';
import Footer from '../../components/Footer';
import PullToRefresh from '../../components/PullToRefresh';
import ScrollReveal from '../../components/ScrollReveal';
import SectionHeader from '../../components/SectionHeader';
import { pageTransitions } from '../../utils/pageTransitions';
import { itemAPI, carouselAPI, reviewAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ProductGridSkeleton } from '../../components/LoadingSkeleton';
import { optimizeImageUrl } from '../../utils/imageOptimization';
import CustomerHeader from '../../components/CustomerHeader';
import ProductCard from '../../components/ProductCard';
import designTokens from '../../theme/designTokens';
import LoadingOverlay from '../../components/LoadingOverlay';

const { colors, gradients, radii, shadows, spacing, transitions } = designTokens;

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [itemReviews, setItemReviews] = useState({});

  // Check if user is guest
  const isGuest = !user;

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
    setLoading(true);
    try {
      const [itemsResponse, carouselResponse] = await Promise.all([
        itemAPI.getAll(),
        carouselAPI.getActive(),
      ]);

      // Determine what items to show
      let itemsToShow = [];
      const shouldShowSampleItems = isGuest && !itemsResponse?.data?.success;
      
      if (shouldShowSampleItems) {
        // Show sample items for guest users when API fails or no real products
        itemsToShow = getSampleItems();
      } else if (itemsResponse.data.success) {
        // Show real products for both guest and logged-in users when API works
        let itemsData = itemsResponse.data.data;
        console.log('Items loaded:', itemsData.length);

        // Enhance first 4 items as Best Sellers to show as "Top 4"
        itemsData = itemsData.map((item, index) => ({
          ...item,
          isBestSeller: item.isBestSeller || index < 4,
          isNew: item.isNew || (index >= 4 && index < 8)
        }));

        itemsToShow = itemsData;

        // Fetch reviews for items
        const reviewsData = {};
        await Promise.all(
          itemsData.slice(0, 10).map(async (item) => {
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
      } else {
        console.log('Items API returned no success:', itemsResponse.data);
        // Set sample items for guest users when API fails
        itemsToShow = getSampleItems();
      }

      setItems(itemsToShow);
      console.log('Items set for display:', itemsToShow.length);
      console.log('Is guest user:', isGuest);

      if (carouselResponse.data.success && carouselResponse.data.data && carouselResponse.data.data.length > 0) {
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
        console.log('Carousel slides loaded:', slides.length);
      } else {
        console.log('Carousel API returned no slides:', carouselResponse.data);
        // Set default slides if API fails or returns no data
        setCarouselSlides(getDefaultSlides());
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      // Set default slides if API fails
      setCarouselSlides(getDefaultSlides());
      // Set empty items array - API failed, let page handle gracefully
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultSlides = () => {
    return [
      {
        title: 'Welcome to Frost & Crinkle',
        subtitle: 'Artisanal Bakery',
        description: 'Discover our handcrafted cakes, pastries, and baked goods made with love',
        image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=1920&q=80',
        buttonText: 'Shop Now',
        buttonAction: () => navigate('/shop'),
      },
      {
        title: 'Fresh Daily Baking',
        subtitle: 'Made with Premium Ingredients',
        description: 'From classic favorites to innovative creations, we bake something special for everyone',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1920&q=80',
        buttonText: 'View Menu',
        buttonAction: () => navigate('/shop'),
      },
      {
        title: 'Custom Orders',
        subtitle: 'Special Moments Deserve Special Cakes',
        description: 'Let us create the perfect cake for your celebrations and special occasions',
        image: 'https://images.unsplash.com/photo-1549965768-3a161c1e04e5?w=1920&q=80',
        buttonText: 'Order Custom',
        buttonAction: () => navigate('/contact'),
      },
    ];
  };

  const getSampleItems = () => {
    return [
      {
        id: 1,
        name: 'Classic Red Velvet Cake',
        description: 'Moist red velvet layers with cream cheese frosting',
        price: 450,
        imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80',
        category: 'Cakes',
        isBestSeller: true,
        isNew: false,
        rating: 4.8,
        stock: 10,
        isSample: true, // Flag to identify sample items
      },
      {
        id: 2,
        name: 'Chocolate Croissant',
        description: 'Buttery, flaky croissant with rich chocolate filling',
        price: 120,
        imageUrl: 'https://images.unsplash.com/photo-1559707953-8b1cba1b6b71?w=400&q=80',
        category: 'Pastries',
        isBestSeller: true,
        isNew: false,
        rating: 4.7,
        stock: 15,
        isSample: true,
      },
      {
        id: 3,
        name: 'Strawberry Cheesecake',
        description: 'Creamy cheesecake with fresh strawberry topping',
        price: 380,
        imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80',
        category: 'Desserts',
        isBestSeller: true,
        isNew: false,
        rating: 4.9,
        stock: 8,
        isSample: true,
      },
      {
        id: 4,
        name: 'French Macarons',
        description: 'Assorted flavors of delicate French macarons',
        price: 280,
        imageUrl: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400&q=80',
        category: 'Pastries',
        isBestSeller: true,
        isNew: true,
        rating: 4.6,
        stock: 20,
        isSample: true,
      },
      {
        id: 5,
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee-soaked ladyfingers',
        price: 320,
        imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80',
        category: 'Desserts',
        isBestSeller: true,
        isNew: true,
        rating: 4.8,
        stock: 12,
        isSample: true,
      },
    ];
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await fetchData();
    } catch (err) {
      setLoading(false);
    }
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

  const featuredProducts = items.length > 0 ? items.slice(0, 5) : (isGuest ? getSampleItems() : []);
  console.log('Featured products calculated:', featuredProducts.length);
  const heroStatCards = [
    { label: 'Same-day deliveries', value: '320+', icon: '🚚' },
    { label: 'Seasonal creations', value: '45', icon: '🎂' },
    { label: 'Happy customers', value: '15k+', icon: '💌' },
  ];
  const activeHeroStat = heroStatCards.length
    ? heroStatCards[currentSlide % heroStatCards.length]
    : null;

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
              height: { xs: '240px', sm: '300px', md: '500px' },
              width: '100%',
              overflow: 'hidden',
              background: '#000',
              marginTop: '64px',
              touchAction: 'pan-y',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}
          >
            <AnimatePresence mode="wait">
              {carouselSlides.length > 0 ? (
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  style={{ position: 'absolute', inset: 0 }}
                >
                  <Box
                    component={motion.div}
                    initial={{ scale: 1.15 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 6, ease: [0.22, 1, 0.36, 1] }}
                    sx={{
                      width: '100%',
                      height: '100%',
                      backgroundImage: `linear-gradient(135deg, rgba(7,7,7,0.75) 0%, rgba(7,7,7,0.45) 40%, rgba(7,7,7,0.8) 100%), url(${carouselSlides[currentSlide].image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      position: 'relative',
                    }}
                  >
                    <Container
                      maxWidth="lg"
                      sx={{ height: '100%', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 2 }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: { xs: 'column', md: 'row' },
                          alignItems: { xs: 'flex-start', md: 'flex-end' },
                          justifyContent: 'space-between',
                          gap: { xs: 3, md: 6 },
                          width: '100%',
                        }}
                      >
                        <Box
                          sx={{
                            color: '#fff',
                            maxWidth: { xs: '100%', md: '620px' },
                            padding: { xs: '24px 0', sm: 0 },
                            flex: '0 1 auto',
                          }}
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <Typography
                              variant="h1"
                              sx={{
                                fontWeight: 800,
                                mb: 1,
                                fontSize: { xs: '2.1rem', md: '3.8rem', lg: '4.1rem' },
                                color: '#fff',
                                letterSpacing: '-0.02em',
                                lineHeight: 1.05,
                              }}
                            >
                              {carouselSlides[currentSlide].title}
                            </Typography>
                            <Typography
                              variant="h3"
                              sx={{
                                fontWeight: 600,
                                fontSize: { xs: '1.1rem', md: '1.8rem' },
                                mb: 3,
                                color: '#e91e63',
                                fontStyle: 'italic',
                                letterSpacing: { xs: '0.04em', md: '0.06em' },
                              }}
                            >
                              {carouselSlides[currentSlide].subtitle}
                            </Typography>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <Button
                              variant="contained"
                              size="large"
                              onClick={() => carouselSlides[currentSlide].buttonAction()}
                              endIcon={<ArrowForward />}
                              sx={{
                                background: gradients.primary,
                                color: '#fff',
                                padding: { xs: '12px 28px', md: '14px 36px' },
                                borderRadius: 0,
                                fontWeight: 700,
                                textTransform: 'none',
                                fontSize: { xs: '0.95rem', md: '1rem' },
                                boxShadow: '0 18px 32px rgba(233, 30, 99, 0.32)',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 24px 40px rgba(233, 30, 99, 0.42)',
                                },
                              }}
                            >
                              {carouselSlides[currentSlide].buttonText}
                            </Button>
                          </motion.div>
                        </Box>

                        {activeHeroStat && (
                          <Box
                            key={activeHeroStat.label}
                            sx={{
                              flex: '0 0 auto',
                              alignSelf: { xs: 'flex-start', md: 'stretch' },
                              minWidth: { xs: '100%', md: '240px' },
                              maxWidth: { xs: '280px', md: '260px' },
                              border: '1px solid rgba(255,255,255,0.25)',
                              borderRadius: 0,
                              backdropFilter: 'blur(4px)',
                              background: 'rgba(0,0,0,0.25)',
                              padding: { xs: '14px 18px', md: '18px 22px' },
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 2,
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                textAlign: 'center',
                              }}
                            >
                              <Typography component="span" sx={{ fontSize: '2.1rem', mb: 0.75 }}>
                                {activeHeroStat.icon}
                              </Typography>
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  color: '#fff',
                                  fontWeight: 700,
                                  letterSpacing: '0.05em',
                                  fontSize: { xs: '1.7rem', md: '2.1rem' },
                                  lineHeight: 1,
                                  mb: 0.5,
                                }}
                              >
                                {activeHeroStat.value}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: 'rgba(255,255,255,0.7)',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.08em',
                                }}
                              >
                                {activeHeroStat.label}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Container>
                  </Box>
                </motion.div>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: 'white',
                  }}
                >
                  <Typography>No slides available</Typography>
                </Box>
              )}
            </AnimatePresence>

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

          {/* Featured Products */}
          {featuredProducts.length > 0 ? (
            <Box
              sx={{
                background: colors.paper,
                position: 'relative',
                py: { xs: 5, md: 8 },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  opacity: 0.25,
                  backgroundImage: 'linear-gradient(120deg, rgba(233,30,99,0.08) 0%, rgba(255,255,255,0) 40%)'
                }
              }}
            >
              <Container maxWidth="lg">
                <ScrollReveal animation="slideUp">
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: { xs: 2, md: 3 },
                      mb: 4
                    }}
                  >
                    <SectionHeader
                      eyebrow="Handpicked For You"
                      title="Top 5 Chef's Specials"
                      description="A rotating curation of pastries, cakes, and desserts that customers rave about this week."
                      maxWidth="620px"
                    />
                    <Box sx={{ marginLeft: 'auto' }}>
                      <Button
                        variant="contained"
                        endIcon={<ArrowForward />}
                        onClick={() => navigate('/shop')}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 700,
                          borderRadius: 0,
                          background: gradients.primary,
                          px: { xs: 3, md: 4 },
                          py: { xs: 1.4, md: 1.6 }
                        }}
                      >
                        Browse Full Menu
                      </Button>
                    </Box>
                  </Box>
                </ScrollReveal>

                <Box
                  component={motion.div}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' },
                    gap: { xs: 2, md: 3 },
                  }}
                >
                  {featuredProducts.map((item, index) => (
                    <ProductCard
                      key={item.id}
                      item={item}
                      ratingData={getItemRatingData(item.id)}
                      index={index}
                      compact
                    />
                  ))}
                </Box>
              </Container>
            </Box>
          ) : (
            /* Fallback section - always show sample products for guest users */
            <Box
              sx={{
                background: colors.paper,
                py: { xs: 6, md: 10 },
                textAlign: 'center'
              }}
            >
              <Container maxWidth="md">
                <ScrollReveal animation="slideUp">
                  {isGuest ? (
                    /* Guest users - show Top 5 Chef's Specials */
                    <>
                      <SectionHeader
                        eyebrow="Handpicked For You"
                        title="Top 5 Chef's Specials"
                        description="A rotating curation of pastries, cakes, and desserts that customers rave about this week."
                        maxWidth="620px"
                      />
                      <Box sx={{ marginLeft: 'auto' }}>
                        <Button
                          variant="contained"
                          endIcon={<ArrowForward />}
                          onClick={() => navigate('/shop')}
                          sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: 0,
                            background: gradients.primary,
                            px: 4,
                            py: 1.6
                          }}
                        >
                          Browse Full Menu
                        </Button>
                      </Box>
                      <Box
                        component={motion.div}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' },
                          gap: { xs: 2, md: 3 },
                        }}
                      >
                        {featuredProducts.map((item, index) => (
                          <ProductCard
                            key={item.id}
                            item={item}
                            ratingData={getItemRatingData(item.id)}
                            index={index}
                            compact
                          />
                        ))}
                      </Box>
                    </>
                  ) : (
                    /* Logged-in users or no products available */
                    <>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 700,
                          mb: 2,
                          background: gradients.primary,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        Coming Soon!
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: colors.stone,
                          mb: 4,
                          maxWidth: '600px',
                          mx: 'auto'
                        }}
                      >
                        We're busy baking delicious treats for you! Our fresh assortment of cakes, pastries, and desserts will be available soon.
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={() => navigate('/contact')}
                          sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: 0,
                            background: gradients.primary,
                            px: 4,
                            py: 1.5
                          }}
                        >
                          Contact Us
                        </Button>
                        <Button
                          variant="outlined"
                          size="large"
                          onClick={() => navigate('/about')}
                          sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: 0,
                            borderColor: colors.brandPink,
                            color: colors.brandPink,
                            px: 4,
                            py: 1.5
                          }}
                        >
                          Learn More
                        </Button>
                      </Box>
                    </>
                  )}
                </ScrollReveal>
              </Container>
            </Box>
          )}

          <Footer />
        </Box>
      </PullToRefresh>

      <LoadingOverlay 
        visible={loading} 
        message="Loading delicious treats..." 
        size={60}
        backdrop={true}
        transparent={false}
      />
    </motion.div>
  );
};

export default Home;
