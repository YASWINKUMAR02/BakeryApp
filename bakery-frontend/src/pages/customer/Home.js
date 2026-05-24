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

    // Fetch items and carousel INDEPENDENTLY so one failure doesn't block the other
    // ── Items ──────────────────────────────────────────────────────────────────
    try {
      const itemsResponse = await itemAPI.getAll();
      console.log('Items API Success:', itemsResponse?.data?.success);
      console.log('Items Data Length:', itemsResponse?.data?.data?.length);

      if (itemsResponse?.data?.success && itemsResponse?.data?.data?.length > 0) {
        let itemsData = itemsResponse.data.data;

        // Mirror shop-page enhancement flags
        itemsData = itemsData.map((item, index) => ({
          ...item,
          isBestSeller: item.isBestSeller || index % 5 === 0,
          isNew: item.isNew || index % 7 === 1,
        }));

        // Fetch reviews only for the first 5 products we'll actually display
        const reviewsData = {};
        await Promise.all(
          itemsData.slice(0, 5).map(async (item) => {
            try {
              const reviewResponse = await reviewAPI.getByItem(item.id);
              if (reviewResponse.data.success) {
                reviewsData[item.id] = reviewResponse.data.data;
              }
            } catch {
              reviewsData[item.id] = [];
            }
          })
        );
        setItemReviews(reviewsData);
        setItems(itemsData);
        console.log('Products loaded for home page:', itemsData.length, '(showing first 5)');
      } else {
        console.log('Items API returned no data');
        setItems([]);
      }
    } catch (itemErr) {
      console.error('Error fetching items:', itemErr);
      setItems([]);
    }

    // ── Carousel ───────────────────────────────────────────────────────────────
    try {
      const carouselResponse = await carouselAPI.getActive();
      if (carouselResponse.data.success && carouselResponse.data.data?.length > 0) {
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
        setCarouselSlides(getDefaultSlides());
      }
    } catch (carouselErr) {
      console.error('Carousel fetch failed (using defaults):', carouselErr);
      setCarouselSlides(getDefaultSlides());
    }

    setLoading(false);
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

  const featuredProducts = items.slice(0, 5);
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
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', pb: { xs: '64px', md: 0 } }}>

          {/* Hero Carousel Section */}
          <Box
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            sx={{
              position: 'relative',
              height: { xs: '420px', sm: '460px', md: '500px' },
              width: '100%',
              overflow: 'hidden',
              background: '#111',
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
                    initial={{ scale: 1.08 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 6, ease: [0.22, 1, 0.36, 1] }}
                    sx={{
                      width: '100%',
                      height: '100%',
                      backgroundImage: {
                        xs: `linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.28) 45%, rgba(0,0,0,0.65) 100%), url(${carouselSlides[currentSlide].image})`,
                        md: `linear-gradient(135deg, rgba(7,7,7,0.75) 0%, rgba(7,7,7,0.45) 40%, rgba(7,7,7,0.8) 100%), url(${carouselSlides[currentSlide].image})`,
                      },
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
                          alignItems: { xs: 'center', md: 'flex-end' },
                          justifyContent: { xs: 'center', md: 'space-between' },
                          gap: { xs: 0, md: 3 },
                          width: '100%',
                        }}
                      >
                        <Box
                          sx={{
                            color: '#fff',
                            maxWidth: { xs: '100%', md: '620px' },
                            flex: '0 1 auto',
                            textAlign: { xs: 'center', md: 'left' },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: { xs: 'center', md: 'flex-start' },
                          }}
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <Typography
                              variant="h1"
                              sx={{
                                fontWeight: 800,
                                mb: 1,
                                fontSize: { xs: '2.5rem', sm: '3.2rem', md: '3.8rem', lg: '4.1rem' },
                                color: '#fff',
                                letterSpacing: '-0.02em',
                                lineHeight: { xs: 1.1, md: 1.05 },
                                textShadow: '0 2px 16px rgba(0,0,0,0.4)',
                              }}
                            >
                              {carouselSlides[currentSlide].title}
                            </Typography>

                            <Typography
                              variant="h3"
                              sx={{
                                fontWeight: 600,
                                fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                                mb: 3,
                                color: '#e91e63',
                                fontStyle: 'italic',
                                letterSpacing: '0.06em',
                                textShadow: '0 1px 8px rgba(0,0,0,0.4)',
                              }}
                            >
                              {carouselSlides[currentSlide].subtitle}
                            </Typography>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <Button
                              variant="contained"
                              size="large"
                              onClick={() => carouselSlides[currentSlide].buttonAction()}
                              endIcon={<ArrowForward />}
                              sx={{
                                background: gradients.primary,
                                color: '#fff',
                                padding: { xs: '10px 22px', md: '14px 36px' },
                                borderRadius: 0,
                                fontWeight: 700,
                                textTransform: 'none',
                                fontSize: { xs: '0.88rem', md: '1rem' },
                                boxShadow: '0 8px 24px rgba(233,30,99,0.4)',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 16px 32px rgba(233,30,99,0.45)',
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
                              display: { xs: 'none', md: 'flex' },
                              flex: '0 0 auto',
                              alignSelf: 'stretch',
                              minWidth: '240px',
                              maxWidth: '260px',
                              border: '1px solid rgba(255,255,255,0.25)',
                              borderRadius: 0,
                              backdropFilter: 'blur(4px)',
                              background: 'rgba(0,0,0,0.25)',
                              padding: { xs: '14px 18px', md: '18px 22px' },
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
                    background: currentSlide === index ? '#e91e63' : 'rgba(255,255,255,0.55)',
                    cursor: 'pointer', transition: 'all 0.3s ease',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.3)'
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
                  {/* ── Mobile header: tight & minimal ── */}
                  <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Box sx={{ width: 3, height: 18, background: gradients.primary, borderRadius: 2, flexShrink: 0 }} />
                        <Typography
                          variant="overline"
                          sx={{ color: colors.brandPink, fontWeight: 700, letterSpacing: '0.15em', fontSize: '0.7rem' }}
                        >
                          From Our Shop
                        </Typography>
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 800, color: colors.brandInk, letterSpacing: '-0.01em', lineHeight: 1.2 }}
                      >
                        Featured Products
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      endIcon={<ArrowForward sx={{ fontSize: '16px !important' }} />}
                      onClick={() => navigate('/shop')}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 700,
                        borderRadius: 0,
                        background: gradients.primary,
                        color: '#fff',
                        fontSize: '0.78rem',
                        px: 2,
                        py: 0.9,
                        flexShrink: 0,
                        '&:hover': { background: gradients.primary },
                      }}
                    >
                      View All
                    </Button>
                  </Box>

                  {/* ── Desktop header: full layout ── */}
                  <Box
                    sx={{
                      display: { xs: 'none', md: 'flex' },
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 3,
                      mb: 4
                    }}
                  >
                    <SectionHeader
                      eyebrow="From Our Shop"
                      title="Featured Products"
                      description="Browse our top picks — real products from our shop. Add to cart and order with or without signing in."
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
                          py: 1.6,
                        }}
                      >
                        Browse Full Menu
                      </Button>
                    </Box>
                  </Box>
                </ScrollReveal>

                {/* Mobile: horizontal scroll row */}
                <Box
                  sx={{ display: { xs: 'flex', md: 'none' }, overflowX: 'auto', gap: 2, pb: 1.5,
                    scrollSnapType: 'x mandatory',
                    WebkitOverflowScrolling: 'touch',
                    '&::-webkit-scrollbar': { display: 'none' },
                    mx: -2, px: 2,
                  }}
                >
                  {featuredProducts.map((item, index) => (
                    <Box key={item.id} sx={{ flex: '0 0 72vw', maxWidth: '280px', scrollSnapAlign: 'start' }}>
                      <ProductCard
                        item={item}
                        ratingData={getItemRatingData(item.id)}
                        index={index}
                      />
                    </Box>
                  ))}
                </Box>

                {/* Desktop: multi-column grid */}
                <Box
                  component={motion.div}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  sx={{
                    display: { xs: 'none', md: 'grid' },
                    gridTemplateColumns: { md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' },
                    gap: 3,
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
            /* No items available */
            <Box
              sx={{
                background: colors.paper,
                py: { xs: 6, md: 10 },
                textAlign: 'center'
              }}
            >
              <Container maxWidth="md">
                <Typography variant="h6" sx={{ color: colors.stone }}>
                  No products available at the moment.
                </Typography>
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
