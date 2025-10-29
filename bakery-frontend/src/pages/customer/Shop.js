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
        selectedCategories.includes(item.category?.id)
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

      <Box style={{ paddingTop: '80px', paddingBottom: '40px' }}>
        <Container maxWidth="xl" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
          {/* Search Bar at Top */}
          <Box style={{ marginBottom: '24px' }}>
            <TextField
              fullWidth
              placeholder="Search products by name or description..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              InputProps={{
                startAdornment: <Search style={{ marginLeft: '8px', marginRight: '12px', color: '#999' }} />,
              }}
              sx={{
                background: '#fff',
                borderRadius: '0',
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.95rem',
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
            <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
              {/* Filter Sidebar */}
              <Grid item xs={12} md={3}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    padding: { xs: '12px 16px', sm: '20px' }, 
                    borderRadius: '0',
                    border: '1px solid #e0e0e0',
                    background: '#fff',
                    position: { xs: 'sticky', md: 'static' },
                    top: { xs: '60px', md: 'auto' },
                    zIndex: { xs: 100, md: 'auto' },
                    marginBottom: { xs: '16px', md: '0' },
                  }}
                >
                  {/* Filter Header - Clickable on Mobile */}
                  <Box 
                    onClick={() => setShowFilters(!showFilters)}
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginBottom: { xs: showFilters ? '16px' : '0', md: '20px' },
                      cursor: { xs: 'pointer', md: 'default' },
                      padding: { xs: '8px', md: '0' },
                      borderRadius: '0',
                      '&:hover': {
                        background: { xs: 'rgba(0,0,0,0.02)', md: 'transparent' },
                      },
                    }}
                  >
                    <Typography variant="h6" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
                      <FilterList style={{ fontSize: '1.3rem' }} /> Filters
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Button 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClearFilters();
                        }}
                        sx={{ 
                          textTransform: 'none', 
                          color: '#e91e63',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          padding: '4px 8px',
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
                  <Typography variant="subtitle1" style={{ fontWeight: 700, marginBottom: '12px', fontSize: '0.95rem' }}>
                    Categories
                  </Typography>
                  <FormControl fullWidth size="small" style={{ marginBottom: '24px' }}>
                    <Select
                      value={selectedCategories.length > 0 ? selectedCategories[0] : ''}
                      onChange={(e) => {
                        if (e.target.value === '') {
                          setSelectedCategories([]);
                        } else {
                          setSelectedCategories([e.target.value]);
                        }
                        setPage(1);
                      }}
                      displayEmpty
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
                      <MenuItem value="">
                        <em>All Categories</em>
                      </MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Divider style={{ marginBottom: '20px' }} />

                  {/* Price Range Filter */}
                  <Typography variant="subtitle1" style={{ fontWeight: 700, marginBottom: '12px', fontSize: '0.95rem' }}>
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
                      marginBottom: '8px',
                      '& .MuiSlider-thumb': {
                        backgroundColor: '#e91e63',
                      },
                      '& .MuiSlider-track': {
                        backgroundColor: '#e91e63',
                      },
                      '& .MuiSlider-rail': {
                        backgroundColor: '#e0e0e0',
                      },
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" style={{ fontSize: '0.875rem' }}>
                    ₹{priceRange[0]} - ₹{priceRange[1]}
                  </Typography>

                  <Divider style={{ margin: '20px 0' }} />

                  {/* Rating Filter */}
                  <Typography variant="subtitle1" style={{ fontWeight: 700, marginBottom: '12px', fontSize: '0.95rem' }}>
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
                    <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }} component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
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
                        paddingTop: { xs: '60%', sm: '70%', md: '75%' }, 
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

                    <CardContent sx={{ flexGrow: 1, padding: '16px' }}>
                      {/* Product Name */}
                      <Typography 
                        variant="h6" 
                        gutterBottom 
                        onClick={() => navigate(`/item/${item.id}`)}
                        sx={{ 
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          marginBottom: '12px',
                          cursor: 'pointer',
                          '&:hover': {
                            color: '#1976d2',
                          }
                        }}
                      >
                        {item.name}
                      </Typography>

                      {/* Badges */}
                      <Box style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                        <Chip 
                          label={item.category?.name} 
                          size="small" 
                          sx={{ 
                            background: '#e91e63', 
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            height: '24px',
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
                              fontSize: '0.75rem',
                              height: '24px',
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
                              fontSize: '0.75rem',
                              height: '24px',
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
                              fontSize: '0.75rem',
                              height: '24px',
                              borderRadius: '0',
                            }}
                          />
                        )}
                      </Box>

                      {/* Rating */}
                      <Box style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                        {(() => {
                          const { averageRating, reviewCount } = getItemRatingData(item.id);
                          return reviewCount > 0 ? (
                            <>
                              <Star style={{ color: '#ffa726', fontSize: 18 }} />
                              <Typography variant="body2" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                {averageRating}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" style={{ fontSize: '0.875rem' }}>
                                ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
                              </Typography>
                            </>
                          ) : (
                            <Typography variant="body2" color="text.secondary" style={{ fontSize: '0.875rem' }}>
                              No reviews yet
                            </Typography>
                          );
                        })()}
                      </Box>

                      {/* Price and Button */}
                      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                        <Typography variant="h6" style={{ color: '#000000', fontWeight: 700, fontSize: '1.25rem' }}>
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
                        <Typography variant="caption" color="text.secondary" style={{ fontSize: '0.75rem' }}>
                          {item.grams}g • {item.pieces || 1} pc
                        </Typography>
                      </Box>
                    </CardContent>

                    <CardActions style={{ padding: '12px 16px 16px' }}>
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
                          fontSize: '0.9rem',
                          padding: '8px 16px',
                          borderRadius: '0',
                          '&:hover': {
                            background: item.stock === 0 || !item.available ? '#ccc' : '#d81b60',
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
                      <Box style={{ display: 'flex', justifyContent: 'center', marginTop: '48px', marginBottom: '32px' }}>
                        <Pagination
                          count={totalPages}
                          page={page}
                          onChange={handlePageChange}
                          color="primary"
                          size="large"
                          sx={{
                            '& .MuiPaginationItem-root': {
                              color: '#666',
                              fontSize: '1rem',
                              fontWeight: 500,
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
