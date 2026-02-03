import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Chip,
  IconButton,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Delete,
  ArrowBack,
  ShoppingCart,
  ShoppingBag,
  LocalShipping,
  CreditScore,
  Discount,
  ShieldOutlined,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import designTokens from '../../theme/designTokens';
import { cartAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Footer from '../../components/Footer';
import { showSuccess, showError } from '../../utils/toast';
import QuantitySelector from '../../components/QuantitySelector';
import PriceDisplay from '../../components/PriceDisplay';

const { colors, gradients, shadows, transitions } = designTokens;

const progressSteps = [
  {
    label: 'Cart',
    description: 'Review your selection',
    icon: ShoppingBag,
    status: 'current',
  },
  {
    label: 'Delivery',
    description: 'Schedule & address',
    icon: LocalShipping,
    status: 'upcoming',
  },
  {
    label: 'Payment',
    description: 'Secure checkout',
    icon: CreditScore,
    status: 'upcoming',
  },
];

const assurancePoints = [
  {
    icon: ShieldOutlined,
    title: 'Secure checkout',
    description: '256-bit encryption with UPI, card, and wallet support.',
  },
  {
    icon: Discount,
    title: 'Reward-ready',
    description: 'Apply loyalty perks and seasonal vouchers at payment.',
  },
  {
    icon: LocalShipping,
    title: 'Scheduled delivery',
    description: 'Choose preferred delivery slots with live status updates.',
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, y: -18, scale: 0.96 },
};

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const userId = user?.id;

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [promoCode, setPromoCode] = useState('');

  const fetchCart = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await cartAPI.get(userId);
      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (err) {
      showError('Could not load your cart. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

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

    try {
      const response = await cartAPI.removeItem(itemToDelete);
      if (response.data.success) {
        setCart(prevCart => ({
          ...prevCart,
          items: prevCart.items.filter(item => item.id !== itemToDelete),
        }));
        showSuccess('Item removed from cart');
        await fetchCart();
      } else {
        showError('Failed to remove item from cart');
      }
    } catch (err) {
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

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      showError('Enter a promo code to apply.');
      return;
    }
    showError('Promo code support is coming soon.');
  };

  const getItemPrice = (cartItem) => {
    if (cartItem.priceAtAddition && cartItem.priceAtAddition > 0) {
      return cartItem.priceAtAddition;
    }

    if (cartItem.eggType === 'EGGLESS') {
      return cartItem.item.price + 30;
    }
    return cartItem.item.price;
  };

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, cartItem) => total + getItemPrice(cartItem) * cartItem.quantity, 0);
  };

  const itemCount = cart?.items?.reduce((sum, cartItem) => sum + cartItem.quantity, 0) ?? 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: colors.cloud }}>
      <Box sx={{ flex: 1, pt: { xs: 12, md: 14 }, pb: { xs: 10, md: 12 } }}>
        <Container maxWidth="lg">
          <Stack spacing={4}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', md: 'center' }}
              spacing={3}
            >
              <Stack spacing={1.5} alignItems="flex-start">
                <Chip
                  label={loading ? 'Loading cart…' : `${itemCount} ${itemCount === 1 ? 'item' : 'items'} in cart`}
                  sx={{
                    borderRadius: 0,
                    backgroundColor: alpha(colors.brandPink, 0.12),
                    color: colors.brandPink,
                    letterSpacing: '0.08em',
                    fontWeight: 700,
                  }}
                />
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: colors.brandInk,
                    maxWidth: 620,
                  }}
                >
                  Review & finalise your order
                </Typography>
                <Typography variant="body1" sx={{ color: colors.stone, maxWidth: 520, lineHeight: 1.6 }}>
                  Double-check quantities, personalise preferences, and pick up where you left off before heading to checkout.
                </Typography>
              </Stack>

              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => navigate('/shop')}
                sx={{
                  borderRadius: 0,
                  borderColor: colors.brandPink,
                  color: colors.brandPink,
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 3,
                  py: 1.25,
                  alignSelf: { xs: 'stretch', md: 'center' },
                  '&:hover': {
                    borderColor: colors.brandBurgundy,
                    backgroundColor: alpha(colors.brandPink, 0.08),
                  },
                }}
              >
                Continue shopping
              </Button>
            </Stack>

            <Paper
              component={motion.div}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              sx={{
                borderRadius: 0,
                border: `1px solid ${alpha(colors.brandInk, 0.08)}`,
                background: alpha(colors.paper, 0.95),
                boxShadow: shadows.subtle,
                px: { xs: 3, md: 4 },
                py: { xs: 3, md: 3.5 },
              }}
            >
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={{ xs: 3, md: 4 }}
                divider={<Divider flexItem sx={{ borderColor: alpha(colors.brandInk, 0.08) }} />}
              >
                {progressSteps.map((step) => {
                  const StepIcon = step.icon;
                  const isCurrent = step.status === 'current';
                  return (
                    <Stack key={step.label} direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 0,
                          display: 'grid',
                          placeItems: 'center',
                          backgroundColor: isCurrent ? colors.brandPink : alpha(colors.brandInk, 0.05),
                          color: isCurrent ? colors.paper : colors.brandInk,
                          transition: transitions.micro,
                        }}
                      >
                        <StepIcon fontSize="small" />
                      </Box>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            textTransform: 'uppercase',
                            letterSpacing: '0.12em',
                            fontWeight: 700,
                            color: isCurrent ? colors.brandPink : colors.brandInk,
                          }}
                        >
                          {step.label}
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.stone }}>
                          {step.description}
                        </Typography>
                      </Box>
                    </Stack>
                  );
                })}
              </Stack>
            </Paper>

            {loading ? (
              <Paper
                sx={{
                  borderRadius: 0,
                  border: `1px solid ${alpha(colors.brandInk, 0.08)}`,
                  backgroundColor: colors.paper,
                  py: { xs: 6, md: 8 },
                  px: { xs: 3, md: 6 },
                  textAlign: 'center',
                }}
              >
                <Stack spacing={2} alignItems="center">
                  <CircularProgress sx={{ color: colors.brandPink }} />
                  <Typography variant="body1" sx={{ color: colors.stone }}>
                    Fetching the latest cart updates…
                  </Typography>
                </Stack>
              </Paper>
            ) : !cart?.items || cart.items.length === 0 ? (
              <Paper
                sx={{
                  borderRadius: 0,
                  border: `1px solid ${alpha(colors.brandInk, 0.08)}`,
                  backgroundColor: colors.paper,
                  px: { xs: 3, md: 6 },
                  py: { xs: 6, md: 8 },
                  textAlign: 'center',
                }}
              >
                <Stack spacing={3} alignItems="center">
                  <ShoppingCart sx={{ fontSize: 56, color: alpha(colors.brandInk, 0.2) }} />
                  <Typography variant="h5" sx={{ fontWeight: 700, color: colors.brandInk }}>
                    Your cart is empty
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.stone, maxWidth: 420, lineHeight: 1.6 }}>
                    Discover signature cakes, seasonal hampers, and chef-curated pairings in the shop to start building your order.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/shop')}
                    sx={{
                      borderRadius: 0,
                      fontWeight: 700,
                      textTransform: 'none',
                      px: 4,
                      py: 1.5,
                      background: gradients.primary,
                      boxShadow: shadows.resting,
                      '&:hover': {
                        boxShadow: shadows.hover,
                        background: gradients.primary,
                      },
                    }}
                  >
                    Browse the shop
                  </Button>
                </Stack>
              </Paper>
            ) : (
              <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                  <Paper
                    sx={{
                      borderRadius: 0,
                      border: `1px solid ${alpha(colors.brandInk, 0.08)}`,
                      backgroundColor: colors.paper,
                      boxShadow: shadows.subtle,
                    }}
                  >
                    <AnimatePresence>
                      {cart.items.map((cartItem, index) => {
                        const key = cartItem.id ?? `cart-item-${index}`;
                        const imageUrl = cartItem.item?.imageUrl;
                        return (
                          <Box
                            key={key}
                            component={motion.div}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            layout
                            sx={{
                              display: 'grid',
                              gridTemplateColumns: {
                                xs: '1fr',
                                md: '120px minmax(0,1fr) 140px 150px 48px',
                              },
                              alignItems: { md: 'start' },
                              gap: { xs: 2.5, md: 3 },
                              px: { xs: 3, md: 4 },
                              py: { xs: 3, md: 4 },
                              borderBottom:
                                index === cart.items.length - 1
                                  ? 'none'
                                  : `1px solid ${alpha(colors.brandInk, 0.06)}`,
                            }}
                          >
                            <Box
                              sx={{
                                width: { xs: '100%', md: 112 },
                                aspectRatio: { xs: '5 / 3', md: '1' },
                                borderRadius: 0,
                                overflow: 'hidden',
                                background: alpha(colors.brandInk, 0.04),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {imageUrl ? (
                                <Box
                                  component="img"
                                  src={imageUrl}
                                  alt={`${cartItem.item.name} preview`}
                                  sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                  }}
                                />
                              ) : (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: colors.muted,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.08em',
                                    fontWeight: 600,
                                  }}
                                >
                                  No image
                                </Typography>
                              )}
                            </Box>

                            <Stack spacing={1.5}>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 700,
                                  color: colors.brandInk,
                                  fontSize: { xs: '1.05rem', md: '1.15rem' },
                                }}
                              >
                                {cartItem.item.name}
                              </Typography>
                              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                                {cartItem.selectedWeight && (
                                  <Chip
                                    label={`${cartItem.selectedWeight} Kg`}
                                    size="small"
                                    sx={{
                                      borderRadius: 0,
                                      fontWeight: 600,
                                    }}
                                  />
                                )}
                                {cartItem.item.stock < 10 && cartItem.item.stock > 0 && (
                                  <Chip
                                    label={`Only ${cartItem.item.stock} left`}
                                    size="small"
                                    sx={{
                                      borderRadius: 0,
                                      backgroundColor: alpha(colors.warning, 0.12),
                                      color: colors.warning,
                                      fontWeight: 600,
                                    }}
                                  />
                                )}
                                {cartItem.eggType === 'EGGLESS' && (
                                  <Chip
                                    label="Eggless"
                                    size="small"
                                    sx={{
                                      borderRadius: 0,
                                      backgroundColor: alpha(colors.success, 0.12),
                                      color: colors.success,
                                      fontWeight: 600,
                                      fontSize: { xs: '0.6rem', md: '10px' },
                                      height: { xs: '18px', md: '20px' },
                                      letterSpacing: '0.04em',
                                      textTransform: 'uppercase',
                                    }}
                                  />
                                )}
                              </Stack>
                            </Stack>

                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: { xs: 'flex-start', md: 'flex-end' },
                                gap: 0.5,
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.12em',
                                  color: colors.muted,
                                  fontWeight: 600,
                                }}
                              >
                                Unit price
                              </Typography>
                              <PriceDisplay
                                amount={getItemPrice(cartItem)}
                                fontSize={isMobile ? '1rem' : '1.05rem'}
                                fontWeight={600}
                              />
                            </Box>

                            <Stack
                              direction={{ xs: 'row', md: 'column' }}
                              spacing={1}
                              alignItems={{ xs: 'center', md: 'flex-start' }}
                              justifyContent={{ xs: 'space-between', md: 'flex-start' }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.12em',
                                  color: colors.muted,
                                  fontWeight: 600,
                                }}
                              >
                                Quantity
                              </Typography>
                              <QuantitySelector
                                value={cartItem.quantity}
                                onIncrement={() => handleUpdateQuantity(cartItem.id, cartItem.quantity + 1)}
                                onDecrement={() => handleUpdateQuantity(cartItem.id, cartItem.quantity - 1)}
                                loading={updatingItems.has(cartItem.id)}
                                size="compact"
                              />
                            </Stack>

                            <Stack
                              direction="row"
                              spacing={1.5}
                              justifyContent={{ xs: 'space-between', md: 'flex-end' }}
                              alignItems="center"
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: { xs: 'flex-start', md: 'flex-end' },
                                  gap: 0.5,
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.12em',
                                    color: colors.muted,
                                    fontWeight: 600,
                                  }}
                                >
                                  Subtotal
                                </Typography>
                                <PriceDisplay
                                  amount={getItemPrice(cartItem) * cartItem.quantity}
                                  fontSize={isMobile ? '1.05rem' : '1.15rem'}
                                  fontWeight={700}
                                  color="primary.main"
                                />
                              </Box>
                              <IconButton
                                color="error"
                                onClick={() => handleOpenDeleteDialog(cartItem.id)}
                                sx={{
                                  borderRadius: 0,
                                  '&:hover': {
                                    backgroundColor: alpha(colors.danger, 0.08),
                                  },
                                }}
                              >
                                <Delete />
                              </IconButton>
                            </Stack>
                          </Box>
                        );
                      })}
                    </AnimatePresence>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Stack spacing={3}>
                    <Paper
                      sx={{
                        borderRadius: 0,
                        border: `1px solid ${alpha(colors.brandInk, 0.08)}`,
                        backgroundColor: colors.paper,
                        boxShadow: shadows.subtle,
                        p: { xs: 3, md: 4 },
                      }}
                    >
                      <Stack spacing={3}>
                        <Box>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: colors.brandInk }}>
                            Order summary
                          </Typography>
                          <Typography variant="body2" sx={{ color: colors.stone }}>
                            Express delivery slots open daily at 7 AM.
                          </Typography>
                        </Box>

                        <Stack spacing={1.5}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" sx={{ color: colors.stone }}>
                              Subtotal
                            </Typography>
                            <PriceDisplay amount={calculateTotal()} fontSize="1rem" fontWeight={600} />
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" sx={{ color: colors.stone }}>
                              Delivery
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              Complimentary
                            </Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" sx={{ color: colors.stone }}>
                              Savings
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: colors.brandPink }}>
                              Apply code
                            </Typography>
                          </Stack>
                        </Stack>

                        <Divider />

                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            Total
                          </Typography>
                          <PriceDisplay amount={calculateTotal()} fontSize="1.8rem" fontWeight={800} />
                        </Stack>

                        <Stack spacing={1.5}>
                          <TextField
                            label="Promo code"
                            value={promoCode}
                            placeholder="SWEET10"
                            onChange={(event) => setPromoCode(event.target.value.toUpperCase())}
                            InputLabelProps={{ shrink: true }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 0,
                                backgroundColor: alpha(colors.brandInk, 0.02),
                                '& fieldset': {
                                  borderColor: alpha(colors.brandInk, 0.12),
                                },
                                '&:hover fieldset': {
                                  borderColor: colors.brandPink,
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: colors.brandPink,
                                },
                              },
                            }}
                          />
                          <Button
                            variant="outlined"
                            startIcon={<Discount />}
                            onClick={handleApplyPromo}
                            sx={{
                              borderRadius: 0,
                              borderColor: colors.brandPink,
                              color: colors.brandPink,
                              fontWeight: 600,
                              textTransform: 'none',
                              '&:hover': {
                                borderColor: colors.brandBurgundy,
                                color: colors.brandBurgundy,
                              },
                            }}
                          >
                            Apply code
                          </Button>
                        </Stack>

                        <Button
                          variant="contained"
                          size="large"
                          onClick={handleProceedToCheckout}
                          sx={{
                            borderRadius: 0,
                            fontWeight: 700,
                            textTransform: 'none',
                            py: 1.6,
                            background: gradients.primary,
                            boxShadow: shadows.resting,
                            '&:hover': {
                              boxShadow: shadows.hover,
                              background: gradients.primary,
                            },
                          }}
                        >
                          Proceed to checkout
                        </Button>
                        <Button
                          variant="text"
                          onClick={() => navigate('/shop')}
                          sx={{
                            borderRadius: 0,
                            textTransform: 'none',
                            fontWeight: 600,
                            color: colors.stone,
                            '&:hover': {
                              color: colors.brandPink,
                              backgroundColor: 'transparent',
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          Continue shopping
                        </Button>
                      </Stack>
                    </Paper>

                    <Paper
                      sx={{
                        borderRadius: 0,
                        border: `1px solid ${alpha(colors.brandInk, 0.08)}`,
                        backgroundColor: alpha(colors.paper, 0.95),
                        boxShadow: shadows.subtle,
                        p: { xs: 3, md: 4 },
                      }}
                    >
                      <Stack spacing={2}>
                        {assurancePoints.map((point) => {
                          const AssuranceIcon = point.icon;
                          return (
                            <Stack key={point.title} direction="row" spacing={2} alignItems="flex-start">
                              <Box
                                sx={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: 0,
                                  display: 'grid',
                                  placeItems: 'center',
                                  backgroundColor: alpha(colors.brandPink, 0.08),
                                  color: colors.brandPink,
                                }}
                              >
                                <AssuranceIcon fontSize="small" />
                              </Box>
                              <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                  {point.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: colors.stone }}>
                                  {point.description}
                                </Typography>
                              </Box>
                            </Stack>
                          );
                        })}
                      </Stack>
                    </Paper>
                  </Stack>
                </Grid>
              </Grid>
            )}
          </Stack>
        </Container>
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          sx: {
            borderRadius: 0,
            border: `1px solid ${alpha(colors.brandInk, 0.08)}`,
            px: { xs: 2, md: 3 },
            py: { xs: 1.5, md: 2 },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: { xs: '1rem', md: '1.15rem' } }}>
          Remove item from cart?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: colors.stone }}>
            Are you sure you want to remove this item? You can always add it back from the shop later.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ gap: 1.5 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            sx={{
              borderRadius: 0,
              textTransform: 'none',
              fontWeight: 600,
              color: colors.stone,
            }}
          >
            Keep it
          </Button>
          <Button
            onClick={handleRemoveItem}
            variant="contained"
            sx={{
              borderRadius: 0,
              background: gradients.primary,
              textTransform: 'none',
              fontWeight: 700,
              '&:hover': {
                background: gradients.primary,
              },
            }}
          >
            Remove item
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  );
};

export default Cart;
