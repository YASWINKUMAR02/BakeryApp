import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CircularProgress,
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
} from '@mui/material';
import {
  Visibility,
  Star,
  Cake,
  FilterList,
  Sort,
  Search,
  Dashboard,
  Inventory,
  Category,
  Analytics,
} from '@mui/icons-material';
import { itemAPI, categoryAPI, reviewAPI } from '../../services/api';
import AdminHeader from '../../components/AdminHeader';
import AdminSidebar from '../../components/AdminSidebar';
import { showError } from '../../utils/toast';

const AdminHome = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemReviews, setItemReviews] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Filter and Sort States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('all'); // all, in-stock, low-stock, out-of-stock
  
  // Pagination state
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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
      showError('Failed to fetch data');
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

    // Filter by stock status
    if (stockFilter !== 'all') {
      filtered = filtered.filter(item => {
        const totalStock = (item.stock || 0) + (item.egglessStock || 0);
        if (stockFilter === 'out-of-stock') return totalStock === 0;
        if (stockFilter === 'low-stock') return totalStock > 0 && totalStock <= 10;
        if (stockFilter === 'in-stock') return totalStock > 10;
        return true;
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
      case 'stock':
        filtered.sort((a, b) => {
          const stockA = (a.stock || 0) + (a.egglessStock || 0);
          const stockB = (b.stock || 0) + (b.egglessStock || 0);
          return stockB - stockA;
        });
        break;
      case 'featured':
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
    window.scrollTo({ top: 200, behavior: 'smooth' });
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
    setStockFilter('all');
    setPage(1);
    setSortBy('featured');
  };

  // Calculate stats
  const stats = {
    totalItems: items.length,
    inStock: items.filter(item => (item.stock || 0) + (item.egglessStock || 0) > 10).length,
    lowStock: items.filter(item => {
      const total = (item.stock || 0) + (item.egglessStock || 0);
      return total > 0 && total <= 10;
    }).length,
    outOfStock: items.filter(item => (item.stock || 0) + (item.egglessStock || 0) === 0).length,
  };

  return (
    <>
      <AdminHeader title="Product Catalog" />
      <AdminSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <Box style={{ 
        minHeight: '100vh', 
        background: '#f5f5f5', 
        paddingTop: '80px', 
        paddingBottom: '40px',
        marginLeft: sidebarOpen ? '260px' : '70px',
        transition: 'margin-left 0.3s ease'
      }}>
        <Container maxWidth="xl">
          {/* Header Stats */}
          <Grid container spacing={3} style={{ marginBottom: '24px' }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}>
                <CardContent>
                  <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" style={{ opacity: 0.9 }}>Total Items</Typography>
                      <Typography variant="h4" style={{ fontWeight: 700, marginTop: '8px' }}>
                        {stats.totalItems}
                      </Typography>
                    </Box>
                    <Inventory style={{ fontSize: 48, opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: '#fff' }}>
                <CardContent>
                  <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" style={{ opacity: 0.9 }}>In Stock</Typography>
                      <Typography variant="h4" style={{ fontWeight: 700, marginTop: '8px' }}>
                        {stats.inStock}
                      </Typography>
                    </Box>
                    <Dashboard style={{ fontSize: 48, opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: '#fff' }}>
                <CardContent>
                  <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" style={{ opacity: 0.9 }}>Low Stock</Typography>
                      <Typography variant="h4" style={{ fontWeight: 700, marginTop: '8px' }}>
                        {stats.lowStock}
                      </Typography>
                    </Box>
                    <Analytics style={{ fontSize: 48, opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: '#fff' }}>
                <CardContent>
                  <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" style={{ opacity: 0.9 }}>Out of Stock</Typography>
                      <Typography variant="h4" style={{ fontWeight: 700, marginTop: '8px' }}>
                        {stats.outOfStock}
                      </Typography>
                    </Box>
                    <Category style={{ fontSize: 48, opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Main Content */}
          <Box style={{ marginBottom: '24px' }}>
            <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
              <Box>
                <Typography variant="h4" style={{ fontWeight: 700, marginBottom: '8px' }}>
                  Product Catalog ({filteredItems.length} items)
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Browse and manage your product inventory
                </Typography>
              </Box>
              <Box style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <FormControl size="small" style={{ minWidth: 180 }}>
                  <InputLabel>Stock Filter</InputLabel>
                  <Select
                    value={stockFilter}
                    label="Stock Filter"
                    onChange={(e) => {
                      setStockFilter(e.target.value);
                      setPage(1);
                    }}
                  >
                    <MenuItem value="all">All Items</MenuItem>
                    <MenuItem value="in-stock">In Stock</MenuItem>
                    <MenuItem value="low-stock">Low Stock</MenuItem>
                    <MenuItem value="out-of-stock">Out of Stock</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" style={{ minWidth: 200 }}>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value)}
                    startAdornment={<Sort style={{ marginRight: '8px', color: '#666' }} />}
                  >
                    <MenuItem value="featured">Featured</MenuItem>
                    <MenuItem value="name">Name: A to Z</MenuItem>
                    <MenuItem value="price-low">Price: Low to High</MenuItem>
                    <MenuItem value="price-high">Price: High to Low</MenuItem>
                    <MenuItem value="rating">Customer Rating</MenuItem>
                    <MenuItem value="stock">Stock Level</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
            
            {/* Search Bar */}
            <TextField
              fullWidth
              placeholder="Search products by name or description..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              InputProps={{
                startAdornment: <Search style={{ marginRight: '8px', color: '#666' }} />,
              }}
              size="medium"
              style={{ background: '#fff' }}
            />
          </Box>

          {loading ? (
            <Box style={{ textAlign: 'center', padding: '60px' }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {/* Filter Sidebar */}
              <Grid item xs={12} md={3}>
                <Paper style={{ padding: '20px', position: 'sticky', top: '90px' }}>
                  <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <Typography variant="h6" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FilterList /> Filters
                    </Typography>
                    <Button 
                      size="small" 
                      onClick={handleClearFilters}
                      style={{ textTransform: 'none', color: '#1976d2' }}
                    >
                      Clear All
                    </Button>
                  </Box>
                  <Divider style={{ marginBottom: '20px' }} />

                  {/* Category Filter */}
                  <Typography variant="subtitle1" style={{ fontWeight: 600, marginBottom: '12px' }}>
                    Categories
                  </Typography>
                  <FormGroup style={{ marginBottom: '24px' }}>
                    {categories.map((category) => (
                      <FormControlLabel
                        key={category.id}
                        control={
                          <Checkbox
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => handleCategoryToggle(category.id)}
                            style={{ color: '#1976d2' }}
                          />
                        }
                        label={category.name}
                      />
                    ))}
                  </FormGroup>
                  <Divider style={{ marginBottom: '20px' }} />

                  {/* Price Range Filter */}
                  <Typography variant="subtitle1" style={{ fontWeight: 600, marginBottom: '12px' }}>
                    Price Range
                  </Typography>
                  <Box style={{ padding: '0 8px', marginBottom: '24px' }}>
                    <Slider
                      value={priceRange}
                      onChange={(e, newValue) => {
                        setPriceRange(newValue);
                        setPage(1);
                      }}
                      valueLabelDisplay="auto"
                      min={0}
                      max={1000}
                      step={50}
                      style={{ color: '#1976d2' }}
                    />
                    <Box style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                      <Typography variant="body2" color="textSecondary">
                        ₹{priceRange[0]}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        ₹{priceRange[1]}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider style={{ marginBottom: '20px' }} />

                  {/* Rating Filter */}
                  <Typography variant="subtitle1" style={{ fontWeight: 600, marginBottom: '12px' }}>
                    Minimum Rating
                  </Typography>
                  <FormGroup style={{ marginBottom: '16px' }}>
                    {[4, 3, 2, 1].map((rating) => (
                      <FormControlLabel
                        key={rating}
                        control={
                          <Checkbox
                            checked={minRating === rating}
                            onChange={() => {
                              setMinRating(minRating === rating ? 0 : rating);
                              setPage(1);
                            }}
                            style={{ color: '#1976d2' }}
                          />
                        }
                        label={
                          <Box style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Star style={{ color: '#ffc107', fontSize: 18 }} />
                            <Typography variant="body2">{rating}+ Stars</Typography>
                          </Box>
                        }
                      />
                    ))}
                  </FormGroup>
                </Paper>
              </Grid>

              {/* Products Grid */}
              <Grid item xs={12} md={9}>
                {/* Pagination - Top */}
                {totalPages > 1 && filteredItems.length > 0 && (
                  <Box style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      size="large"
                    />
                  </Box>
                )}
                
                {filteredItems.length === 0 ? (
                  <Paper style={{ padding: '60px', textAlign: 'center' }}>
                    <Typography variant="h6" color="textSecondary">
                      No items match your filters
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={handleClearFilters}
                      style={{ marginTop: '20px', background: '#1976d2', color: '#fff', textTransform: 'none' }}
                    >
                      Clear Filters
                    </Button>
                  </Paper>
                ) : (
                  <>
                    <Grid container spacing={3}>
                      {paginatedItems.map((item) => {
                        const { averageRating, reviewCount } = getItemRatingData(item.id);
                        const totalStock = (item.stock || 0) + (item.egglessStock || 0);
                        
                        return (
                          <Grid item xs={12} sm={6} md={4} key={item.id}>
                            <Card
                              onClick={() => navigate(`/admin/items`)}
                              style={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                              }}
                              elevation={2}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.15)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                              }}
                            >
                              <Box style={{ position: 'relative' }}>
                                {item.imageUrl ? (
                                  <CardMedia
                                    component="img"
                                    height="200"
                                    image={item.imageUrl}
                                    alt={item.name}
                                    style={{ objectFit: 'cover' }}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <Box
                                  style={{
                                    height: 200,
                                    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                                    display: item.imageUrl ? 'none' : 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Cake style={{ fontSize: 80, color: '#1976d2', opacity: 0.8 }} />
                                </Box>
                                {item.featured && (
                                  <Chip
                                    label="Featured"
                                    size="small"
                                    style={{
                                      position: 'absolute',
                                      top: '12px',
                                      left: '12px',
                                      background: '#ff9800',
                                      color: '#fff',
                                      fontWeight: 600,
                                      borderRadius: 0,
                                    }}
                                  />
                                )}
                              </Box>
                              <CardContent style={{ flexGrow: 1 }}>
                                <Typography variant="h6" style={{ fontWeight: 600, marginBottom: '8px' }}>
                                  {item.name}
                                </Typography>
                                <Box style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                                  <Chip 
                                    label={item.category?.name} 
                                    size="small" 
                                    style={{ background: '#1976d2', color: '#fff', borderRadius: 0 }}
                                  />
                                  {totalStock === 0 ? (
                                    <Chip 
                                      label="Out of Stock" 
                                      size="small" 
                                      style={{ background: '#f44336', color: '#fff', borderRadius: 0 }}
                                    />
                                  ) : totalStock <= 10 ? (
                                    <Chip 
                                      label={`Low: ${totalStock}`} 
                                      size="small" 
                                      style={{ background: '#ff9800', color: '#fff', borderRadius: 0 }}
                                    />
                                  ) : (
                                    <Chip 
                                      label={`Stock: ${totalStock}`} 
                                      size="small" 
                                      style={{ background: '#4caf50', color: '#fff', borderRadius: 0 }}
                                    />
                                  )}
                                </Box>
                                <Typography variant="body2" color="textSecondary" style={{ marginBottom: '12px' }}>
                                  {item.description?.substring(0, 80) || 'No description'}...
                                </Typography>
                                <Box style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                  <Star style={{ color: '#ffc107', fontSize: 20 }} />
                                  <Typography variant="body2" style={{ color: '#666' }}>
                                    {reviewCount > 0 
                                      ? `${averageRating} (${reviewCount} review${reviewCount !== 1 ? 's' : ''})`
                                      : 'No reviews yet'}
                                  </Typography>
                                </Box>
                                <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                                  <Box>
                                    <Typography variant="h5" style={{ fontWeight: 700, color: '#1976d2' }}>
                                      ₹{item.price?.toFixed(2)}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                      {item.grams}g • {item.pieces || 1} pc{(item.pieces || 1) > 1 ? 's' : ''}
                                    </Typography>
                                  </Box>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<Visibility />}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/admin/items`);
                                    }}
                                    style={{
                                      borderColor: '#1976d2',
                                      color: '#1976d2',
                                      textTransform: 'none',
                                      fontWeight: 600,
                                      borderRadius: 0,
                                    }}
                                  >
                                    View
                                  </Button>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                    
                    {/* Pagination - Bottom */}
                    {totalPages > 1 && (
                      <Box style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                        <Pagination
                          count={totalPages}
                          page={page}
                          onChange={handlePageChange}
                          color="primary"
                          size="large"
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
    </>
  );
};

export default AdminHome;
