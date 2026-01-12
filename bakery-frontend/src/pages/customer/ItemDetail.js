import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
  IconButton,
  Divider,
  Rating,
  TextField,
  Card,
  CardContent,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  FavoriteBorder,
  Share,
  Star,
  Check,
  ArrowBack,
  Close,
  ShoppingCart,
  Add,
  Remove
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { itemAPI, cartAPI, reviewAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import CustomerHeader from '../../components/CustomerHeader';
import ProductCard from '../../components/ProductCard';
import { showSuccess, showError } from '../../utils/toast';
import QuantitySelector from '../../components/QuantitySelector';
import { formatCurrency } from '../../utils/currencyUtils';
import PriceDisplay from '../../components/PriceDisplay';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isEggless, setIsEggless] = useState(false);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  const fetchItemDetails = async () => {
    try {
      const [itemResponse, reviewResponse] = await Promise.all([
        itemAPI.getById(id),
        reviewAPI.getByItem(id),
      ]);
      if (itemResponse.data.success) {
        const currentItem = itemResponse.data.data;
        setItem(currentItem);

        // Fetch similar products from the same category
        if (currentItem.category?.id) {
          fetchSimilarProducts(currentItem.category.id, currentItem.id);
        }
      }
      if (reviewResponse.data.success) setReviews(reviewResponse.data.data);
    } catch (err) {
      showError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarProducts = async (categoryId, currentItemId) => {
    try {
      const response = await itemAPI.getAll();
      if (response.data.success) {
        const allProducts = response.data.data.filter(i => i.id !== currentItemId);

        // Prioritize same category, but include others
        const sameCategory = allProducts.filter(i => i.category?.id === categoryId);
        const otherProducts = allProducts.filter(i => i.category?.id !== categoryId);

        // Mix: 4 from same category + 4 from other categories
        const mixed = [...sameCategory.slice(0, 4), ...otherProducts.slice(0, 4)];

        setSimilarProducts(mixed);
      }
    } catch (err) {
      console.error('Failed to fetch similar products:', err);
    }
  };

  const isWeightBased = () => {
    const catName = item?.category?.name?.toLowerCase() || '';
    return catName.includes('occasional') || catName.includes('premium') || catName.includes('party');
  };

  // Initialize quantity/weight
  useEffect(() => {
    if (item && isWeightBased()) {
      // Default to 1kg or first available weight
      if (item.pricePerKg) {
        try {
          const prices = JSON.parse(item.pricePerKg);
          const weights = Object.keys(prices).map(parseFloat).sort((a, b) => a - b);
          setQuantity(weights.includes(1) ? 1 : (weights[0] || 1));
        } catch (e) { setQuantity(1); }
      } else {
        setQuantity(1);
      }
    }
  }, [item]);

  const getCurrentPrice = () => {
    if (isWeightBased() && item.pricePerKg) {
      try {
        const priceData = JSON.parse(item.pricePerKg);
        // Try strict string matching first
        let price = priceData[quantity.toString()];

        // If not found, try number matching
        if (price === undefined) {
          price = priceData[quantity];
        }

        // If still not found, fuzzy match (parsing keys)
        if (price === undefined) {
          const key = Object.keys(priceData).find(k => parseFloat(k) === parseFloat(quantity));
          if (key) price = priceData[key];
        }

        return (parseFloat(price) || item.price || 0) + (isEggless ? 30 : 0);
      } catch (e) {
        return (item.price || 0) + (isEggless ? 30 : 0);
      }
    }
    // For non-cake items, basic price * quantity (if we want to show total unit price, logic differs)
    // Actually, usually detail pages show Unit Price, and Total is calc'd in cart. 
    // But here let's show the single unit price (adjusted for eggless).
    return (item.price || 0) + (isEggless ? 30 : 0);
  };

  const getSubtotal = () => {
    const unitPrice = getCurrentPrice();
    if (isWeightBased()) return unitPrice; // Price is per weight unit selected
    return unitPrice * quantity;
  };

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      const cartItemData = {
        itemId: item.id,
        quantity: 1, // API usually expects 1 row item
        eggType: isEggless ? 'EGGLESS' : null,
      };
      if (isWeightBased()) {
        cartItemData.selectedWeight = quantity;
        cartItemData.priceAtAddition = getCurrentPrice();
      } else {
        cartItemData.quantity = quantity;
      }
      await cartAPI.addItem(user.id, cartItemData);
      showSuccess(`${item.name} added to cart!`);
      navigate('/cart');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const getAvailableWeights = () => {
    if (!isWeightBased() || !item.pricePerKg) return [];
    try {
      const prices = JSON.parse(item.pricePerKg);
      return Object.keys(prices).map(parseFloat).sort((a, b) => a - b);
    } catch (e) { return [1]; }
  };

  // Review handlers
  const handleOpenReviewDialog = () => { if (!user) navigate('/login'); else setOpenReviewDialog(true); };
  const handleCloseReviewDialog = () => { setOpenReviewDialog(false); setReviewData({ rating: 5, comment: '' }); };
  const handleSubmitReview = async () => {
    if (!user) return navigate('/login');
    if (!reviewData.comment.trim()) return showError('Please write a comment');
    try {
      await reviewAPI.create(item.id, user.id, reviewData);
      showSuccess('Review submitted!');
      handleCloseReviewDialog();
      fetchItemDetails();
    } catch (e) { showError('Failed to submit review'); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) return <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress style={{ color: '#e91e63' }} /></Box>;
  if (!item) return <Box sx={{ p: 5, textAlign: 'center' }}>Item not found</Box>;

  return (
    <>
      <Box sx={{ minHeight: '100vh', pt: { xs: '80px', md: '100px' }, pb: 6, background: '#fff' }}>
        <Container maxWidth="lg">
          {/* Contextual Nav */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} size="small" sx={{ color: '#666' }}>
              Back
            </Button>
          </Box>

          <Grid container spacing={4}>
            {/* Left Column: Product Image */}
            <Grid item xs={12} md={5}>
              <Box sx={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}>
                {/* Overlay Actions */}
                <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 10 }}>
                  <IconButton size="small" sx={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', '&:hover': { background: '#f5f5f5' } }}>
                    <FavoriteBorder fontSize="small" />
                  </IconButton>
                </Box>
                <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}>
                  <IconButton size="small" sx={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', '&:hover': { background: '#f5f5f5' } }}>
                    <Share fontSize="small" />
                  </IconButton>
                </Box>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={item.imageUrl}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <Box
                      component="img"
                      src={item.imageUrl}
                      alt={item.name}
                      sx={{
                        width: '100%',
                        height: { xs: '250px', md: '380px' },
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                  </motion.div>
                </AnimatePresence>
              </Box>
            </Grid>

            {/* Right Column: Details */}
            <Grid item xs={12} md={7}>
              <Box sx={{ pl: { md: 3 } }}>
                {/* Category */}
                <Typography variant="overline" sx={{ color: '#e91e63', fontWeight: 700, letterSpacing: '1px', lineHeight: 1, display: 'block', mb: 0.5 }}>
                  {item.category?.name || 'Bakery'}
                </Typography>

                {/* Title */}
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a1a1a', mb: 1, fontSize: { xs: '1.5rem', md: '2rem' }, lineHeight: 1.1 }}>
                  {item.name}
                </Typography>

                {/* Rating */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Star sx={{ color: '#ffc107', mr: 0.5, fontSize: '1.1rem' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mr: 1 }}>
                    {reviews.length > 0 ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1) : 'New'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ({reviews.length} reviews)
                  </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Description */}
                <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2, lineHeight: 1.5, fontSize: '0.9rem' }}>
                  {item.description || 'Crafted with premium ingredients and baked fresh daily to perfection.'}
                </Typography>

                {/* Professional Stock Indicator */}
                <Box sx={{ mb: 3 }}>
                  {item.stock === 0 ? (
                    <Typography variant="body2" sx={{ color: '#d32f2f', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#d32f2f' }} />
                      Out of Stock
                    </Typography>
                  ) : item.stock < 10 ? (
                    <Typography variant="body2" sx={{
                      color: '#ed6c02',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      background: alpha('#ed6c02', 0.08),
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '6px'
                    }}>
                      <motion.span
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        style={{ width: 8, height: 8, borderRadius: '50%', background: '#ed6c02', display: 'inline-block' }}
                      />
                      Hurry! Only {item.stock} left in stock
                    </Typography>
                  ) : (
                    <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#2e7d32' }} />
                      {item.stock} units available
                    </Typography>
                  )}
                </Box>

                {/* Weight Selection */}
                {isWeightBased() && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: '#1a1a1a' }}>Weight</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {getAvailableWeights().map(w => (
                        <Button
                          key={w}
                          variant="outlined"
                          onClick={() => setQuantity(w)}
                          size="small"
                          sx={{
                            borderColor: quantity === w ? '#e91e63' : '#e0e0e0',
                            background: quantity === w ? '#e91e63' : 'transparent',
                            color: quantity === w ? '#fff' : '#666',
                            minWidth: '60px',
                            py: 0.5,
                            borderRadius: '6px',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            '&:hover': {
                              borderColor: '#e91e63',
                              background: quantity === w ? '#d81b60' : 'rgba(233, 30, 99, 0.04)'
                            }
                          }}
                        >
                          {w < 1 ? `${w * 1000}g` : `${w}kg`}
                        </Button>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Egg Preference */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: '#1a1a1a' }}>Preference</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      onClick={() => setIsEggless(false)}
                      size="small"
                      sx={{
                        border: `1px solid ${!isEggless ? '#e91e63' : '#e0e0e0'}`,
                        color: !isEggless ? '#e91e63' : '#666',
                        px: 1.5, py: 0.5, borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem'
                      }}
                    >
                      Contains Egg
                    </Button>
                    <Button
                      onClick={() => setIsEggless(true)}
                      size="small"
                      sx={{
                        border: `1px solid ${isEggless ? '#2e7d32' : '#e0e0e0'}`,
                        color: isEggless ? '#2e7d32' : '#666',
                        px: 1.5, py: 0.5, borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem'
                      }}
                    >
                      Eggless (+{formatCurrency(30)})
                    </Button>
                  </Box>
                </Box>

                {!isWeightBased() && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: '#1a1a1a' }}>Quantity</Typography>
                    <QuantitySelector
                      value={quantity}
                      onIncrement={() => setQuantity(quantity + 1)}
                      onDecrement={() => setQuantity(Math.max(1, quantity - 1))}
                      max={item.stock || 10}
                    />
                  </Box>
                )}

                {/* Price & Action Row */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, mb: 3 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Total Price</Typography>
                    <PriceDisplay
                      amount={getSubtotal()}
                      fontSize="2.2rem"
                      color="primary.main"
                    />
                  </Box>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<ShoppingCart />}
                      onClick={handleAddToCart}
                      disabled={item.stock === 0}
                      sx={{
                        background: '#e91e63',
                        color: '#fff',
                        px: 4,
                        py: 1.2,
                        borderRadius: '50px',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        boxShadow: '0 8px 24px rgba(233, 30, 99, 0.25)',
                        '&:hover': {
                          background: '#d81b60',
                          boxShadow: '0 12px 32px rgba(233, 30, 99, 0.35)',
                        }
                      }}
                    >
                      {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </motion.div>
                </Box>

                {/* Info Alert Box */}
                <Box sx={{ background: '#FFF0F5', p: 1.5, borderRadius: '8px' }}>
                  <Grid container spacing={1}>
                    <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Check sx={{ color: '#e91e63', mr: 1, fontSize: '0.9rem' }} />
                      <Typography variant="caption" sx={{ fontWeight: 500 }}>Fresh daily</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Check sx={{ color: '#e91e63', mr: 1, fontSize: '0.9rem' }} />
                      <Typography variant="caption" sx={{ fontWeight: 500 }}>Premium ingredients</Typography>
                    </Grid>
                  </Grid>
                </Box>

                {/* Compact Meta Data */}
                <Box sx={{ mt: 2, display: 'flex', gap: 2, color: '#999', fontSize: '0.75rem' }}>
                  <span style={{ color: '#666' }}>Wt: {isWeightBased() ? (quantity < 1 ? quantity * 1000 + 'g' : quantity + 'kg') : item.grams + 'g'}</span>
                  •
                  <span style={{ color: '#666' }}>{item.pieces || 1} pcs</span>
                </Box>

              </Box>
            </Grid>

          </Grid>

          {/* Bottom Section: Similar Products & Reviews */}
          <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid #eee' }}>
            <Grid container spacing={4}>
              {/* Left: Similar Products */}
              <Grid item xs={12} md={6}>
                {similarProducts.length > 0 && (
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>More Products</Typography>
                    <Box sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                      gap: 2
                    }}>
                      {similarProducts.slice(0, 4).map((product, index) => (
                        <ProductCard
                          key={product.id}
                          item={product}
                          ratingData={{ averageRating: product.averageRating || 0, reviewCount: product.reviewCount || 0 }}
                          index={index}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Grid>

              {/* Right: Reviews */}
              <Grid item xs={12} md={6}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Reviews ({reviews.length})</Typography>
                    <Button variant="outlined" size="small" onClick={handleOpenReviewDialog} sx={{ color: '#e91e63', borderColor: '#e91e63', '&:hover': { borderColor: '#d81b60', background: 'rgba(233, 30, 99, 0.04)' } }}>
                      Write a Review
                    </Button>
                  </Box>
                  {reviews.slice(0, 4).map(r => (
                    <Paper key={r.id} elevation={0} sx={{ p: 2, mt: 2, borderRadius: '8px', bgcolor: '#f9f9f9' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mr: 1 }}>{r.customerName}</Typography>
                        <Rating value={r.rating} readOnly size="small" sx={{ fontSize: '0.9rem' }} />
                      </Box>
                      <Typography variant="body2" color="text.secondary">{r.comment}</Typography>
                    </Paper>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>

        </Container>
      </Box >

      {/* Review Dialog */}
      < Dialog open={openReviewDialog} onClose={handleCloseReviewDialog} maxWidth="sm" fullWidth >
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Rating value={reviewData.rating} onChange={(e, v) => setReviewData({ ...reviewData, rating: v })} size="large" sx={{ mb: 2 }} />
            <TextField
              fullWidth multiline rows={4}
              label="Your Experience"
              value={reviewData.comment}
              onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewDialog}>Cancel</Button>
          <Button onClick={handleSubmitReview} variant="contained" sx={{ bgcolor: '#e91e63' }}>Submit</Button>
        </DialogActions>
      </Dialog >
    </>
  );
};

export default ItemDetail;
