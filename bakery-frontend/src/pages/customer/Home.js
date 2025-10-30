import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  CircularProgress,
  IconButton,
  Chip,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Divider,
  Slider,
  FormGroup,
  InputLabel,
  Pagination,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  ArrowForward,
  ShoppingCart,
  Star,
  Cake,
  ChevronLeft,
  ChevronRight,
  FilterList,
  Sort,
  BakeryDining,
  LocalOffer,
  Search,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { itemAPI, cartAPI, categoryAPI, reviewAPI, carouselAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import CustomerHeader from '../../components/CustomerHeader';
import Footer from '../../components/Footer';
import { showSuccess, showError } from '../../utils/toast';
import { ProductGridSkeleton } from '../../components/LoadingSkeleton';
import { optimizeImageUrl } from '../../utils/imageOptimization';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [itemReviews, setItemReviews] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isEggless, setIsEggless] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter and Sort States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination state
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  // Carousel slides from API
  const [carouselSlides, setCarouselSlides] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (carouselSlides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [carouselSlides.length]);

  const fetchData = async () => {
    try {
      const [itemsResponse, categoriesResponse, carouselResponse] = await Promise.all([
        itemAPI.getAll(),
        categoryAPI.getAll(),
        carouselAPI.getActive(),
      ]);
      
      if (itemsResponse.data.success) {
        const itemsData = itemsResponse.data.data;
        setItems(itemsData);
        
        // Fetch reviews for all items
        const reviewsData = {};
        await Promise.all(
          itemsData.map(async (item) => {
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
      if (categoriesResponse.data.success) {
        setCategories(categoriesResponse.data.data);
      }
      if (carouselResponse.data.success) {
        // Transform API data to match carousel format
        const slides = carouselResponse.data.data.map(slide => ({
          title: slide.title,
          subtitle: slide.subtitle,
          description: slide.description,
          image: slide.imageUrl,
          icon: Cake,
          buttonText: slide.buttonText,
          buttonAction: () => {
            if (slide.linkType === 'CATEGORY') {
              navigate(`/shop?categoryId=${slide.linkValue}`);
            } else if (slide.linkType === 'ITEM') {
              navigate(`/item/${slide.linkValue}`);
            } else {
              navigate(slide.linkValue);
            }
          },
        }));
        setCarouselSlides(slides);
      }
    } catch (err) {
      showError('Failed to fetch data');
    } finally{
      setLoading(false);
    }
  };

  const handleOpenDialog = (item) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedItem(item);
    setQuantity(1);
    setIsEggless(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
    setQuantity(1);
    setIsEggless(false);
  };

  const handleAddToCart = async () => {
    try {
      await cartAPI.addItem(user.id, {
        itemId: selectedItem.id,
        quantity: quantity,
        eggType: isEggless ? 'EGGLESS' : null,
      });
      showSuccess(`${selectedItem.name}${isEggless ? ' (Eggless)' : ''} added to cart!`);
      handleCloseDialog();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const getItemRatingData = (itemId) => {
    const reviews = itemReviews[itemId] || [];
    if (reviews.length === 0) {
      return { averageRating: 0, reviewCount: 0 };
    }
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = (totalRating / reviews.length).toFixed(1);
    return { averageRating, reviewCount: reviews.length };
  };

  // Filter and Sort Logic
  const getFilteredAndSortedItems = () => {
    let filtered = [...items];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(item => 
        selectedCategories.includes(item.category?.id)
      );
    }

    // Filter by price range
    filtered = filtered.filter(item => 
      item.price >= priceRange[0] && item.price <= priceRange[1]
    );

    // Filter by rating
    if (minRating > 0) {
      filtered = filtered.filter(item => {
        const { averageRating } = getItemRatingData(item.id);
        return parseFloat(averageRating) >= minRating;
      });
    }

    // Sort items
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => {
          const ratingA = parseFloat(getItemRatingData(a.id).averageRating);
          const ratingB = parseFloat(getItemRatingData(b.id).averageRating);
          return ratingB - ratingA;
        });
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        // Keep original order or prioritize featured items
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return filtered;
  };

  const filteredItems = getFilteredAndSortedItems();
  const featuredItems = filteredItems.slice(0, 6);
  
  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleCategoryToggle = (categoryId) => {
    setPage(1);
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    setMinRating(0);
    setSearchQuery('');
    setPage(1);
    setSortBy('featured');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CustomerHeader />

      <Box style={{ background: '#f5f5f5', paddingTop: '70px' }}>
        {/* Hero Carousel Section */}
        <Box 
          sx={{ 
            position: 'relative', 
            height: { xs: '300px', sm: '400px', md: '500px' }, 
            width: '100%',
            overflow: 'hidden', 
            background: '#1a1a1a',
          }}
          onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
          onTouchMove={(e) => setTouchEnd(e.targetTouches[0].clientX)}
          onTouchEnd={() => {
            if (touchStart - touchEnd > 75) {
              // Swipe left - next slide
              nextSlide();
            }
            if (touchStart - touchEnd < -75) {
              // Swipe right - previous slide
              prevSlide();
            }
          }}
        >
          {carouselSlides.map((slide, index) => (
            <Box
              key={index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: currentSlide === index ? 1 : 0,
                transition: 'opacity 0.8s ease-in-out',
                zIndex: currentSlide === index ? 1 : 0,
              }}
            >
              <Container maxWidth="lg" style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                <Box sx={{ color: '#fff', maxWidth: { xs: '100%', sm: '600px' }, padding: { xs: '0 16px', sm: '0' } }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#ffb6c1', 
                      fontSize: { xs: '12px', sm: '14px', md: '16px' }, 
                      fontWeight: 500, 
                      letterSpacing: { xs: '1px', sm: '2px' }, 
                      marginBottom: { xs: '8px', sm: '16px' }, 
                      display: 'block',
                    }}
                  >
                    {slide.description}
                  </Typography>
                  <Typography 
                    variant="h1" 
                    sx={{ 
                      fontWeight: 800, 
                      marginBottom: { xs: '4px', sm: '8px' }, 
                      fontSize: { xs: '32px', sm: '48px', md: '72px' }, 
                      lineHeight: 1.1, 
                      fontStyle: 'italic',
                    }}
                  >
                    {slide.title}
                  </Typography>
                  <Typography 
                    variant="h1" 
                    sx={{ 
                      fontWeight: 800, 
                      marginBottom: { xs: '16px', sm: '24px', md: '32px' }, 
                      fontSize: { xs: '32px', sm: '48px', md: '72px' }, 
                      lineHeight: 1.1, 
                      fontStyle: 'italic',
                    }}
                  >
                    {slide.subtitle}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: { xs: '8px', sm: '16px' }, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={slide.buttonAction}
                      sx={{
                        background: '#e91e63',
                        color: '#fff',
                        padding: { xs: '10px 20px', sm: '14px 36px' },
                        fontSize: { xs: '14px', sm: '16px' },
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 20px rgba(255, 105, 180, 0.4)',
                      }}
                    >
                      {slide.buttonText}
                    </Button>
                  </Box>
                </Box>
              </Container>
            </Box>
          ))}

          {/* Carousel Indicators */}
          <Box
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '10px',
              zIndex: 2,
            }}
          >
            {carouselSlides.map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentSlide(index)}
                style={{
                  width: currentSlide === index ? '30px' : '10px',
                  height: '10px',
                  borderRadius: '5px',
                  background: currentSlide === index ? '#fff' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Shop Section - Redirect to Shop Page */}
        <Box 
          sx={{ 
            background: '#fff', 
            padding: { xs: '20px 16px', sm: '40px 20px', md: '60px 0' }, 
            textAlign: 'center' 
          }}
        >
          <Container maxWidth="lg">
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700, 
                marginBottom: '16px', 
                color: '#333',
                fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
              }}
            >
              Explore Our Delicious Collection
            </Typography>
            <Typography 
              variant="h6" 
              color="textSecondary" 
              sx={{ 
                marginBottom: { xs: '24px', sm: '32px' },
                fontSize: { xs: '1rem', sm: '1.25rem' },
              }}
            >
              Freshly baked treats made with love
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/shop')}
              endIcon={<ArrowForward />}
              sx={{
                background: '#e91e63',
                color: '#fff',
                padding: { xs: '12px 32px', sm: '14px 40px' },
                fontSize: { xs: '16px', sm: '18px' },
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '0',
                boxShadow: '0 4px 20px rgba(233, 30, 99, 0.4)',
                '&:hover': {
                  background: '#d81b60',
                  boxShadow: '0 6px 24px rgba(233, 30, 99, 0.5)',
                },
              }}
            >
              Browse All Products
            </Button>
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default Home;
