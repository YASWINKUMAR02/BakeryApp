import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Chip,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Divider,
  Slider,
  Pagination,
  ListItemText,
  IconButton,
  Breadcrumbs,
} from '@mui/material';
import {
  ShoppingBag,
  ShoppingCart,
  Cake,
  Star,
  FilterList,
  Search,
} from '@mui/icons-material';
import { itemAPI, categoryAPI, reviewAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Footer from '../../components/Footer';
import DeliveryNotice from '../../components/DeliveryNotice';
import { showError } from '../../utils/toast';
import { ProductGridSkeleton } from '../../components/LoadingSkeleton';
import { optimizeImageUrl } from '../../utils/imageOptimization';
import { pageTransitions } from '../../utils/pageTransitions';
import ProductCard from '../../components/ProductCard';
import { formatCurrency } from '../../utils/currencyUtils';

const Shop = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true); // Default matching basic-frontend
  const [itemReviews, setItemReviews] = useState({});
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Filter and sort states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination state
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle URL category parameter and navigation-based reset
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const categoryIdParam = searchParams.get('categoryId');

    // If no specific category/search params, reset all filters
    // This happens when clicking "Shop" in the header
    if (!categoryParam && !categoryIdParam && searchParams.toString() === '') {
      setSelectedCategories([]);
      setPriceRange([0, 1000]);
      setMinRating(0);
      setSearchQuery('');
      setSortBy('featured');
      setPage(1);
      return;
    }

    if (categories.length > 0) {
      let matchingCategory = null;

      // Check for category ID first
      if (categoryIdParam) {
        matchingCategory = categories.find(cat => cat.id === parseInt(categoryIdParam));
      }
      // Then check for category name
      else if (categoryParam) {
        matchingCategory = categories.find(cat => cat.name === categoryParam);
      }

      if (matchingCategory && !selectedCategories.includes(matchingCategory.name)) {
        setSelectedCategories([matchingCategory.name]);
      }
    }
  }, [searchParams, categories]);

  const fetchItems = async () => {
    try {
      const [itemsResponse, categoriesResponse] = await Promise.all([
        itemAPI.getAll(),
        categoryAPI.getAll(),
      ]);

      if (itemsResponse.data.success) {
        let itemsData = itemsResponse.data.data;

        // Enhance items with Best Seller / New flags for UI demo if not present
        itemsData = itemsData.map((item, index) => ({
          ...item,
          isBestSeller: item.isBestSeller || index % 5 === 0,
          isNew: item.isNew || index % 7 === 1
        }));

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
    } catch (err) {
      showError('Something went wrong');
    } finally {
      setLoading(false);
    }
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
        selectedCategories.includes(item.category?.name)
      );
    }

    // Filter by price range
    filtered = filtered.filter(item =>
      item.price >= priceRange[0] && item.price <= priceRange[1]
    );

    // Filter by minimum rating
    if (minRating > 0) {
      filtered = filtered.filter(item => {
        const { averageRating } = getItemRatingData(item.id);
        return parseFloat(averageRating) >= minRating;
      });
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
        filtered.sort((a, b) => {
          const ratingA = parseFloat(getItemRatingData(a.id).averageRating);
          const ratingB = parseFloat(getItemRatingData(b.id).averageRating);
          return ratingB - ratingA;
        });
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return filtered;
  };

  const filteredItems = getFilteredAndSortedItems();

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const paginationStart = (page - 1) * itemsPerPage + 1;
  const paginationEnd = page * itemsPerPage;

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryToggle = (categoryName) => {
    setPage(1); // Reset to first page when filter changes
    setSelectedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    setMinRating(0);
    setSearchQuery('');
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  // Animation variants from basic-frontend
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
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f5f5f5', pb: { xs: '80px', sm: '70px' }, pt: { xs: '80px', md: '100px' } }}>
        <Box sx={{ paddingBottom: { xs: '40px', sm: '60px' } }}>
          <Container maxWidth="xl" sx={{ paddingX: { xs: 2, sm: 3, md: 4 } }}>

            {/* Mobile Filter Button */}
            <Box sx={{ display: { xs: 'block', sm: 'none' }, marginBottom: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                sx={{
                  borderColor: 'rgba(0,0,0,0.1)',
                  color: '#1a1a1a',
                  background: '#fff',
                  textTransform: 'none',
                  padding: '12px',
                  justifyContent: 'space-between',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  '&:hover': {
                    borderColor: '#e91e63',
                    backgroundColor: 'rgba(233, 30, 99, 0.02)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>Filters & Sorting</span>
                </Box>
                {(selectedCategories.length > 0 || priceRange[0] !== 0 || priceRange[1] !== 1000 || minRating > 0) &&
                  <Chip size="small" label={selectedCategories.length + (priceRange[0] !== 0 || priceRange[1] !== 1000 ? 1 : 0) + (minRating > 0 ? 1 : 0)} sx={{ height: 22, bgcolor: '#e91e63', color: '#fff', fontWeight: 600 }} />
                }
              </Button>
            </Box>

            {/* Mobile Filters Content (Collapsible) */}
            {mobileFilterOpen && (
              <Box sx={{ display: { xs: 'block', sm: 'none' }, mb: 3 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '12px',
                    border: '1px solid #eee',
                    background: '#fff',
                  }}
                >
                  {/* Filter content for mobile */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Categories</Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        multiple
                        value={selectedCategories}
                        onChange={(e) => {
                          setSelectedCategories(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value);
                          setPage(1);
                        }}
                        renderValue={(selected) => selected.join(', ')}
                        sx={{
                          borderRadius: '8px',
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#e91e63' },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#e91e63' },
                        }}
                      >
                        {categories.map((category) => (
                          <MenuItem key={category.id} value={category.name}>
                            <Checkbox checked={selectedCategories.indexOf(category.name) > -1} size="small" sx={{ color: '#e91e63', '&.Mui-checked': { color: '#e91e63' } }} />
                            <Typography variant="body2">{category.name}</Typography>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ mb: 2, px: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>Price Range</Typography>
                    <Slider
                      value={priceRange}
                      onChange={(e, newValue) => setPriceRange(newValue)}
                      valueLabelDisplay="auto"
                      min={0}
                      max={1000}
                      sx={{ color: '#e91e63' }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="caption" sx={{ color: '#666' }}>{formatCurrency(priceRange[0])}</Typography>
                      <Typography variant="caption" sx={{ color: '#666' }}>{formatCurrency(priceRange[1])}</Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>Min Rating</Typography>
                    <Select
                      fullWidth
                      size="small"
                      value={minRating}
                      onChange={(e) => setMinRating(e.target.value)}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Minimum Rating' }}
                    >
                      <MenuItem value={0}>All Ratings</MenuItem>
                      <MenuItem value={4}>4★ & above</MenuItem>
                      <MenuItem value={3}>3★ & above</MenuItem>
                    </Select>
                  </Box>
                  <Button fullWidth onClick={handleClearFilters} variant="outlined" sx={{ mt: 3, borderColor: '#e91e63', color: '#e91e63' }}>Clear Filters</Button>
                </Paper>
              </Box>
            )}

            <Grid container spacing={4} sx={{ alignItems: 'flex-start' }}>
              {/* Filter Sidebar - LEFT SIDE (Desktop/Tablet) */}
              {showFilters && (
                <Grid item sm={4} md={3} lg={3} sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: '16px',
                      border: '1px solid rgba(0,0,0,0.08)',
                      background: '#fff',
                      position: 'sticky',
                      top: '100px',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Filters</Typography>
                      <Button size="small" onClick={handleClearFilters} sx={{ color: '#e91e63', textTransform: 'none', fontWeight: 600 }}>Reset</Button>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {/* Categories */}
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="overline" sx={{ fontWeight: 800, mb: 1, color: '#999', display: 'block', letterSpacing: '0.1em' }}>CATEGORIES</Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        {(showAllCategories ? categories : categories.slice(0, 3)).map((category) => {
                          const isSelected = selectedCategories.includes(category.name);
                          return (
                            <FormControlLabel
                              key={category.id}
                              control={
                                <Checkbox
                                  checked={isSelected}
                                  onChange={() => handleCategoryToggle(category.name)}
                                  size="small"
                                  sx={{
                                    color: '#ccc',
                                    '&.Mui-checked': { color: '#e91e63' },
                                    padding: '4px 8px',
                                  }}
                                />
                              }
                              label={
                                <Typography variant="body2" sx={{ fontWeight: isSelected ? 600 : 400, color: isSelected ? '#e91e63' : '#4a5568' }}>
                                  {category.name}
                                </Typography>
                              }
                              sx={{
                                margin: 0,
                                py: 0.2,
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.02)', borderRadius: '4px' }
                              }}
                            />
                          );
                        })}
                        {categories.length > 3 && (
                          <Button
                            size="small"
                            onClick={() => setShowAllCategories(!showAllCategories)}
                            sx={{
                              mt: 0.5,
                              color: '#e91e63',
                              textTransform: 'none',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              justifyContent: 'flex-start',
                              paddingLeft: '8px',
                              '&:hover': { background: 'transparent', textDecoration: 'underline' }
                            }}
                          >
                            {showAllCategories ? 'Show Less' : `+ Show ${categories.length - 3} More`}
                          </Button>
                        )}
                      </Box>
                    </Box>

                    {/* Price Range */}
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="overline" sx={{ fontWeight: 800, mb: 2, color: '#999', display: 'block', letterSpacing: '0.1em' }}>PRICE RANGE</Typography>
                      <Box sx={{ px: 1 }}>
                        <Slider
                          value={priceRange}
                          onChange={(e, newValue) => setPriceRange(newValue)}
                          valueLabelDisplay="auto"
                          min={0}
                          max={1000}
                          sx={{
                            color: '#e91e63',
                            height: 6,
                            '& .MuiSlider-thumb': {
                              width: 18,
                              height: 18,
                              backgroundColor: '#fff',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                              border: '2px solid #e91e63',
                              '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                                boxShadow: '0 0 0 8px rgba(233, 30, 99, 0.1)',
                              },
                            },
                            '& .MuiSlider-rail': {
                              opacity: 0.2,
                              bgcolor: '#ccc'
                            }
                          }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5 }}>
                          <Typography variant="caption" sx={{ color: '#1a1a1a', fontWeight: 700 }}>{formatCurrency(priceRange[0])}</Typography>
                          <Typography variant="caption" sx={{ color: '#1a1a1a', fontWeight: 700 }}>{formatCurrency(priceRange[1])}</Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Rating */}
                    <Box>
                      <Typography variant="overline" sx={{ fontWeight: 800, mb: 1, color: '#999', display: 'block', letterSpacing: '0.1em' }}>RATING</Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          value={minRating}
                          onChange={(e) => setMinRating(e.target.value)}
                          sx={{
                            borderRadius: '10px',
                            backgroundColor: '#f8f9fa',
                            '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #eee' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#e91e63' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#e91e63' },
                            fontSize: '0.85rem',
                            fontWeight: 600
                          }}
                        >
                          <MenuItem value={0}>All Ratings</MenuItem>
                          <MenuItem value={4}>4★ & above</MenuItem>
                          <MenuItem value={3}>3★ & above</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Paper>
                </Grid>
              )}

              {/* Products Grid - RIGHT SIDE */}
              <Grid item xs={12} sm={showFilters ? 8 : 12} md={showFilters ? 9 : 12} lg={showFilters ? 9 : 12}>

                {/* Search and Sort Header */}
                <Box sx={{ mb: 3 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      mb: 2,
                      borderRadius: '16px',
                      border: '1px solid rgba(0,0,0,0.08)',
                      background: '#fff',
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'row' },
                      alignItems: { xs: 'stretch', md: 'center' },
                      gap: 1.5,
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                    }}
                  >
                    <Box sx={{ flexGrow: 1, maxWidth: { md: '500px' } }}>
                      <TextField
                        fullWidth
                        placeholder="What are you craving today?"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        size="small"
                        InputProps={{
                          startAdornment: <Search sx={{ ml: 1, mr: 1, color: '#e91e63', fontSize: '20px' }} />,
                          sx: {
                            borderRadius: '12px',
                            backgroundColor: '#f8f9fa',
                            '& fieldset': { border: 'none' },
                            '&:hover': { backgroundColor: '#f1f3f5' },
                            '&.Mui-focused': { backgroundColor: '#fff', boxShadow: '0 0 0 2px rgba(233, 30, 99, 0.15)' },
                            fontSize: '0.9rem'
                          }
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', px: { md: 1 } }}>
                      <FormControl size="small" sx={{ minWidth: 160 }}>
                        <Select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          displayEmpty
                          sx={{
                            borderRadius: '12px',
                            backgroundColor: '#f8f9fa',
                            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: '#495057',
                            '&:hover': { backgroundColor: '#f1f3f5' }
                          }}
                        >
                          <MenuItem value="featured">Sort: Featured</MenuItem>
                          <MenuItem value="price-low">Price: Low to High</MenuItem>
                          <MenuItem value="price-high">Price: High to Low</MenuItem>
                          <MenuItem value="rating">Top Rated</MenuItem>
                          <MenuItem value="name">A - Z</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Paper>

                  {/* Active Filter Chips */}
                  {(selectedCategories.length > 0 || minRating > 0 || (priceRange[0] > 0 || priceRange[1] < 1000)) && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1, alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ color: '#999', fontWeight: 600, mr: 1 }}>ACTIVE FILTERS:</Typography>
                      {selectedCategories.map(cat => (
                        <Chip
                          key={cat}
                          label={cat}
                          size="small"
                          onDelete={() => handleCategoryToggle(cat)}
                          sx={{ borderRadius: '6px', bgcolor: 'rgba(233, 30, 99, 0.08)', color: '#e91e63', fontWeight: 600, border: '1px solid rgba(233, 30, 99, 0.1)' }}
                        />
                      ))}
                      {minRating > 0 && (
                        <Chip
                          label={`${minRating}★ & above`}
                          size="small"
                          onDelete={() => setMinRating(0)}
                          sx={{ borderRadius: '6px', bgcolor: 'rgba(233, 30, 99, 0.08)', color: '#e91e63', fontWeight: 600, border: '1px solid rgba(233, 30, 99, 0.1)' }}
                        />
                      )}
                      {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                        <Chip
                          label={`${formatCurrency(priceRange[0])} - ${formatCurrency(priceRange[1])}`}
                          size="small"
                          onDelete={() => setPriceRange([0, 1000])}
                          sx={{ borderRadius: '6px', bgcolor: 'rgba(233, 30, 99, 0.08)', color: '#e91e63', fontWeight: 600, border: '1px solid rgba(233, 30, 99, 0.1)' }}
                        />
                      )}
                      <Button
                        size="small"
                        onClick={handleClearFilters}
                        sx={{ color: '#666', fontSize: '0.7rem', textTransform: 'none', ml: 'auto' }}
                      >
                        Clear all
                      </Button>
                    </Box>
                  )}
                </Box>

                {/* Products or Empty State */}
                {loading ? (
                  <ProductGridSkeleton count={itemsPerPage} />
                ) : filteredItems.length === 0 ? (
                  <Box
                    component={motion.div}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    sx={{
                      padding: { xs: 6, md: 10 },
                      textAlign: 'center',
                      background: '#fff',
                      borderRadius: '24px',
                      border: '1px solid rgba(0,0,0,0.06)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}
                  >
                    <Box sx={{
                      width: 80, height: 80, borderRadius: '20px',
                      bgcolor: 'rgba(233, 30, 99, 0.05)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', mb: 3
                    }}>
                      <ShoppingBag sx={{ fontSize: 40, color: '#e91e63' }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, marginBottom: 1, color: '#1a1a1a' }}>
                      Oops! No matches found
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', marginBottom: 4, maxWidth: '300px' }}>
                      We couldn't find any products matching your current filters. Try resetting them!
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={handleClearFilters}
                      sx={{
                        background: '#e91e63',
                        color: '#fff',
                        textTransform: 'none',
                        px: 4,
                        py: 1.2,
                        borderRadius: '50px',
                        fontWeight: 700,
                        boxShadow: '0 8px 20px rgba(233, 30, 99, 0.2)',
                        '&:hover': {
                          background: '#d81b60',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 25px rgba(233, 30, 99, 0.3)',
                        }
                      }}
                    >
                      Reset All Filters
                    </Button>
                  </Box>
                ) : (
                  <AnimatePresence mode="wait">
                    <Box
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
                      {paginatedItems.map((item, index) => (
                        <ProductCard
                          key={item.id}
                          item={item}
                          ratingData={getItemRatingData(item.id)}
                          index={index}
                        />
                      ))}
                    </Box>
                  </AnimatePresence>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: { xs: '16px', sm: '32px', md: '48px' }, marginBottom: { xs: '12px', sm: '24px', md: '32px' } }}>
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      size="large"
                      sx={{
                        '& .MuiPaginationItem-root': {
                          color: '#666',
                          fontSize: { xs: '0.8rem', sm: '0.95rem', md: '1rem' },
                          fontWeight: 500,
                          minWidth: { xs: '28px', md: '40px' },
                          height: { xs: '28px', md: '40px' },
                        },
                        '& .Mui-selected': {
                          backgroundColor: '#e91e63 !important',
                          color: '#fff',
                        },
                      }}
                    />
                  </Box>
                )}
              </Grid>
            </Grid>
          </Container>
        </Box>
        <Footer />
      </Box>
    </motion.div>
  );
};

export default Shop;
