import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductModal from '../components/ProductModal';
import LoadingAnimation from '../components/LoadingAnimation';
import ScrollReveal from '../components/ScrollReveal';
import { pageTransitions } from '../utils/pageTransitions';
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
  Chip,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Divider,
  Slider,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Drawer,
  IconButton,
} from '@mui/material';
import {
  Cake,
  Star,
  FilterList,
  Search,
  ExpandMore,
  ExpandLess,
  Close,
} from '@mui/icons-material';
import Footer from '../components/Footer';
import DeliveryNotice from '../components/DeliveryNotice';
import customizedCakeImage from '../sample-images/WhatsApp Image 2025-11-03 at 14.33.23_ebc72c8a.jpg';

const Shop = () => {
  const navigate = useNavigate();
  const showFilters = true; // Always show filters
  
  // Filter and sort states with localStorage support
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const saved = localStorage.getItem('filterCategories');
    return saved ? JSON.parse(saved) : [];
  });
  const [priceRange, setPriceRange] = useState(() => {
    const saved = localStorage.getItem('filterPriceRange');
    return saved ? JSON.parse(saved) : [0, 1000];
  });
  const [minRating, setMinRating] = useState(() => {
    const saved = localStorage.getItem('filterMinRating');
    return saved ? JSON.parse(saved) : 0;
  });
  const [sortBy, setSortBy] = useState(() => {
    const saved = localStorage.getItem('filterSortBy');
    return saved ? saved : 'featured';
  });
  const [searchQuery, setSearchQuery] = useState('');
  
  // Product modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Save filters to localStorage
  useEffect(() => {
    localStorage.setItem('filterCategories', JSON.stringify(selectedCategories));
  }, [selectedCategories]);

  useEffect(() => {
    localStorage.setItem('filterPriceRange', JSON.stringify(priceRange));
  }, [priceRange]);

  useEffect(() => {
    localStorage.setItem('filterMinRating', JSON.stringify(minRating));
  }, [minRating]);

  useEffect(() => {
    localStorage.setItem('filterSortBy', sortBy);
  }, [sortBy]);

  // Smooth filter transition effect
  useEffect(() => {
    if (!loading) {
      setIsFiltering(true);
      const timer = setTimeout(() => {
        setIsFiltering(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedCategories, priceRange, minRating, searchQuery, loading]);
  

  // Sample data
  const categories = [
    { id: 1, name: 'Brownies' },
    { id: 2, name: 'Cakes' },
    { id: 3, name: 'Cookies' },
    { id: 4, name: 'Desserts' },
  ];

  const items = [
    // === BROWNIES ===
    { id: 1, name: 'Classic Brownie', category: 'Brownies', price: 150, rating: 4.8, reviews: 45, description: 'Rich chocolate fudge brownie', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop&auto=format', grams: 250, pieces: 1, dietary: [], occasions: ['Casual'], popularity: 95, dateAdded: '2024-10-15' },
    { id: 2, name: 'Red Velvet Brownie', category: 'Brownies', price: 170, rating: 4.9, reviews: 38, description: 'Smooth red velvet delight', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop&auto=format', grams: 250, pieces: 1, dietary: [], occasions: ['Birthday', 'Anniversary'], popularity: 88, dateAdded: '2024-10-20' },
    { id: 3, name: 'Double Chocolate Brownie', category: 'Brownies', price: 160, rating: 4.7, reviews: 52, description: 'Double dose of chocolate', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop&auto=format', grams: 250, pieces: 1, dietary: [], occasions: ['Casual'], popularity: 92, dateAdded: '2024-09-10' },
    { id: 4, name: 'Triple Chocolate Brownie', category: 'Brownies', price: 180, rating: 4.9, reviews: 60, description: 'Triple chocolate indulgence', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop&auto=format', grams: 250, pieces: 1, dietary: [], occasions: ['Casual', 'Birthday'], popularity: 97, dateAdded: '2024-11-01' },
    { id: 5, name: 'Biscoff Brownie', category: 'Brownies', price: 190, rating: 4.8, reviews: 42, description: 'Crunchy Biscoff cookie brownie', image: 'https://images.unsplash.com/photo-1516685018646-549198525c1b?w=400&h=400&fit=crop&auto=format', grams: 250, pieces: 1, dietary: [], occasions: ['Casual'], popularity: 85, dateAdded: '2024-10-25' },
    { id: 6, name: 'Walnut Brownie', category: 'Brownies', price: 170, rating: 4.6, reviews: 35, description: 'Crunchy walnuts in every bite', image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=400&fit=crop&auto=format', grams: 250, pieces: 1, dietary: [], occasions: ['Casual'], popularity: 78, dateAdded: '2024-09-05' },
    { id: 7, name: 'Nutella Brownie', category: 'Brownies', price: 200, rating: 5.0, reviews: 75, description: 'Loaded with creamy Nutella', image: 'https://images.unsplash.com/photo-1588187418531-95d8d83e39c5?w=400&h=400&fit=crop&auto=format', grams: 250, pieces: 1, dietary: [], occasions: ['Casual', 'Birthday'], popularity: 100, dateAdded: '2024-11-02' },
    { id: 8, name: 'Assorted Brownies', category: 'Brownies', price: 300, rating: 4.8, reviews: 28, description: 'Mix of our best brownies', image: 'https://images.unsplash.com/photo-1523986371872-9d3ba2e2f5ab?w=400&h=400&fit=crop&auto=format', grams: 500, pieces: 6, dietary: [], occasions: ['Corporate', 'Birthday'], popularity: 90, dateAdded: '2024-10-18' },
    { id: 14, name: 'Kunafa Chocolate', category: 'Desserts', price: 220, rating: 4.9, reviews: 42, description: 'Crispy kunafa with rich chocolate', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop&auto=format', grams: 200, pieces: 1, dietary: [], occasions: ['Casual', 'Birthday'], popularity: 87, dateAdded: '2024-11-04' },
    
    // === OTHER DESSERTS ===
    { id: 9, name: 'Customized Birthday Cakes', category: 'Cakes', price: 800, rating: 5.0, reviews: 95, description: 'Personalized celebration cakes', image: customizedCakeImage, grams: 1000, pieces: 1, dietary: [], occasions: ['Birthday', 'Anniversary'], popularity: 98, dateAdded: '2024-08-15' },
    { id: 15, name: 'Chocolate Dream Cake', category: 'Cakes', price: 250, rating: 4.9, reviews: 32, description: 'Dreamy chocolate indulgence', image: 'https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?w=400&h=400&fit=crop&auto=format', grams: 250, pieces: 1, dietary: [], occasions: ['Birthday', 'Casual'], popularity: 94, dateAdded: '2024-11-07' },
    { id: 10, name: 'Macarons', category: 'Desserts', price: 250, rating: 4.9, reviews: 48, description: 'Colorful French macarons', image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=400&h=400&fit=crop&auto=format', grams: 200, pieces: 12, dietary: [], occasions: ['Wedding', 'Corporate'], popularity: 92, dateAdded: '2024-09-20' },
    { id: 11, name: 'Cookies', category: 'Cookies', price: 150, rating: 4.7, reviews: 62, description: 'Freshly baked cookies', image: 'https://images.unsplash.com/photo-1481391032119-d89fee407e44?w=400&h=400&fit=crop&auto=format', grams: 250, pieces: 12, dietary: [], occasions: ['Casual', 'Corporate'], popularity: 88, dateAdded: '2024-08-30' },
    { id: 12, name: 'Marshmallow', category: 'Desserts', price: 100, rating: 4.4, reviews: 30, description: 'Soft fluffy marshmallows', image: 'https://images.unsplash.com/photo-1517685894313-6a430ceca6f0?w=400&h=400&fit=crop&auto=format', grams: 150, pieces: 10, dietary: [], occasions: ['Casual'], popularity: 70, dateAdded: '2024-07-10' },
    { id: 13, name: 'Cup Cakes', category: 'Cakes', price: 80, rating: 4.6, reviews: 55, description: 'Bite-sized sweet treats', image: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=400&h=400&fit=crop&auto=format', grams: 100, pieces: 1, dietary: [], occasions: ['Birthday', 'Casual'], popularity: 80, dateAdded: '2024-10-05' },
  ];

  // Get minimum price for an item based on available weight options
  const getMinimumPrice = (item) => {
    // Birthday cakes start at 500g = ₹400
    if (item.name === 'Customized Birthday Cakes') {
      return 400;
    }
    // Kunafa Chocolate - 100g is minimum
    if (item.name === 'Kunafa Chocolate') {
      return Math.round(item.price * 0.5); // 100g = half of 200g price
    }
    // Chocolate Dream Cake - 250g is minimum
    if (item.name === 'Chocolate Dream Cake') {
      return 250;
    }
    // For brownies and other items, base price is the minimum
    return item.price;
  };

  const getFilteredAndSortedItems = () => {
    let filtered = [...items];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by categories (multi-select)
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(item => 
        selectedCategories.includes(item.category)
      );
    }

    // Filter by price range
    filtered = filtered.filter(item => 
      item.price >= priceRange[0] && item.price <= priceRange[1]
    );

    // Filter by minimum rating
    if (minRating > 0) {
      filtered = filtered.filter(item => item.rating >= minRating);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'popularity':
        filtered.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredItems = getFilteredAndSortedItems();

  
  // Debug logging
  console.log('Selected Categories:', selectedCategories);
  console.log('Filtered Items:', filteredItems.length);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleRatingChange = (value) => {
    setMinRating(value);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    setMinRating(0);
    setSearchQuery('');
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
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.03,
        staggerDirection: -1,
        when: "afterChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.9,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] // Custom easing for smooth motion
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: -10,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransitions.shop}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f5f5f5', pb: { xs: '80px', sm: '70px' }, pt: '20px' }}>
        <Box sx={{ paddingTop: 0, paddingBottom: { xs: '40px', sm: '60px' } }}>
          <Container maxWidth="xl" sx={{ paddingX: { xs: 1, sm: 3, md: 4 } }}>
            {/* Delivery Notice - Mobile */}
            <Box sx={{ display: { xs: 'block', md: 'none' }, marginBottom: 2 }}>
              <DeliveryNotice />
            </Box>

            {/* Search Bar */}
            <Box sx={{ marginBottom: { xs: 2, md: 3 }, marginTop: 0 }}>
              <TextField
                fullWidth
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                size="small"
                InputProps={{
                  startAdornment: <Search sx={{ marginLeft: { xs: '1px', md: '6px' }, marginRight: { xs: '3px', md: '8px' }, color: '#999', fontSize: { xs: '18px', md: '1.2rem' } }} />,
                  sx: {
                    height: { xs: '38px', md: '56px' },
                    fontSize: { xs: '0.875rem', md: '1rem' },
                  }
                }}
                sx={{
                  background: '#fff',
                  borderRadius: 0,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#e0e0e0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#e91e63',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#e91e63',
                    },
                  },
                  '& .MuiInputBase-input': {
                    padding: { xs: '8px 12px', md: '16.5px 14px' },
                  }
                }}
              />
            </Box>

            {/* Mobile Filter Button */}
            <Box sx={{ display: { xs: 'block', sm: 'none' }, marginBottom: { xs: 1.5, sm: 2 } }}>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                startIcon={<FilterList sx={{ fontSize: '18px' }} />}
                onClick={() => setMobileFilterOpen(true)}
                sx={{
                  borderColor: '#e0e0e0',
                  color: '#333',
                  textTransform: 'none',
                  padding: '6px 12px',
                  height: '36px',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  '&:hover': {
                    borderColor: '#e91e63',
                    backgroundColor: 'rgba(233, 30, 99, 0.04)',
                  },
                }}
              >
                Filters {(selectedCategories.length > 0 || priceRange[0] !== 0 || priceRange[1] !== 1000 || minRating > 0) && `(${selectedCategories.length + (priceRange[0] !== 0 || priceRange[1] !== 1000 ? 1 : 0) + (minRating > 0 ? 1 : 0)})`}
              </Button>
            </Box>

            <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ alignItems: 'flex-start', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
              {/* Filter Sidebar - LEFT SIDE */}
              {showFilters && (
              <Grid item xs={12} sm={3} md={3} lg={3} xl={2} sx={{ flexShrink: 0, display: { xs: 'none', sm: 'block' } }}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    padding: { xs: 2, sm: 3 },
                    borderRadius: 0,
                    border: '1px solid #e0e0e0',
                    background: '#fff',
                    height: 'fit-content',
                    position: { xs: 'relative', sm: 'sticky' },
                    top: { xs: 0, sm: '100px' },
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  }}
                >
                  {/* Filter Header */}
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginBottom: 2.5,
                      paddingBottom: 2,
                      borderBottom: '2px solid #f5f5f5',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, fontSize: '1.1rem', color: '#333' }}>
                      <FilterList sx={{ fontSize: '22px', color: '#e91e63' }} /> Filters
                    </Typography>
                    {(selectedCategories.length > 0 || priceRange[0] !== 0 || priceRange[1] !== 1000 || minRating > 0) && (
                      <Button 
                        size="small" 
                        onClick={handleClearFilters}
                        sx={{ 
                          textTransform: 'none', 
                          color: '#e91e63',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          '&:hover': {
                            background: 'rgba(233, 30, 99, 0.08)',
                          }
                        }}
                      >
                        Clear All
                      </Button>
                    )}
                  </Box>

                  <Box>
                    {/* Categories Filter - Multi-select */}
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#333', fontSize: '0.9rem', marginBottom: 1.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Categories
                    </Typography>
                    <Box sx={{ marginBottom: 3 }}>
                      {categories.map((category) => (
                        <FormControlLabel
                          key={category.id}
                          control={
                            <Checkbox
                              checked={selectedCategories.includes(category.name)}
                              onChange={() => handleCategoryToggle(category.name)}
                              sx={{
                                color: '#e91e63',
                                '&.Mui-checked': {
                                  color: '#e91e63',
                                },
                              }}
                            />
                          }
                          label={category.name}
                          sx={{ 
                            display: 'flex',
                            marginBottom: 0.5,
                            '& .MuiFormControlLabel-label': {
                              fontSize: '0.875rem',
                            }
                          }}
                        />
                      ))}
                    </Box>

                    {/* Price Range Filter */}
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#333', fontSize: '0.9rem', marginBottom: 1.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Price Range
                    </Typography>
                    <Box sx={{ marginBottom: 2, paddingX: 1 }}>
                      <Slider
                        value={priceRange}
                        onChange={(e, newValue) => setPriceRange(newValue)}
                        valueLabelDisplay="auto"
                        min={0}
                        max={1000}
                        step={10}
                        sx={{ 
                          color: '#e91e63',
                          '& .MuiSlider-thumb': {
                            '&:hover, &.Mui-focusVisible': {
                              boxShadow: '0 0 0 8px rgba(233, 30, 99, 0.16)',
                            },
                          },
                        }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                        ₹{priceRange[0]} - ₹{priceRange[1]}
                      </Typography>
                    </Box>

                    {/* Minimum Rating Filter */}
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#333', fontSize: '0.9rem', marginBottom: 1.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Minimum Rating
                    </Typography>
                    <FormControl fullWidth size="small" sx={{ marginBottom: 2 }}>
                      <Select
                        value={minRating}
                        onChange={(e) => handleRatingChange(e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#e0e0e0',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#e91e63',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#e91e63',
                          },
                        }}
                      >
                        <MenuItem value={0}>All Ratings</MenuItem>
                        <MenuItem value={4}>4★ & above</MenuItem>
                        <MenuItem value={3}>3★ & above</MenuItem>
                        <MenuItem value={2}>2★ & above</MenuItem>
                        <MenuItem value={1}>1★ & above</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Paper>
              </Grid>
              )}

              {/* Products Grid - RIGHT SIDE */}
              <Grid item xs={12} sm={showFilters ? 9 : 12} md={showFilters ? 9 : 12} lg={showFilters ? 9 : 12} xl={showFilters ? 10 : 12} sx={{ flexGrow: 1, minWidth: 0 }}>
                {/* Results Count and Sort */}
                <Box sx={{ 
                  marginBottom: { xs: 2, md: 3 },
                  paddingBottom: { xs: 1.5, md: 2 },
                  borderBottom: '2px solid #f5f5f5',
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: { xs: 1.5, md: 2 }
                }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#666', 
                      fontWeight: 500,
                      fontSize: { xs: '0.875rem', md: '1rem' }
                    }}
                  >
                    Showing {filteredItems.length} {filteredItems.length === 1 ? 'product' : 'products'}
                  </Typography>
                  
                  {/* Sort Dropdown */}
                  <FormControl size="small" sx={{ minWidth: { xs: 140, md: 180 } }}>
                    <Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      displayEmpty
                      sx={{
                        height: { xs: '36px', md: '40px' },
                        fontSize: { xs: '0.875rem', md: '1rem' },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e91e63',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e91e63',
                        },
                      }}
                    >
                      <MenuItem value="featured">Featured</MenuItem>
                      <MenuItem value="popularity">Most Popular</MenuItem>
                      <MenuItem value="newest">Newest First</MenuItem>
                      <MenuItem value="price-low">Price: Low to High</MenuItem>
                      <MenuItem value="price-high">Price: High to Low</MenuItem>
                      <MenuItem value="rating">Highest Rated</MenuItem>
                      <MenuItem value="name">Name: A to Z</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Products or Empty State */}
                {loading ? (
                  <LoadingAnimation message="Loading our delicious products..." />
                ) : filteredItems.length === 0 ? (
                  <Paper
                    elevation={0}
                    sx={{
                      padding: { xs: 4, sm: 6 },
                      textAlign: 'center',
                      background: '#fff',
                      borderRadius: '12px',
                      border: '1px solid #e0e0e0',
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 600, marginBottom: 1, color: '#333' }}>
                      No products found
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ marginBottom: 3 }}>
                      Try adjusting your filters to find what you're looking for
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={handleClearFilters}
                      sx={{ 
                        background: '#e91e63', 
                        color: '#fff', 
                        textTransform: 'none',
                        '&:hover': {
                          background: '#d81b60',
                        }
                      }}
                    >
                      Clear All Filters
                    </Button>
                  </Paper>
                ) : (
                  <AnimatePresence mode="wait">
                    <Box
                      key={`${selectedCategories.join('-')}-${priceRange.join('-')}-${minRating}-${searchQuery}`}
                      component={motion.div}
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                          xs: 'repeat(2, 1fr)',
                          sm: 'repeat(2, 1fr)',
                          md: 'repeat(3, 1fr)',
                        },
                        gap: { xs: 1.5, sm: 2.5, md: 3 },
                        width: '100%',
                      }}
                    >
                      {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                custom={index}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                whileTap="tap"
                style={{ height: '100%' }}
              >
              <Card 
                onClick={() => {
                  setSelectedProduct(item);
                  setModalOpen(true);
                }}
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  borderRadius: { xs: '8px', sm: '12px' }, 
                  border: '1px solid rgba(0,0,0,0.06)',
                  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
                  height: { xs: '200px', sm: '380px' },
                  background: '#fff',
                  position: 'relative',
                  opacity: isFiltering ? 0.6 : 1,
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
                  {console.log('Image URL:', item.image)}
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      className="product-image"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                        borderRadius: '4px'
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
                      }}
                    >
                      <Cake sx={{ fontSize: { xs: 40, sm: 80 }, color: '#fff', opacity: 0.9 }} />
                    </Box>
                  )}
                </Box>
                <CardContent 
                  className="product-content"
                  sx={{ 
                    p: { xs: 1, sm: 2.5 },
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
                      {item.name}
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
                        {item.rating}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#666', 
                          fontSize: { xs: '0.65rem', sm: '0.85rem' },
                          fontWeight: 500
                        }}
                      >
                        ({item.reviews})
                      </Typography>
                    </Box>
                    {item.description && (
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
                        {item.description}
                      </Typography>
                    )}
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
                      ₹{getMinimumPrice(item)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
              </motion.div>
                      ))}
                    </Box>
                  </AnimatePresence>
                )}
              </Grid>
            </Grid>
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

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="bottom"
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            maxHeight: '85vh',
          },
        }}
      >
        <Box sx={{ padding: 3 }}>
          {/* Drawer Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterList sx={{ color: '#e91e63' }} /> Filters
            </Typography>
            <IconButton onClick={() => setMobileFilterOpen(false)} size="small">
              <Close />
            </IconButton>
          </Box>

          {/* Filter Content */}
          <Box sx={{ overflowY: 'auto', maxHeight: 'calc(85vh - 140px)' }}>
            {/* Categories Filter */}
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#333', fontSize: '0.9rem', marginBottom: 1.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Categories
            </Typography>
            <Box sx={{ marginBottom: 3 }}>
              {categories.map((category) => (
                <FormControlLabel
                  key={category.id}
                  control={
                    <Checkbox
                      checked={selectedCategories.includes(category.name)}
                      onChange={() => handleCategoryToggle(category.name)}
                      sx={{
                        color: '#e91e63',
                        '&.Mui-checked': {
                          color: '#e91e63',
                        },
                      }}
                    />
                  }
                  label={category.name}
                  sx={{ 
                    display: 'flex',
                    marginBottom: 0.5,
                    '& .MuiFormControlLabel-label': {
                      fontSize: '0.875rem',
                    }
                  }}
                />
              ))}
            </Box>

            {/* Price Range Filter */}
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#333', fontSize: '0.9rem', marginBottom: 1.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Price Range
            </Typography>
            <Box sx={{ marginBottom: 3, paddingX: 1 }}>
              <Slider
                value={priceRange}
                onChange={(e, newValue) => setPriceRange(newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={1000}
                step={10}
                sx={{ 
                  color: '#e91e63',
                  '& .MuiSlider-thumb': {
                    '&:hover, &.Mui-focusVisible': {
                      boxShadow: '0 0 0 8px rgba(233, 30, 99, 0.16)',
                    },
                  },
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                ₹{priceRange[0]} - ₹{priceRange[1]}
              </Typography>
            </Box>

            {/* Minimum Rating Filter */}
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#333', fontSize: '0.9rem', marginBottom: 1.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Minimum Rating
            </Typography>
            <FormControl fullWidth size="small" sx={{ marginBottom: 2 }}>
              <Select
                value={minRating}
                onChange={(e) => handleRatingChange(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e91e63',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e91e63',
                  },
                }}
              >
                <MenuItem value={0}>All Ratings</MenuItem>
                <MenuItem value={4}>4★ & above</MenuItem>
                <MenuItem value={3}>3★ & above</MenuItem>
                <MenuItem value={2}>2★ & above</MenuItem>
                <MenuItem value={1}>1★ & above</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, marginTop: 3, paddingTop: 2, borderTop: '1px solid #e0e0e0' }}>
            {(selectedCategories.length > 0 || priceRange[0] !== 0 || priceRange[1] !== 1000 || minRating > 0) && (
              <Button
                variant="outlined"
                onClick={handleClearFilters}
                sx={{
                  flex: 1,
                  textTransform: 'none',
                  borderColor: '#e0e0e0',
                  color: '#666',
                  '&:hover': {
                    borderColor: '#e91e63',
                    backgroundColor: 'rgba(233, 30, 99, 0.04)',
                  },
                }}
              >
                Clear All
              </Button>
            )}
            <Button
              variant="contained"
              onClick={() => setMobileFilterOpen(false)}
              sx={{
                flex: 1,
                textTransform: 'none',
                backgroundColor: '#e91e63',
                '&:hover': {
                  backgroundColor: '#d81b60',
                },
              }}
            >
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Drawer>
    </motion.div>
  );
};

export default Shop;
