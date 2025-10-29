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

      <Box style={{ flex: 1, background: '#f5f5f5', paddingTop: '100px', paddingBottom: '40px', paddingLeft: '8px', paddingRight: '8px' }}>
        <Container maxWidth="lg">
          <Paper style={{ padding: '20px', borderRadius: '0', marginBottom: '20px' }}>
            <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <Typography variant="h5" style={{ fontWeight: 600 }}>
                Your Cart
              </Typography>
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => navigate('/')}
                style={{
                  borderColor: '#e91e63',
                  color: '#e91e63',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '0',
                }}
              >
                Back to Home
              </Button>
            </Box>

            {loading ? (
              <Box style={{ textAlign: 'center', padding: '40px' }}>
                <CircularProgress style={{ color: '#ff69b4' }} />
              </Box>
            ) : !cart?.items || cart.items.length === 0 ? (
              <Box style={{ textAlign: 'center', padding: '60px' }}>
                <ShoppingCart style={{ fontSize: 80, color: '#ccc', marginBottom: '20px' }} />
                <Typography variant="h6" color="textSecondary" gutterBottom>
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
                      <Card key={cartItem.id} style={{ marginBottom: '16px', borderRadius: '0', border: '1px solid #e0e0e0' }}>
                        <CardContent>
                          <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                            <Box style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                              <Box>
                                <Typography variant="body1" style={{ fontWeight: 600 }}>
                                  {cartItem.item.name}
                                </Typography>
                                <Box style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                                  {cartItem.selectedWeight && (
                                    <Chip 
                                      label={`${cartItem.selectedWeight} Kg`}
                                      size="small"
                                      style={{ 
                                        background: '#fff3e0',
                                        color: '#e65100',
                                        fontWeight: 600,
                                        fontSize: '10px',
                                        height: '20px'
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
                                        fontSize: '10px',
                                        height: '20px'
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
                          
                          <Divider style={{ margin: '12px 0' }} />
                          
                          <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <Typography variant="body2" color="textSecondary">
                              Price:
                            </Typography>
                            <Typography variant="body1" style={{ fontWeight: 600 }}>
                              ₹{getItemPrice(cartItem)?.toFixed(2)}
                            </Typography>
                          </Box>
                          
                          <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <Typography variant="body2" color="textSecondary">
                              Quantity:
                            </Typography>
                            <TextField
                              type="number"
                              value={cartItem.quantity}
                              onChange={(e) => handleUpdateQuantity(cartItem.id, parseInt(e.target.value))}
                              InputProps={{ inputProps: { min: 1 } }}
                              size="small"
                              style={{ width: '70px' }}
                            />
                          </Box>
                          
                          <Divider style={{ margin: '12px 0' }} />
                          
                          <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" style={{ fontWeight: 700 }}>
                              Subtotal:
                            </Typography>
                            <Typography variant="h6" style={{ fontWeight: 700, color: '#000000' }}>
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
                              <TextField
                                type="number"
                                value={cartItem.quantity}
                                onChange={(e) => handleUpdateQuantity(cartItem.id, parseInt(e.target.value))}
                                InputProps={{ inputProps: { min: 1 } }}
                                size="small"
                                style={{ width: '80px' }}
                              />
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

                <Box style={{ marginTop: '30px', padding: '20px', background: '#fef6ee', borderRadius: '0' }}>
                  <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" style={{ fontWeight: 700 }}>
                      Total:
                    </Typography>
                    <Typography variant="h4" style={{ fontWeight: 700, color: '#000000' }}>
                      ₹{calculateTotal().toFixed(2)}
                    </Typography>
                  </Box>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleProceedToCheckout}
                    style={{
                      marginTop: '20px',
                      background: '#e91e63',
                      color: '#fff',
                      padding: '12px',
                      fontSize: '16px',
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
          style: {
            borderRadius: '0',
            padding: '8px',
          }
        }}
      >
        <DialogTitle style={{ fontWeight: 600, fontSize: '20px' }}>
          Remove Item from Cart?
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ fontSize: '16px', color: '#666' }}>
            Are you sure you want to remove this item from your cart?
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ padding: '16px 24px' }}>
          <Button 
            onClick={handleCloseDeleteDialog}
            style={{ textTransform: 'none', color: '#666' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleRemoveItem}
            variant="contained"
            style={{ 
              background: '#e91e63', 
              color: '#fff',
              textTransform: 'none',
              borderRadius: '0',
              fontWeight: 600
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
