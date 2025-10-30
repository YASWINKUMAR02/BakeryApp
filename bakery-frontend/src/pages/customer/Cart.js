import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  AppBar,
  Toolbar,
  CircularProgress,
  Alert,
  IconButton,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Card,
  CardContent,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Delete,
  ShoppingCart,
  Cake,
  ArrowBack,
} from '@mui/icons-material';
import { cartAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import CustomerHeader from '../../components/CustomerHeader';
import Footer from '../../components/Footer';
import { showSuccess, showError } from '../../utils/toast';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchCart = useCallback(async () => {
    try {
      console.log('Fetching cart for user:', user.id);
      const response = await cartAPI.get(user.id);
      console.log('Cart response:', response.data);
      if (response.data.success) {
        setCart(response.data.data);
        console.log('Cart updated with items:', response.data.data.items?.length || 0);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      showError('Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await cartAPI.updateItem(cartItemId, newQuantity);
      fetchCart();
      showSuccess('Quantity updated!');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update quantity');
    }
  };

  const handleOpenDeleteDialog = (cartItemId) => {
    setItemToDelete(cartItemId);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleRemoveItem = async () => {
    if (!itemToDelete) return;
    
    console.log('Attempting to remove cart item with ID:', itemToDelete);
    
    try {
      const response = await cartAPI.removeItem(itemToDelete);
      console.log('Remove item response:', response);
      
      if (response.data.success) {
        // Immediately update the cart state by filtering out the removed item
        setCart(prevCart => ({
          ...prevCart,
          items: prevCart.items.filter(item => item.id !== itemToDelete)
        }));
        
        showSuccess('Item removed from cart!');
        
        // Fetch fresh cart data from server
        await fetchCart();
      } else {
        showError('Failed to remove item from cart');
      }
    } catch (err) {
      console.error('Remove item error:', err);
      console.error('Error response:', err.response);
      const errorMessage = err.response?.data?.message || 'Failed to remove item from cart';
      showError(errorMessage);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  const handleProceedToCheckout = () => {
    if (!cart?.items || cart.items.length === 0) {
      showError('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  const getItemPrice = (cartItem) => {
    // Use stored price if available (for cakes with weight pricing)
    if (cartItem.priceAtAddition && cartItem.priceAtAddition > 0) {
      return cartItem.priceAtAddition;
    }
    
    // For regular items, calculate price
    if (cartItem.eggType === 'EGGLESS') {
      return cartItem.item.price + 30; // Add ₹30 for eggless
    }
    return cartItem.item.price;
  };

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, cartItem) => total + (getItemPrice(cartItem) * cartItem.quantity), 0);
  };

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CustomerHeader />

      <Box sx={{ flex: 1, background: '#f5f5f5', paddingTop: { xs: '80px', md: '100px' }, paddingBottom: { xs: '20px', md: '40px' }, paddingLeft: { xs: '4px', md: '8px' }, paddingRight: { xs: '4px', md: '8px' } }}>
        <Container maxWidth="lg">
          <Paper sx={{ padding: { xs: '12px', md: '20px' }, borderRadius: '0', marginBottom: { xs: '12px', md: '20px' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: { xs: '12px', md: '20px' }, flexWrap: 'wrap', gap: { xs: '8px', md: '0' } }}>
              <Typography variant="h5" sx={{ fontWeight: 600, fontSize: { xs: '1rem', md: '1.5rem' } }}>
                Your Cart
              </Typography>
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => navigate('/')}
                sx={{
                  borderColor: '#e91e63',
                  color: '#e91e63',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '0',
                  fontSize: { xs: '0.75rem', md: '0.875rem' },
                  padding: { xs: '4px 8px', md: '6px 16px' },
                }}
              >
                Back to Home
              </Button>
            </Box>

            {loading ? (
              <Box sx={{ textAlign: 'center', padding: { xs: '30px 20px', md: '40px' } }}>
                <CircularProgress style={{ color: '#ff69b4' }} />
              </Box>
            ) : !cart?.items || cart.items.length === 0 ? (
              <Box sx={{ textAlign: 'center', padding: { xs: '40px 20px', md: '60px' } }}>
                <ShoppingCart sx={{ fontSize: { xs: 60, md: 80 }, color: '#ccc', marginBottom: { xs: '12px', md: '20px' } }} />
                <Typography variant="h6" color="textSecondary" gutterBottom sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                  Your cart is empty
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/shop')}
                  style={{ marginTop: '20px', background: '#e91e63', color: '#fff', textTransform: 'none', borderRadius: '0' }}
                >
                  Start Shopping
                </Button>
              </Box>
            ) : (
              <>
                {/* Mobile Card Layout */}
                {isMobile ? (
                  <Box>
                    {cart.items.map((cartItem) => (
                      <Card key={cartItem.id} sx={{ marginBottom: { xs: '12px', md: '16px' }, borderRadius: '0', border: '1px solid #e0e0e0' }}>
                        <CardContent sx={{ padding: { xs: '12px', md: '16px' } }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: { xs: '8px', md: '12px' } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: '6px', md: '8px' }, flex: 1 }}>
                              <Box>
                                <Typography variant="body1" sx={{ fontWeight: 600, fontSize: { xs: '0.85rem', md: '1rem' } }}>
                                  {cartItem.item.name}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: { xs: '4px', md: '6px' }, marginTop: { xs: '4px', md: '6px' }, flexWrap: 'wrap' }}>
                                  {cartItem.selectedWeight && (
                                    <Chip 
                                      label={`${cartItem.selectedWeight} Kg`}
                                      size="small"
                                      sx={{ 
                                        background: '#fff3e0',
                                        color: '#e65100',
                                        fontWeight: 600,
                                        fontSize: { xs: '0.6rem', md: '10px' },
                                        height: { xs: '18px', md: '20px' }
                                      }}
                                    />
                                  )}
                                  {cartItem.eggType === 'EGGLESS' && (
                                    <Chip 
                                      label='🌱 Eggless'
                                      size="small"
                                      sx={{ 
                                        background: '#e8f5e9',
                                        color: '#2e7d32',
                                        fontWeight: 600,
                                        fontSize: { xs: '0.6rem', md: '10px' },
                                        height: { xs: '18px', md: '20px' }
                                      }}
                                    />
                                  )}
                                </Box>
                              </Box>
                            </Box>
                            <IconButton 
                              color="error" 
                              size="small"
                              onClick={() => handleOpenDeleteDialog(cartItem.id)}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                          
                          <Divider sx={{ margin: { xs: '8px 0', md: '12px 0' } }} />
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: { xs: '6px', md: '8px' } }}>
                            <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                              Price:
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', md: '1rem' } }}>
                              ₹{getItemPrice(cartItem)?.toFixed(2)}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ marginBottom: { xs: '6px', md: '8px' } }}>
                            <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' }, marginBottom: { xs: '4px', md: '0' } }}>
                              Quantity:
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: '4px', md: '8px' }, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleUpdateQuantity(cartItem.id, Math.max(1, cartItem.quantity - 1))}
                                disabled={cartItem.quantity <= 1}
                                sx={{
                                  minWidth: { xs: '24px', md: '36px' },
                                  height: { xs: '24px', md: '34px' },
                                  padding: { xs: '2px', md: '5px' },
                                  borderColor: '#e91e63',
                                  color: '#e91e63',
                                  fontSize: { xs: '0.8rem', md: '1rem' },
                                  '&:hover': { borderColor: '#e91e63', background: 'rgba(233, 30, 99, 0.04)' },
                                  '&.Mui-disabled': { borderColor: '#ddd', color: '#ddd' },
                                }}
                              >
                                -
                              </Button>
                              <TextField
                                type="number"
                                value={cartItem.quantity}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  if (!isNaN(value) && value >= 1) {
                                    handleUpdateQuantity(cartItem.id, value);
                                  }
                                }}
                                InputProps={{ inputProps: { min: 1 } }}
                                size="small"
                                sx={{ 
                                  width: { xs: '40px', md: '65px' }, 
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
                                onClick={() => handleUpdateQuantity(cartItem.id, cartItem.quantity + 1)}
                                sx={{
                                  minWidth: { xs: '24px', md: '36px' },
                                  height: { xs: '24px', md: '34px' },
                                  padding: { xs: '2px', md: '5px' },
                                  borderColor: '#e91e63',
                                  color: '#e91e63',
                                  fontSize: { xs: '0.8rem', md: '1rem' },
                                  '&:hover': { borderColor: '#e91e63', background: 'rgba(233, 30, 99, 0.04)' },
                                }}
                              >
                                +
                              </Button>
                            </Box>
                          </Box>
                          
                          <Divider sx={{ margin: { xs: '8px 0', md: '12px 0' } }} />
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" sx={{ fontWeight: 700, fontSize: { xs: '0.8rem', md: '1rem' } }}>
                              Subtotal:
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#000000', fontSize: { xs: '0.9rem', md: '1.25rem' } }}>
                              ₹{(getItemPrice(cartItem) * cartItem.quantity).toFixed(2)}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  /* Desktop Table Layout */
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow style={{ background: '#fef6ee' }}>
                          <TableCell style={{ fontWeight: 600 }}>Item</TableCell>
                          <TableCell style={{ fontWeight: 600 }}>Price</TableCell>
                          <TableCell style={{ fontWeight: 600 }}>Quantity</TableCell>
                          <TableCell style={{ fontWeight: 600 }}>Subtotal</TableCell>
                          <TableCell align="right" style={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {cart.items.map((cartItem) => (
                          <TableRow key={cartItem.id} hover>
                            <TableCell>
                              <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Box>
                                  <Typography>{cartItem.item.name}</Typography>
                                  <Box style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                                    {cartItem.selectedWeight && (
                                      <Chip 
                                        label={`${cartItem.selectedWeight} Kg`}
                                        size="small"
                                        style={{ 
                                          background: '#fff3e0',
                                          color: '#e65100',
                                          fontWeight: 600,
                                          fontSize: '11px'
                                        }}
                                      />
                                    )}
                                    {cartItem.eggType === 'EGGLESS' && (
                                      <Chip 
                                        label='🌱 Eggless'
                                        size="small"
                                        style={{ 
                                          background: '#e8f5e9',
                                          color: '#2e7d32',
                                          fontWeight: 600,
                                          fontSize: '11px'
                                        }}
                                      />
                                    )}
                                  </Box>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>₹{getItemPrice(cartItem)?.toFixed(2)}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => handleUpdateQuantity(cartItem.id, Math.max(1, cartItem.quantity - 1))}
                                  disabled={cartItem.quantity <= 1}
                                  sx={{
                                    minWidth: '32px',
                                    height: '32px',
                                    padding: '4px',
                                    borderColor: '#e91e63',
                                    color: '#e91e63',
                                    fontSize: '0.875rem',
                                    '&:hover': { borderColor: '#e91e63', background: 'rgba(233, 30, 99, 0.04)' },
                                    '&.Mui-disabled': { borderColor: '#ddd', color: '#ddd' },
                                  }}
                                >
                                  -
                                </Button>
                                <TextField
                                  type="number"
                                  value={cartItem.quantity}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (!isNaN(value) && value >= 1) {
                                      handleUpdateQuantity(cartItem.id, value);
                                    }
                                  }}
                                  InputProps={{ inputProps: { min: 1 } }}
                                  size="small"
                                  sx={{ 
                                    width: '60px',
                                    '& input': {
                                      textAlign: 'center',
                                      fontSize: '0.875rem',
                                      padding: '6px 8px',
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
                                  onClick={() => handleUpdateQuantity(cartItem.id, cartItem.quantity + 1)}
                                  sx={{
                                    minWidth: '32px',
                                    height: '32px',
                                    padding: '4px',
                                    borderColor: '#e91e63',
                                    color: '#e91e63',
                                    fontSize: '0.875rem',
                                    '&:hover': { borderColor: '#e91e63', background: 'rgba(233, 30, 99, 0.04)' },
                                  }}
                                >
                                  +
                                </Button>
                              </Box>
                            </TableCell>
                            <TableCell style={{ fontWeight: 600, color: '#000000' }}>
                              ₹{(getItemPrice(cartItem) * cartItem.quantity).toFixed(2)}
                            </TableCell>
                            <TableCell align="right">
                              <IconButton color="error" onClick={() => handleOpenDeleteDialog(cartItem.id)}>
                                <Delete />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                <Box sx={{ marginTop: { xs: '20px', md: '30px' }, padding: { xs: '12px', md: '20px' }, background: '#fef6ee', borderRadius: '0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: '1rem', md: '1.5rem' } }}>
                      Total:
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#000000', fontSize: { xs: '1.2rem', md: '2.125rem' } }}>
                      ₹{calculateTotal().toFixed(2)}
                    </Typography>
                  </Box>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleProceedToCheckout}
                    sx={{
                      marginTop: { xs: '12px', md: '20px' },
                      background: '#e91e63',
                      color: '#fff',
                      padding: { xs: '10px', md: '12px' },
                      fontSize: { xs: '0.875rem', md: '16px' },
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: '0',
                    }}
                  >
                    Proceed to Checkout
                  </Button>
                </Box>
              </>
            )}
          </Paper>
        </Container>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          sx: {
            borderRadius: '0',
            padding: { xs: '4px', md: '8px' },
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: { xs: '1rem', md: '20px' }, padding: { xs: '12px', md: '16px' } }}>
          Remove Item from Cart?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: { xs: '0.875rem', md: '16px' }, color: '#666' }}>
            Are you sure you want to remove this item from your cart?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: { xs: '12px 16px', md: '16px 24px' } }}>
          <Button 
            onClick={handleCloseDeleteDialog}
            sx={{ textTransform: 'none', color: '#666', fontSize: { xs: '0.8rem', md: '0.875rem' } }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleRemoveItem}
            variant="contained"
            sx={{ 
              background: '#e91e63', 
              color: '#fff',
              textTransform: 'none',
              borderRadius: '0',
              fontWeight: 600,
              fontSize: { xs: '0.8rem', md: '0.875rem' }
            }}
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
      
      <Footer />
    </Box>
  );
};

export default Cart;
