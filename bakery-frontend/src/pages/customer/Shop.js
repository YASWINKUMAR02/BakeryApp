import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  Chip,
  TextField,
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
} from '@mui/material';
import {
  ShoppingBag,
  Cake,
  Star,
  StarBorder,
  FilterList,
  Visibility,
  Search,
} from '@mui/icons-material';
import { itemAPI, categoryAPI, reviewAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import CustomerHeader from '../../components/CustomerHeader';
import Footer from '../../components/Footer';
import { showError } from '../../utils/toast';
import { ProductGridSkeleton } from '../../components/LoadingSkeleton';
import { optimizeImageUrl } from '../../utils/imageOptimization';

const Shop = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [itemReviews, setItemReviews] = useState({});
  
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

  // Handle URL category parameter
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const categoryIdParam = searchParams.get('categoryId');
    
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
    } catch (err) {
      showError('Failed to fetch items');
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

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryToggle = (categoryId) => {
    setPage(1); // Reset to first page when filter changes
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
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8f9fa' }}>
      <CustomerHeader />

      <Box sx={{ paddingTop: { xs: '80px', sm: '80px', md: '80px' }, paddingBottom: { xs: '8px', sm: '32px', md: '30px' } }}>
        <Container maxWidth="xl" sx={{ paddingLeft: { xs: '3px', sm: '16px', md: '16px' }, paddingRight: { xs: '3px', sm: '16px', md: '16px' } }}>
          {/* Search Bar at Top */}
          <Box sx={{ marginBottom: { xs: '6px', sm: '20px', md: '16px' } }}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              InputProps={{
                startAdornment: <Search sx={{ marginLeft: { xs: '1px', md: '6px' }, marginRight: { xs: '3px', md: '8px' }, color: '#999', fontSize: { xs: '0.95rem', md: '1.2rem' } }} />,
              }}
              sx={{
                background: '#fff',
                borderRadius: '0',
                '& .MuiOutlinedInput-root': {
                  fontSize: { xs: '0.75rem', md: '0.875rem' },
                  padding: { xs: '0', md: 'default' },
                  '& input': {
                    padding: { xs: '5px 6px', sm: '12px 14px', md: '10px 12px' },
                  },
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
              }}
            />
          </Box>

          {loading ? (
            <ProductGridSkeleton count={12} />
          ) : (
            <Grid container spacing={{ xs: 0.5, sm: 2, md: 2 }}>
              {/* Filter Sidebar */}
              <Grid item xs={12} md={3}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    padding: { xs: '4px 6px', sm: '20px', md: '16px' }, 
                    borderRadius: '0',
                    border: '1px solid #e0e0e0',
                    background: '#fff',
                    position: { xs: 'sticky', md: 'static' },
                    top: { xs: '80px', md: 'auto' },
                    zIndex: { xs: 100, md: 'auto' },
                    marginBottom: { xs: '4px', md: '0' },
                    marginTop: { xs: '6px', md: '12px' },
                  }}
                >
                  {/* Filter Header - Clickable on Mobile */}
                  <Box 
                    onClick={() => setShowFilters(!showFilters)}
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginBottom: { xs: showFilters ? '6px' : '0', md: '16px' },
                      cursor: { xs: 'pointer', md: 'default' },
                      padding: { xs: '0', md: '0' },
                      borderRadius: '0',
                      '&:hover': {
                        background: { xs: 'rgba(0,0,0,0.02)', md: 'transparent' },
                      },
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: { xs: '2px', md: '6px' }, fontSize: { xs: '0.75rem', md: '1rem' } }}>
                      <FilterList sx={{ fontSize: { xs: '0.9rem', md: '1.2rem' } }} /> Filters
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Button 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClearFilters();
                        }}
                        sx={{ 
                          textTransform: 'none', 
                          color: '#e91e63',
                          fontSize: { xs: '0.6rem', md: '0.75rem' },
                          fontWeight: 600,
                          padding: { xs: '0 3px', md: '2px 4px' },
                          display: { xs: showFilters ? 'inline-flex' : 'none', md: 'inline-flex' },
                          '&:hover': {
                            background: 'rgba(233, 30, 99, 0.08)',
                          }
                        }}
                      >
                        Clear All
                      </Button>
                      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                        {showFilters ? '▲' : '▼'}
                      </Box>
                    </Box>
                  </Box>

                  {/* Filter Content - Collapsible on Mobile */}
                  <Box sx={{ display: { xs: showFilters ? 'block' : 'none', md: 'block' } }}>

                  {/* Categories Filter */}
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, marginBottom: { xs: '4px', md: '12px' }, fontSize: { xs: '0.7rem', md: '0.95rem' } }}>
                    Categories
                  </Typography>
                  <FormControl fullWidth size="small" sx={{ marginBottom: { xs: '8px', md: '16px' } }}>
                    <Select
                      value={selectedCategories.length > 0 ? selectedCategories[0] : ''}
                      onChange={(e) => {
                        if (e.target.value === '') {
                          setSelectedCategories([]);
                        } else {
                          // Find the category name from the ID
                          const selectedCategory = categories.find(cat => cat.name === e.target.value);
                          if (selectedCategory) {
                            setSelectedCategories([selectedCategory.name]);
                          }
                        }
                        setPage(1);
                      }}
                      displayEmpty
                      sx={{
                        fontSize: { xs: '0.8rem', md: '0.875rem' },
                        '& .MuiSelect-select': {
                          padding: { xs: '6px 10px', md: '8.5px 14px' },
                        },
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
                      <MenuItem value="">
                        <em>All Categories</em>
                      </MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.name}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Divider sx={{ marginBottom: { xs: '6px', md: '16px' } }} />

                  {/* Price Range Filter */}
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, marginBottom: { xs: '4px', md: '12px' }, fontSize: { xs: '0.7rem', md: '0.95rem' } }}>
                    Price Range
                  </Typography>
                  <Slider
                    value={priceRange}
                    onChange={(e, newValue) => {
                      setPriceRange(newValue);
                      setPage(1);
                    }}
                    valueLabelDisplay="auto"
                    min={0}
                    max={1000}
                    sx={{ 
                      color: '#e91e63', 
                      marginBottom: { xs: '2px', md: '6px' },
                      height: { xs: 2, md: 6 },
                      '& .MuiSlider-thumb': {
                        backgroundColor: '#e91e63',
                        width: { xs: 10, md: 16 },
                        height: { xs: 10, md: 16 },
                      },
                      '& .MuiSlider-track': {
                        backgroundColor: '#e91e63',
                      },
                      '& .MuiSlider-rail': {
                        backgroundColor: '#e0e0e0',
                      },
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.6rem', md: '0.8rem' } }}>
                    ₹{priceRange[0]} - ₹{priceRange[1]}
                  </Typography>

                  <Divider sx={{ margin: { xs: '6px 0', md: '16px 0' } }} />

                  {/* Rating Filter */}
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, marginBottom: { xs: '4px', md: '12px' }, fontSize: { xs: '0.7rem', md: '0.95rem' } }}>
                    Minimum Rating
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={minRating}
                      onChange={(e) => {
                        setMinRating(e.target.value);
                        setPage(1);
                      }}
                      sx={{
                        fontSize: { xs: '0.8rem', md: '0.875rem' },
                        '& .MuiSelect-select': {
                          padding: { xs: '6px 10px', md: '8.5px 14px' },
                        },
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

              {/* Products Grid */}
              <Grid item xs={12} md={9}>
                {filteredItems.length === 0 ? (
                  <Paper style={{ padding: '60px', textAlign: 'center', borderRadius: '12px' }}>
                    <Typography variant="h6" color="textSecondary">
                      No items match your filters
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={handleClearFilters}
                      style={{ marginTop: '20px', background: '#ff69b4', color: '#fff', textTransform: 'none' }}
                    >
                      Clear Filters
                    </Button>
                  </Paper>
                ) : (
                  <>
                    <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
                      {paginatedItems.map((item, index) => (
                <Grid item xs={6} sm={6} md={4} key={item.id} component={motion.div} variants={itemVariants}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      borderRadius: '0', 
                      border: '1px solid #e0e0e0',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        transform: 'translateY(-4px)',
                      }
                    }}
                  >
                    {/* Image Container */}
                    <Box 
                      sx={{ 
                        position: 'relative', 
                        cursor: 'pointer', 
                        paddingTop: { xs: '50%', sm: '70%', md: '75%' }, 
                        overflow: 'hidden' 
                      }} 
                      onClick={() => navigate(`/item/${item.id}`)}
                    >
                      {item.imageUrl ? (
                        <CardMedia
                          component="img"
                          image={optimizeImageUrl(item.imageUrl, { width: 400, quality: 85 })}
                          alt={item.name}
                          loading="lazy"
                          style={{ 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover', 
                            borderRadius: '0' 
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <Box
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: item.imageUrl ? 'none' : 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '0',
                        }}
                      >
                        <Cake style={{ fontSize: 80, color: '#fff', opacity: 0.9 }} />
                      </Box>
                    </Box>

                    <CardContent sx={{ flexGrow: 1, padding: { xs: '4px', sm: '12px', md: '12px' } }}>
                      {/* Product Name */}
                      <Typography 
                        variant="h6" 
                        gutterBottom 
                        onClick={() => navigate(`/item/${item.id}`)}
                        sx={{ 
                          fontWeight: 700,
                          fontSize: { xs: '0.65rem', sm: '0.95rem', md: '0.95rem' },
                          marginBottom: { xs: '1.5px', sm: '8px', md: '8px' },
                          cursor: 'pointer',
                          lineHeight: 1.3,
                          '&:hover': {
                            color: '#1976d2',
                          }
                        }}
                      >
                        {item.name}
                      </Typography>

                      {/* Badges */}
                      <Box sx={{ display: 'flex', gap: { xs: '1px', md: '4px' }, marginBottom: { xs: '1.5px', sm: '8px', md: '8px' }, flexWrap: 'wrap' }}>
                        <Chip 
                          label={item.category?.name} 
                          size="small" 
                          sx={{ 
                            background: '#e91e63', 
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: { xs: '0.48rem', sm: '0.7rem', md: '0.7rem' },
                            height: { xs: '14px', md: '20px' },
                            borderRadius: '0',
                          }}
                        />
                        {item.stock === 0 ? (
                          <Chip 
                            label="Out of Stock" 
                            size="small" 
                            sx={{ 
                              background: '#f44336', 
                              color: '#fff',
                              fontWeight: 600,
                              fontSize: { xs: '0.55rem', sm: '0.7rem', md: '0.75rem' },
                              height: { xs: '16px', md: '24px' },
                              borderRadius: '0',
                            }}
                          />
                        ) : item.stock <= 10 ? (
                          <Chip 
                            label={`Only ${item.stock} left`} 
                            size="small" 
                            sx={{ 
                              background: '#ff9800', 
                              color: '#fff',
                              fontWeight: 600,
                              fontSize: { xs: '0.55rem', sm: '0.7rem', md: '0.75rem' },
                              height: { xs: '16px', md: '24px' },
                              borderRadius: '0',
                            }}
                          />
                        ) : (
                          <Chip 
                            label="In Stock" 
                            size="small" 
                            sx={{ 
                              background: '#4caf50', 
                              color: '#fff',
                              fontWeight: 600,
                              fontSize: { xs: '0.55rem', sm: '0.7rem', md: '0.75rem' },
                              height: { xs: '16px', md: '24px' },
                              borderRadius: '0',
                            }}
                          />
                        )}
                      </Box>

                      {/* Rating */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: '1px', md: '3px' }, marginBottom: { xs: '1.5px', sm: '8px', md: '8px' } }}>
                        {(() => {
                          const { averageRating, reviewCount } = getItemRatingData(item.id);
                          return reviewCount > 0 ? (
                            <>
                              <Star sx={{ color: '#ffa726', fontSize: { xs: 8, sm: 16, md: 16 } }} />
                              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: '0.52rem', sm: '0.8rem', md: '0.8rem' } }}>
                                {averageRating}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.52rem', sm: '0.8rem', md: '0.8rem' } }}>
                                ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
                              </Typography>
                            </>
                          ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.6rem', sm: '0.8rem', md: '0.8rem' } }}>
                              No reviews yet
                            </Typography>
                          );
                        })()}
                      </Box>

                      {/* Price and Button */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                        <Typography variant="h6" sx={{ color: '#000000', fontWeight: 700, fontSize: { xs: '0.75rem', sm: '1.1rem', md: '1.1rem' } }}>
                          {(() => {
                            const catName = item.category?.name?.toLowerCase() || '';
                            const isWeightBased = catName.includes('occasional') || catName.includes('premium') || catName.includes('party');
                            if (isWeightBased && item.pricePerKg) {
                              try {
                                const prices = JSON.parse(item.pricePerKg);
                                const priceValues = Object.values(prices).filter(p => p && parseFloat(p) > 0).map(p => parseFloat(p));
                                const minPrice = Math.min(...priceValues);
                                return `₹${minPrice.toFixed(0)}`;
                              } catch (e) {
                                return `₹${item.price?.toFixed(0)}`;
                              }
                            }
                            return `₹${item.price?.toFixed(0)}`;
                          })()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.48rem', sm: '0.7rem', md: '0.7rem' } }}>
                          {item.grams}g • {item.pieces || 1} pc
                        </Typography>
                      </Box>
                    </CardContent>

                    <CardActions sx={{ padding: { xs: '2px 4px 4px', sm: '10px 12px 12px', md: '8px 12px 12px' } }}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<ShoppingBag />}
                        onClick={() => navigate(`/item/${item.id}`)}
                        disabled={item.stock === 0 || !item.available}
                        sx={{ 
                          background: item.stock === 0 || !item.available ? '#ccc' : '#e91e63',
                          color: '#fff',
                          textTransform: 'none', 
                          fontWeight: 600,
                          fontSize: { xs: '0.58rem', sm: '0.85rem', md: '0.85rem' },
                          padding: { xs: '2px 5px', sm: '7px 14px', md: '6px 12px' },
                          borderRadius: '0',
                          minHeight: { xs: '24px', md: '32px' },
                          '&:hover': {
                            background: item.stock === 0 || !item.available ? '#ccc' : '#d81b60',
                          },
                          '& .MuiButton-startIcon': {
                            marginRight: { xs: '0.5px', md: '6px' },
                            '& > *': {
                              fontSize: { xs: '0.8rem', md: '1.1rem' }
                            }
                          }
                        }}
                      >
                        {item.stock === 0 || !item.available ? 'Out of Stock' : 'Buy Now'}
                      </Button>
                    </CardActions>
                  </Card>
                      </Grid>
                      ))}
                    </Grid>
                    
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
                  </>
                )}
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>

      
      <Footer />
    </Box>
  );
};

export default Shop;
