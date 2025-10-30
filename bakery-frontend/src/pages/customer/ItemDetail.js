import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Chip,
  Rating,
  TextField,
  Divider,
  Avatar,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  ShoppingCart,
  ArrowBack,
  Star,
  Person,
  Cake,
} from '@mui/icons-material';
import { itemAPI, cartAPI, reviewAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import CustomerHeader from '../../components/CustomerHeader';
import { showSuccess, showError } from '../../utils/toast';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isEggless, setIsEggless] = useState(false);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  // Helper function to check if item is weight-based
  const isWeightBased = () => {
    const catName = item?.category?.name?.toLowerCase() || '';
    return catName.includes('occasional') || catName.includes('premium') || catName.includes('party');
  };

  useEffect(() => {
    // Set initial quantity to 1 for weight-based items (representing 1 Kg)
    if (item && isWeightBased()) {
      setQuantity(1);
      console.log('Weight-based item loaded, setting initial weight to 1 Kg');
    }
  }, [item]);

  const fetchItemDetails = async () => {
    try {
      const [itemResponse, reviewResponse] = await Promise.all([
        itemAPI.getById(id),
        reviewAPI.getByItem(id),
      ]);

      if (itemResponse.data.success) {
        setItem(itemResponse.data.data);
      }
      if (reviewResponse.data.success) {
        setReviews(reviewResponse.data.data);
      }
    } catch (err) {
      showError('Failed to fetch item details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const cartItemData = {
        itemId: item.id,
        quantity: 1,  // Always 1 for cakes (weight determines the actual amount)
        eggType: isEggless ? 'EGGLESS' : null,
      };
      
      // For weight-based items, add selected weight and calculated price
      if (isWeightBased()) {
        cartItemData.selectedWeight = quantity;  // quantity is actually the weight for cakes
        cartItemData.priceAtAddition = getCurrentPrice();
      } else {
        cartItemData.quantity = quantity;  // For non-cakes, use actual quantity
      }
      
      await cartAPI.addItem(user.id, cartItemData);
      showSuccess(`${item.name} added to cart!`);
      navigate('/cart');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const getCurrentPrice = () => {
    // Check if it's a weight-based item
    if (isWeightBased() && item.pricePerKg) {
      try {
        console.log('=== PRICE CALCULATION DEBUG ===');
        console.log('Item pricePerKg (raw):', item.pricePerKg);
        console.log('Selected quantity (weight):', quantity, 'Type:', typeof quantity);
        
        const priceData = JSON.parse(item.pricePerKg);
        console.log('Parsed priceData:', priceData);
        console.log('Available keys:', Object.keys(priceData));
        
        // Try multiple key formats
        const key1 = quantity.toString();
        const key2 = parseFloat(quantity).toString();
        const key3 = quantity;
        
        console.log('Trying keys:', key1, key2, key3);
        console.log('priceData[key1]:', priceData[key1]);
        console.log('priceData[key2]:', priceData[key2]);
        console.log('priceData[key3]:', priceData[key3]);
        
        let basePrice = parseFloat(priceData[key1]) || parseFloat(priceData[key2]) || parseFloat(priceData[key3]) || 0;
        
        // If still 0, try to find any matching value
        if (basePrice === 0) {
          console.log('No direct match, searching all keys...');
          for (let key in priceData) {
            console.log(`Checking key "${key}" (type: ${typeof key}) against quantity ${quantity}`);
            if (parseFloat(key) === parseFloat(quantity)) {
              basePrice = parseFloat(priceData[key]);
              console.log('Found match! Price:', basePrice);
              break;
            }
          }
        }
        
        console.log('Base price found:', basePrice);
        const finalPrice = isEggless ? basePrice + 30 : basePrice;
        console.log('Final price (with eggless):', finalPrice);
        console.log('=== END DEBUG ===');
        return finalPrice;
      } catch (e) {
        console.error('Error parsing pricePerKg:', e);
        return isEggless ? item.price + 30 : item.price;
      }
    }
    // For non-cake items, use regular price
    return isEggless ? item.price + 30 : item.price;
  };

  const getCurrentStock = () => {
    return isEggless ? (item.egglessStock || 0) : (item.stock || 0);
  };

  const handleOpenReviewDialog = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setOpenReviewDialog(true);
  };

  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
    setReviewData({ rating: 5, comment: '' });
  };

  const handleSubmitReview = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (reviewData.comment.trim() === '') {
      showError('Please write a comment');
      return;
    }

    try {
      await reviewAPI.create(item.id, user.id, reviewData);
      showSuccess('Review submitted successfully!');
      handleCloseReviewDialog();
      fetchItemDetails(); // Refresh reviews
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <>
        <CustomerHeader />
        <Box sx={{ minHeight: '100vh', background: '#f5f5f5', paddingTop: { xs: '70px', md: '100px' }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress style={{ color: '#ff69b4' }} />
        </Box>
      </>
    );
  }

  if (!item) {
    return (
      <>
        <CustomerHeader />
        <Box sx={{ minHeight: '100vh', background: '#f5f5f5', paddingTop: { xs: '60px', md: '100px' }, paddingBottom: { xs: '20px', md: '40px' } }}>
          <Container maxWidth="lg">
            <Paper style={{ padding: '60px', textAlign: 'center', borderRadius: '12px' }}>
              <Typography variant="h6" color="textSecondary">
                Item not found
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/shop')}
                style={{ marginTop: '20px', background: '#e91e63', color: '#fff' }}
              >
                Back to Shop
              </Button>
            </Paper>
          </Container>
        </Box>
      </>
    );
  }

  return (
    <>
      <CustomerHeader />

      <Box sx={{ minHeight: '100vh', background: '#f5f5f5', paddingTop: { xs: '60px', sm: '70px' }, paddingBottom: { xs: '3px', md: '12px' } }}>
        <Container maxWidth="lg" sx={{ paddingLeft: { xs: '1.5px', sm: '16px', md: '12px' }, paddingRight: { xs: '1.5px', sm: '16px', md: '12px' } }}>
          {/* Back Button */}
          <Box sx={{ marginBottom: { xs: '2.5px', md: '10px' } }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{ 
                color: '#666', 
                textTransform: 'none',
                padding: { xs: '1px 2.5px', md: '3px 6px' },
                fontSize: { xs: '0.58rem', md: '0.75rem' },
                '&:hover': {
                  background: 'rgba(0,0,0,0.04)',
                },
                '& .MuiButton-startIcon': {
                  marginRight: { xs: '4px', md: '8px' },
                }
              }}
            >
              Back
            </Button>
          </Box>

          {/* Item Details Section */}
          <Paper sx={{ padding: { xs: '3.5px', md: '10px' }, borderRadius: '0', marginBottom: { xs: '3.5px', md: '10px' } }}>
            <Grid container spacing={{ xs: 0.35, md: 1.2 }}>
              {/* Item Image */}
              <Grid item xs={12} md={5}>
                {item.imageUrl ? (
                  <Box
                    component="img"
                    src={item.imageUrl}
                    alt={item.name}
                    sx={{
                      width: '100%',
                      height: { xs: '140px', sm: '250px', md: '350px' },
                      objectFit: 'cover',
                      borderRadius: '0',
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <Box
                  sx={{
                    width: '100%',
                    height: { xs: '140px', sm: '250px', md: '350px' },
                    background: 'linear-gradient(135deg, #fef6ee 0%, #fdecd7 100%)',
                    display: item.imageUrl ? 'none' : 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '0',
                  }}
                >
                  <Cake sx={{ fontSize: { xs: 35, sm: 80, md: 100 }, color: '#ff69b4', opacity: 0.8 }} />
                </Box>
              </Grid>

              {/* Item Info */}
              <Grid item xs={12} md={7}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, marginBottom: { xs: '1.2px', md: '5px' }, fontSize: { xs: '0.82rem', sm: '1.3rem', md: '1.2rem' }, lineHeight: 1.1 }}>
                    {item.name}
                  </Typography>

                  {/* Rating */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: '0.8px', md: '3px' }, marginBottom: { xs: '2.5px', md: '6px' } }}>
                    <Rating value={parseFloat(getAverageRating())} precision={0.1} readOnly size="small" sx={{ fontSize: { xs: '0.72rem', md: '1.2rem' } }} />
                    <Typography variant="body1" color="textSecondary" sx={{ fontSize: { xs: '0.58rem', md: '0.85rem' } }}>
                      {getAverageRating()} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                    </Typography>
                  </Box>

                  {/* Category and Status */}
                  <Box sx={{ display: 'flex', gap: { xs: '0.8px', md: '3px' }, marginBottom: { xs: '2.5px', md: '8px' }, flexWrap: 'wrap' }}>
                    <Chip 
                      label={item.category?.name} 
                      sx={{ background: '#e91e63', color: '#fff', fontWeight: 600, borderRadius: '0', fontSize: { xs: '0.53rem', md: '0.7rem' }, height: { xs: '15px', md: '26px' }, padding: { xs: '0 2px', md: '0 8px' } }}
                    />
                    {item.stock === 0 ? (
                      <Chip 
                        label="Out of Stock" 
                        sx={{ background: '#f44336', color: '#fff', fontWeight: 600, borderRadius: '0', fontSize: { xs: '0.53rem', md: '0.7rem' }, height: { xs: '15px', md: '26px' }, padding: { xs: '0 2px', md: '0 8px' } }}
                      />
                    ) : item.stock <= 10 ? (
                      <Chip 
                        label={`Only ${item.stock} left`} 
                        sx={{ background: '#ff9800', color: '#fff', fontWeight: 600, borderRadius: '0', fontSize: { xs: '0.53rem', md: '0.7rem' }, height: { xs: '15px', md: '26px' }, padding: { xs: '0 2px', md: '0 8px' } }}
                      />
                    ) : (
                      <Chip 
                        label="In Stock" 
                        sx={{ background: '#4caf50', color: '#fff', fontWeight: 600, borderRadius: '0', fontSize: { xs: '0.53rem', md: '0.7rem' }, height: { xs: '15px', md: '26px' }, padding: { xs: '0 2px', md: '0 8px' } }}
                      />
                    )}
                    {item.featured && (
                      <Chip 
                        label="Featured" 
                        icon={<Star />}
                        sx={{ background: '#ffc107', color: '#fff', fontWeight: 600, borderRadius: '0', fontSize: { xs: '0.53rem', md: '0.7rem' }, height: { xs: '15px', md: '26px' }, padding: { xs: '0 2px', md: '0 8px' } }}
                      />
                    )}
                  </Box>

                  {/* Price */}
                  <Typography variant="h5" sx={{ color: '#000000', fontWeight: 700, marginBottom: { xs: '2.5px', md: '6px' }, fontSize: { xs: '0.92rem', sm: '1.35rem', md: '1.2rem' } }}>
                    ₹{getCurrentPrice()?.toFixed(2)}
                  </Typography>

                  {/* Egg or Eggless Option - For All Products */}
                  <Box sx={{ marginBottom: { xs: '3.5px', md: '8px' } }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, marginBottom: { xs: '0.8px', md: '4px' }, fontSize: { xs: '0.63rem', md: '0.8rem' } }}>
                      Egg or Eggless
                    </Typography>
                    <Box sx={{ display: 'flex', gap: { xs: '2.2px', md: '5px' }, flexWrap: 'wrap' }}>
                      <Button
                        variant={!isEggless ? 'contained' : 'outlined'}
                        onClick={() => setIsEggless(false)}
                        sx={{
                          background: !isEggless ? '#ffd700' : 'transparent',
                          color: !isEggless ? '#000' : '#666',
                          border: '2px solid',
                          borderColor: !isEggless ? '#ffd700' : '#ddd',
                          borderRadius: '0',
                          padding: { xs: '4px 12px', md: '6px 16px' },
                          fontSize: { xs: '0.75rem', md: '0.875rem' },
                          textTransform: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            background: !isEggless ? '#ffd700' : '#f5f5f5',
                            borderColor: '#ffd700',
                          }
                        }}
                      >
                        Egg
                      </Button>
                      <Button
                        variant={isEggless ? 'contained' : 'outlined'}
                        onClick={() => setIsEggless(true)}
                        disabled={item.egglessStock === 0}
                        sx={{
                          background: isEggless ? '#ffd700' : 'transparent',
                          color: isEggless ? '#000' : '#666',
                          border: '2px solid',
                          borderColor: isEggless ? '#ffd700' : '#ddd',
                          borderRadius: '0',
                          padding: { xs: '4px 12px', md: '6px 16px' },
                          fontSize: { xs: '0.75rem', md: '0.875rem' },
                          textTransform: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            background: isEggless ? '#ffd700' : '#f5f5f5',
                            borderColor: '#ffd700',
                          }
                        }}
                      >
                        Eggless
                      </Button>
                    </Box>
                  </Box>

                  {/* Weight Selection - Only for weight-based categories */}
                  {(() => {
                    const catName = item.category?.name?.toLowerCase() || '';
                    return catName.includes('occasional') || catName.includes('premium') || catName.includes('party');
                  })() && (
                    <Box sx={{ marginBottom: { xs: '3.5px', md: '8px' } }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, marginBottom: { xs: '0.8px', md: '4px' }, fontSize: { xs: '0.63rem', md: '0.8rem' } }}>
                        Weight
                      </Typography>
                      <Box sx={{ display: 'flex', gap: { xs: '1.8px', md: '5px' }, flexWrap: 'wrap' }}>
                        {['1 Kg', '1.5 Kg', '2 Kg', '2.5 Kg', '3 Kg'].map((qty) => (
                          <Button
                            key={qty}
                            variant={quantity === parseFloat(qty) ? 'contained' : 'outlined'}
                            onClick={() => setQuantity(parseFloat(qty))}
                            sx={{
                              background: quantity === parseFloat(qty) ? '#ffd700' : 'transparent',
                              color: quantity === parseFloat(qty) ? '#000' : '#666',
                              border: '2px solid',
                              borderColor: quantity === parseFloat(qty) ? '#ffd700' : '#ddd',
                              borderRadius: '0',
                              padding: { xs: '0.5px 1px', md: '4px 10px' },
                              fontSize: { xs: '0.4rem', md: '0.75rem' },
                              textTransform: 'none',
                              fontWeight: 600,
                              '&:hover': {
                                background: quantity === parseFloat(qty) ? '#ffd700' : '#f5f5f5',
                                borderColor: '#ffd700',
                              }
                            }}
                          >
                            {qty}
                          </Button>
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* Description */}
                  <Typography variant="body2" color="textSecondary" paragraph sx={{ marginBottom: { xs: '3.5px', md: '8px' }, fontSize: { xs: '0.63rem', md: '0.75rem' }, lineHeight: '1.22' }}>
                    {item.description || 'Delicious baked item made with the finest ingredients.'}
                  </Typography>

                  {/* Product Details */}
                  <Box sx={{ marginBottom: { xs: '3.5px', md: '8px' } }}>
                    <Typography variant="body2" sx={{ marginBottom: { xs: '0.8px', md: '4px' }, fontSize: { xs: '0.63rem', md: '0.75rem' } }}>
                      <strong>Weight:</strong> {item.grams}g
                    </Typography>
                    <Typography variant="body2" sx={{ marginBottom: { xs: '2px', md: '6px' }, fontSize: { xs: '0.7rem', md: '0.875rem' } }}>
                      <strong>Pieces:</strong> {item.pieces || 1} piece{(item.pieces || 1) > 1 ? 's' : ''}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.63rem', md: '0.75rem' } }}>
                      <strong>Availability:</strong> {item.available ? 'Available' : 'Not Available'}
                    </Typography>
                  </Box>

                  {/* Quantity Selector - Only for non-weight-based items */}
                  {!isWeightBased() && (
                    <Box sx={{ marginBottom: { xs: '3.5px', md: '8px' } }}>
                      <Typography variant="body1" sx={{ fontWeight: 600, fontSize: { xs: '0.63rem', md: '0.85rem' }, marginBottom: { xs: '4px', md: '6px' } }}>
                        Quantity:
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: '4px', md: '8px' } }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                          sx={{
                            minWidth: { xs: '26px', md: '40px' },
                            height: { xs: '26px', md: '36px' },
                            padding: { xs: '2px', md: '6px' },
                            borderColor: '#e91e63',
                            color: '#e91e63',
                            fontSize: { xs: '0.875rem', md: '1rem' },
                            '&:hover': { borderColor: '#e91e63', background: 'rgba(233, 30, 99, 0.04)' },
                            '&.Mui-disabled': { borderColor: '#ddd', color: '#ddd' },
                          }}
                        >
                          -
                        </Button>
                        <TextField
                          type="number"
                          value={quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value) && value >= 1) {
                              setQuantity(Math.min(getCurrentStock() || 1, value));
                            }
                          }}
                          InputProps={{ 
                            inputProps: { min: 1, max: getCurrentStock() || 1 },
                          }}
                          size="small"
                          sx={{ 
                            width: { xs: '45px', md: '70px' },
                            '& input': {
                              fontSize: { xs: '0.7rem', md: '0.875rem' },
                              padding: { xs: '4px 2px', md: '8.5px 14px' },
                              textAlign: 'center',
                            },
                            '& input[type=number]': {
                              MozAppearance: 'textfield',
                            },
                            '& input[type=number]::-webkit-outer-spin-button': {
                              WebkitAppearance: 'none',
                              margin: 0,
                            },
                            '& input[type=number]::-webkit-inner-spin-button': {
                              WebkitAppearance: 'none',
                              margin: 0,
                            },
                          }}
                        />
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => setQuantity(Math.min(getCurrentStock() || 1, quantity + 1))}
                          disabled={quantity >= (getCurrentStock() || 1)}
                          sx={{
                            minWidth: { xs: '26px', md: '40px' },
                            height: { xs: '26px', md: '36px' },
                            padding: { xs: '2px', md: '6px' },
                            borderColor: '#e91e63',
                            color: '#e91e63',
                            fontSize: { xs: '0.875rem', md: '1rem' },
                            '&:hover': { borderColor: '#e91e63', background: 'rgba(233, 30, 99, 0.04)' },
                            '&.Mui-disabled': { borderColor: '#ddd', color: '#ddd' },
                          }}
                        >
                          +
                        </Button>
                      </Box>
                    </Box>
                  )}

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: { xs: '2.2px', md: '8px' } }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<ShoppingCart />}
                      onClick={handleAddToCart}
                      disabled={getCurrentStock() === 0 || !item.available}
                      sx={{
                        background: getCurrentStock() === 0 || !item.available ? '#ccc' : '#e91e63',
                        color: '#fff',
                        padding: { xs: '2.2px 5.5px', md: '5px 16px' },
                        fontSize: { xs: '0.63rem', md: '0.75rem' },
                        borderRadius: '0',
                        fontWeight: 600,
                        textTransform: 'none',
                        flex: 1,
                        '& .MuiButton-startIcon': {
                          marginRight: { xs: '4px', md: '8px' },
                        }
                      }}
                    >
                      {!user ? 'Login to Purchase' : getCurrentStock() === 0 || !item.available ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </Box>
                  
                  {!user && (
                    <Box sx={{ marginTop: { xs: '2.5px', md: '6px' }, padding: { xs: '2.5px', md: '6px' }, background: '#fff3e0', borderRadius: '0', textAlign: 'center' }}>
                      <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.58rem', md: '0.75rem' } }}>
                        Please login to add items to cart and make purchases
                      </Typography>
                    </Box>
                  )}

                  {/* Total Price */}
                  <Box sx={{ marginTop: { xs: '3.5px', md: '8px' }, padding: { xs: '2.5px', md: '6px' }, background: '#fef6ee', borderRadius: '0' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '0.76rem', md: '1.1rem' } }}>
                      Total: ₹{
                        isWeightBased() 
                          ? getCurrentPrice().toFixed(2)  // For cakes, price already includes weight
                          : (getCurrentPrice() * quantity).toFixed(2)  // For other items, multiply by quantity
                      }
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Reviews Section */}
          <Paper sx={{ padding: { xs: '3.5px', md: '10px' }, borderRadius: '0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: { xs: '3.5px', md: '8px' }, flexWrap: 'wrap', gap: { xs: '1.8px', md: '5px' } }}>
              <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: '0.82rem', sm: '1.3rem', md: '1.2rem' } }}>
                Customer Reviews ({reviews.length})
              </Typography>
              <Button
                variant="contained"
                onClick={handleOpenReviewDialog}
                sx={{
                  background: '#e91e63',
                  color: '#fff',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: { xs: '0.58rem', md: '0.75rem' },
                  padding: { xs: '2.2px 4.5px', md: '4px 10px' },
                }}
              >
                {user ? 'Write a Review' : 'Login to Review'}
              </Button>
            </Box>
            
            {!user && (
              <Box sx={{ padding: { xs: '2.5px', md: '6px' }, background: '#fff3e0', borderRadius: '0', marginBottom: { xs: '3.5px', md: '10px' } }}>
                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', fontSize: { xs: '0.58rem', md: '0.75rem' } }}>
                  Please login to write a review for this product
                </Typography>
              </Box>
            )}

            <Divider sx={{ marginBottom: { xs: '3.5px', md: '8px' } }} />

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <Box sx={{ textAlign: 'center', padding: { xs: '7px', md: '28px' } }}>
                <Typography variant="body1" color="textSecondary" sx={{ fontSize: { xs: '0.66rem', md: '0.85rem' } }}>
                  No reviews yet. Be the first to review this item!
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={{ xs: 0.5, md: 1.5 }}>
                {reviews.map((review) => (
                  <Grid item xs={12} key={review.id}>
                    <Card sx={{ borderRadius: { xs: '0', md: '5px' } }} elevation={1}>
                      <CardContent sx={{ padding: { xs: '3.5px', md: '10px' } }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: { xs: '3.5px', md: '10px' } }}>
                          <Avatar sx={{ background: '#e91e63', width: { xs: 22, md: 38 }, height: { xs: 22, md: 38 }, fontSize: { xs: '9.5px', md: '16px' }, fontWeight: 600 }}>
                            {review.customerName ? review.customerName.charAt(0).toUpperCase() : 'C'}
                          </Avatar>
                          <Box style={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: { xs: '1.8px', md: '5px' } }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: { xs: '0.66rem', md: '0.85rem' } }}>
                                {review.customerName || 'Customer'}
                              </Typography>
                              <Typography variant="caption" color="textSecondary" sx={{ fontSize: { xs: '0.53rem', md: '0.65rem' } }}>
                                {formatDate(review.reviewDate)}
                              </Typography>
                            </Box>
                            <Rating value={review.rating} readOnly size="small" sx={{ marginBottom: { xs: '1.8px', md: '5px' }, fontSize: { xs: '0.68rem', md: '1rem' } }} />
                            <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.63rem', md: '0.75rem' } }}>
                              {review.comment}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Container>
      </Box>

      {/* Review Dialog */}
      <Dialog open={openReviewDialog} onClose={handleCloseReviewDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Box style={{ paddingTop: '8px' }}>
            <Typography variant="body1" style={{ marginBottom: '12px', fontWeight: 600 }}>
              Rating
            </Typography>
            <Rating
              value={reviewData.rating}
              onChange={(event, newValue) => {
                setReviewData({ ...reviewData, rating: newValue });
              }}
              size="large"
              style={{ marginBottom: '24px' }}
            />
            <TextField
              label="Your Review"
              multiline
              rows={4}
              fullWidth
              value={reviewData.comment}
              onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
              placeholder="Share your experience with this item..."
              required
            />
          </Box>
        </DialogContent>
        <DialogActions style={{ padding: '16px 24px' }}>
          <Button onClick={handleCloseReviewDialog} style={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitReview}
            variant="contained"
            style={{ background: '#e91e63', color: '#fff', textTransform: 'none' }}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ItemDetail;
