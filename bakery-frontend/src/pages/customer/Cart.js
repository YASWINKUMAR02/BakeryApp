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
import { alpha } from '@mui/material/styles';
import {
  Delete,
  ShoppingCart,
  Cake,
  ArrowBack,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { cartAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Footer from '../../components/Footer';
import { showSuccess, showError } from '../../utils/toast';
import QuantitySelector from '../../components/QuantitySelector';
import { formatCurrency } from '../../utils/currencyUtils';
import PriceDisplay from '../../components/PriceDisplay';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState(new Set());
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
      showError('Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdatingItems(prev => new Set(prev).add(cartItemId));
    try {
      await cartAPI.updateItem(cartItemId, newQuantity);
      await fetchCart();
      showSuccess('Quantity updated!');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update quantity');
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev);
        next.delete(cartItemId);
        return next;
      });
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
                onClick={() => navigate('/shop')}
                sx={{
                  borderColor: '#e91e63',
                  color: '#e91e63',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '12px',
                  fontSize: { xs: '0.75rem', md: '0.875rem' },
                  padding: { xs: '4px 12px', md: '6px 20px' },
                  '&:hover': { borderColor: '#d81b60', background: 'rgba(233, 30, 99, 0.04)' }
                }}
              >
                Continue Shopping
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
                    <AnimatePresence>
                      {cart.items.map((cartItem, index) => (
                        <motion.div
                          key={cartItem.id || `cart-item-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          layout
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <Card sx={{ marginBottom: { xs: '12px', md: '16px' }, borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                            <CardContent sx={{ padding: { xs: '12px', md: '16px' } }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: { xs: '8px', md: '12px' } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: '6px', md: '8px' }, flex: 1 }}>
                                  <Box>
                                    <Typography variant="body1" sx={{ fontWeight: 600, fontSize: { xs: '0.85rem', md: '1rem' } }}>
                                      {cartItem.item.name}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: { xs: '4px', md: '6px' }, marginTop: { xs: '4px', md: '6px' }, flexWrap: 'wrap', alignItems: 'center' }}>
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
                                      {cartItem.item.stock < 10 && cartItem.item.stock > 0 && (
                                        <Typography variant="caption" sx={{ color: '#ed6c02', fontWeight: 700, fontSize: '10px', ml: 0.5 }}>
                                          Only {cartItem.item.stock} left
                                        </Typography>
                                      )}
                                    </Box>
                                  </Box>
                                </Box>
                                <IconButton
                                  color="error"
                                  size="small"
                                  onClick={() => handleOpenDeleteDialog(cartItem.id)}
                                  sx={{ '&:hover': { background: 'rgba(211, 47, 47, 0.04)' } }}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Box>

                              <Divider sx={{ margin: { xs: '8px 0', md: '12px 0' } }} />

                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: { xs: '6px', md: '8px' } }}>
                                <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                                  Price:
                                </Typography>
                                <PriceDisplay
                                  amount={getItemPrice(cartItem)}
                                  fontSize="0.9rem"
                                  fontWeight={600}
                                />
                              </Box>

                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: { xs: '6px', md: '8px' } }}>
                                <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                                  Quantity:
                                </Typography>
                                <QuantitySelector
                                  value={cartItem.quantity}
                                  onIncrement={() => handleUpdateQuantity(cartItem.id, cartItem.quantity + 1)}
                                  onDecrement={() => handleUpdateQuantity(cartItem.id, cartItem.quantity - 1)}
                                  loading={updatingItems.has(cartItem.id)}
                                  size="small"
                                />
                              </Box>

                              <Divider sx={{ margin: { xs: '8px 0', md: '12px 0' } }} />

                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body1" sx={{ fontWeight: 700, fontSize: { xs: '0.8rem', md: '1rem' } }}>
                                  Subtotal:
                                </Typography>
                                <PriceDisplay
                                  amount={getItemPrice(cartItem) * cartItem.quantity}
                                  fontSize="1rem"
                                  fontWeight={800}
                                  color="primary.main"
                                />
                              </Box>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
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
                        <AnimatePresence>
                          {cart.items.map((cartItem) => (
                            <TableRow
                              key={cartItem.id}
                              component={motion.tr}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20, backgroundColor: 'rgba(233, 30, 99, 0.05)' }}
                              layout
                              hover
                            >
                              <TableCell>
                                <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <Box>
                                    <Typography sx={{ fontWeight: 600 }}>{cartItem.item.name}</Typography>
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
                                      {cartItem.item.stock < 10 && cartItem.item.stock > 0 && (
                                        <Typography variant="caption" sx={{ color: '#ed6c02', fontWeight: 700, fontSize: '11px', display: 'flex', alignItems: 'center' }}>
                                          Only {cartItem.item.stock} left
                                        </Typography>
                                      )}
                                    </Box>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell sx={{ fontWeight: 500 }}>
                                <PriceDisplay amount={getItemPrice(cartItem)} fontSize="1rem" fontWeight={500} />
                              </TableCell>
                              <TableCell>
                                <QuantitySelector
                                  value={cartItem.quantity}
                                  onIncrement={() => handleUpdateQuantity(cartItem.id, cartItem.quantity + 1)}
                                  onDecrement={() => handleUpdateQuantity(cartItem.id, cartItem.quantity - 1)}
                                  loading={updatingItems.has(cartItem.id)}
                                />
                              </TableCell>
                              <TableCell>
                                <PriceDisplay amount={getItemPrice(cartItem) * cartItem.quantity} fontSize="1.1rem" fontWeight={700} color="primary.main" />
                              </TableCell>
                              <TableCell align="right">
                                <IconButton
                                  color="error"
                                  onClick={() => handleOpenDeleteDialog(cartItem.id)}
                                  sx={{ '&:hover': { background: 'rgba(211, 47, 47, 0.04)' } }}
                                >
                                  <Delete />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </AnimatePresence>
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                <Box sx={{ marginTop: { xs: '20px', md: '30px' }, padding: { xs: '12px', md: '20px' }, background: '#fef6ee', borderRadius: '0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: '1rem', md: '1.5rem' } }}>
                      Total:
                    </Typography>
                    <PriceDisplay
                      amount={calculateTotal()}
                      fontSize={isMobile ? "1.4rem" : "2.2rem"}
                      fontWeight={800}
                    />
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
                      padding: { xs: '10px', md: '14px' },
                      fontSize: { xs: '0.875rem', md: '16px' },
                      fontWeight: 700,
                      textTransform: 'none',
                      borderRadius: '50px',
                      boxShadow: '0 8px 24px rgba(233, 30, 99, 0.25)',
                      '&:hover': { background: '#d81b60', boxShadow: '0 12px 32px rgba(233, 30, 99, 0.35)' }
                    }}
                  >
                    Proceed to Checkout
                  </Button>
                  <Button
                    fullWidth
                    variant="text"
                    onClick={() => navigate('/shop')}
                    sx={{
                      marginTop: '10px',
                      color: '#666',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': { background: 'transparent', textDecoration: 'underline', color: '#e91e63' }
                    }}
                  >
                    Continue Shopping
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
