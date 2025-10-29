import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  Chip,
} from '@mui/material';
import {
  ShoppingCart,
  LocalShipping,
  Person,
  Phone,
  Home,
  Notes,
  LocationOn,
  Edit,
} from '@mui/icons-material';
import { cartAPI, orderAPI, paymentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import CustomerHeader from '../../components/CustomerHeader';
import Footer from '../../components/Footer';
import { showSuccess, showError } from '../../utils/toast';
import { notifyCustomerOrderPlaced, notifyAdminNewOrder } from '../../utils/notificationUtils';
import LocationPicker from '../../components/LocationPicker';
import { initializeRazorpay, isRazorpayLoaded } from '../../services/razorpay';
import { validateName, validatePhone, validateRequired, validatePincode } from '../../utils/formValidation';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    doorNo: '',
    street: '',
    area: '',
    city: 'Coimbatore',
    pincode: '',
    deliveryPhone: user?.phone || '',
    deliveryNotes: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [locationCoordinates, setLocationCoordinates] = useState(null);
  const [addressMethod, setAddressMethod] = useState(null); // 'location' or 'manual'

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.get(user.id);
      if (response.data.success) {
        setCart(response.data.data);
        if (!response.data.data.items || response.data.data.items.length === 0) {
          navigate('/cart');
        }
      }
    } catch (err) {
      showError('Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => {
      // Use stored price if available (for cakes with weight pricing)
      let itemPrice = item.priceAtAddition && item.priceAtAddition > 0
        ? item.priceAtAddition
        : item.item.price;
      
      // Add ₹30 for eggless items (only if not using priceAtAddition)
      if (item.eggType === 'EGGLESS' && (!item.priceAtAddition || item.priceAtAddition === 0)) {
        itemPrice += 30;
      }
      
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate name
    errors.customerName = validateName(formData.customerName);
    
    // Check if using location method
    const isLocationBased = addressMethod === 'location';
    
    if (!isLocationBased) {
      // Only validate address fields for manual entry
      errors.doorNo = validateRequired(formData.doorNo, 'Door number');
      errors.street = validateRequired(formData.street, 'Street');
      errors.area = validateRequired(formData.area, 'Area');
      errors.city = validateRequired(formData.city, 'City');
      errors.pincode = validatePincode(formData.pincode);
    } else {
      // For location-based, verify coordinates are captured
      if (!locationCoordinates || !locationCoordinates.lat || !locationCoordinates.lng) {
        errors.location = 'Please verify your location first';
        showError('Please verify your location before placing order');
      }
    }
    
    // Validate phone
    errors.deliveryPhone = validatePhone(formData.deliveryPhone);
    
    // Check if cart has any weight-based items (occasional/premium/party cakes) - if yes, delivery notes are mandatory
    const hasWeightBasedItems = cart?.items?.some(item => {
      const catName = item.item?.category?.name?.toLowerCase() || '';
      return catName.includes('occasional') || catName.includes('premium') || catName.includes('party');
    });
    
    if (hasWeightBasedItems && (!formData.deliveryNotes || formData.deliveryNotes.trim() === '')) {
      errors.deliveryNotes = 'Please specify what to write on the cake';
    }
    
    // Filter out empty errors
    const filteredErrors = {};
    Object.keys(errors).forEach(key => {
      if (errors[key]) filteredErrors[key] = errors[key];
    });
    
    setFormErrors(filteredErrors);
    return Object.keys(filteredErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleLocationSelect = (locationData) => {
    // Set 'location' as the address when using GPS verification
    setFormData(prev => ({
      ...prev,
      doorNo: 'location',
      street: '',
      area: '',
      city: 'Coimbatore',
      pincode: '',
    }));
    
    // Store coordinates
    setLocationCoordinates({
      lat: locationData.lat,
      lng: locationData.lng,
    });
    
    setAddressMethod('location');
    showSuccess('Location verified! Your GPS location will be used for delivery.');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError('Please fill in all required fields correctly');
      return;
    }

    // Check if Razorpay is loaded
    if (!isRazorpayLoaded()) {
      showError('Payment gateway not loaded. Please refresh the page.');
      return;
    }

    setSubmitting(true);

    try {
      const totalAmount = calculateTotal();
      
      // Create Razorpay order
      const paymentResponse = await paymentAPI.createOrder(totalAmount, user.id);
      
      if (!paymentResponse.data.success) {
        throw new Error('Failed to create payment order');
      }

      const razorpayOrderId = paymentResponse.data.data.razorpayOrderId;
      
      // Initialize Razorpay payment
      initializeRazorpay({
        amount: totalAmount,
        orderId: razorpayOrderId,
        customerName: formData.customerName,
        customerEmail: user.email || 'customer@bakery.com',
        customerPhone: formData.deliveryPhone,
        onSuccess: async (paymentData) => {
          // CRITICAL: This callback ONLY fires when Razorpay confirms payment success
          console.log('✅ Payment confirmed by Razorpay, proceeding to place order...');
          await completeOrder(paymentData);
        },
        onFailure: (error) => {
          // This fires when payment fails or user cancels
          console.log('❌ Payment failed or cancelled:', error);
          showError(error || 'Payment failed or cancelled. Please try again.');
          setSubmitting(false);
        },
      });
    } catch (err) {
      console.error('Error initiating payment:', err);
      showError(err.response?.data?.message || 'Failed to initiate payment');
      setSubmitting(false);
    }
  };

  const completeOrder = async (paymentData) => {
    try {
      console.log('Payment successful, placing order with verification...');
      
      // Combine address fields into a single deliveryAddress string
      const deliveryAddress = `${formData.doorNo}, ${formData.street}, ${formData.area}, ${formData.city} - ${formData.pincode}`;
      
      // Backend will verify payment before creating order
      const orderData = {
        customerName: formData.customerName,
        deliveryAddress: deliveryAddress,
        deliveryPhone: formData.deliveryPhone,
        deliveryNotes: formData.deliveryNotes,
        latitude: locationCoordinates?.lat || null,
        longitude: locationCoordinates?.lng || null,
        paymentId: paymentData.razorpayPaymentId,
        paymentOrderId: paymentData.razorpayOrderId,
        paymentSignature: paymentData.razorpaySignature,
      };
      
      console.log('Placing order with payment data:', orderData);
      
      const response = await orderAPI.placeOrder(user.id, orderData);
      
      if (response.data.success) {
        const orderId = response.data.data?.id || Math.floor(Math.random() * 10000);
        
        console.log('Order placed successfully with ID:', orderId);
        
        // Notify customer about order placement
        notifyCustomerOrderPlaced(user.id, orderId);
        
        // Notify admin about new order (use admin ID 1 for now)
        notifyAdminNewOrder(1, orderId, user.name);
        
        // Trigger a custom event for real-time notification across tabs
        localStorage.setItem('newOrderNotification', JSON.stringify({
          orderId: orderId,
          customerName: user.name,
          timestamp: Date.now()
        }));
        
        showSuccess('Payment verified! Order placed successfully.');
        setTimeout(() => navigate('/orders'), 2000);
      } else {
        showError('Failed to place order. Please contact support.');
      }
    } catch (err) {
      console.error('Error in completeOrder:', err);
      
      // Check if it's a payment verification error
      const errorMessage = err.response?.data?.message || '';
      
      if (errorMessage.includes('Payment verification failed') || errorMessage.includes('Invalid signature')) {
        showError('Payment verification failed. Your payment was processed but order could not be created. Please contact support with payment ID: ' + paymentData.razorpayPaymentId);
      } else if (errorMessage.includes('Insufficient stock')) {
        showError('Some items are out of stock. Your payment will be refunded. ' + errorMessage);
      } else {
        showError(errorMessage || 'Order placement failed. Please contact support with your payment details.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <CustomerHeader />
        <Box style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress style={{ color: '#ff69b4' }} />
        </Box>
      </>
    );
  }

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CustomerHeader />

      <Box style={{ flex: 1, background: '#f5f5f5', paddingTop: '100px', paddingBottom: '40px', paddingLeft: '8px', paddingRight: '8px' }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {/* Delivery Details Form */}
            <Grid item xs={12} md={7}>
              <Paper style={{ padding: '30px', borderRadius: '0' }}>
                <Box style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <LocalShipping style={{ fontSize: 32, color: '#ff69b4', marginRight: '10px' }} />
                  <Typography variant="h5" style={{ fontWeight: 600 }}>
                    Delivery Details
                  </Typography>
                </Box>

                <Alert severity="info" style={{ marginBottom: '20px' }}>
                  <strong>Note:</strong> Delivery is only available for Coimbatore (Pincode: 641xxx)
                </Alert>

                {!addressMethod ? (
                  // Show choice buttons
                  <Box>
                    <Typography variant="h6" style={{ marginBottom: '20px', textAlign: 'center', fontWeight: 600 }}>
                      How would you like to provide your delivery address?
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<LocationOn />}
                          onClick={() => setShowLocationPicker(true)}
                          style={{
                            background: '#e91e63',
                            color: '#fff',
                            padding: '20px',
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '16px',
                            borderRadius: '0',
                          }}
                        >
                          Use My Current Location
                        </Button>
                        <Typography variant="caption" color="textSecondary" style={{ display: 'block', textAlign: 'center', marginTop: '8px' }}>
                          Quick & Easy - GPS Based
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<Edit />}
                          onClick={() => setAddressMethod('manual')}
                          style={{
                            borderColor: '#e91e63',
                            color: '#e91e63',
                            padding: '20px',
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '16px',
                            borderRadius: '0',
                          }}
                        >
                          Enter Address Manually
                        </Button>
                        <Typography variant="caption" color="textSecondary" style={{ display: 'block', textAlign: 'center', marginTop: '8px' }}>
                          Fill in complete address
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                ) : addressMethod === 'location' ? (
                  // Location method selected
                  <Box>
                    <Alert severity="success" style={{ marginBottom: '20px' }}>
                      ✓ Using GPS Location for delivery
                    </Alert>
                    <Button
                      size="small"
                      onClick={() => {
                        setAddressMethod(null);
                        setLocationCoordinates(null);
                        setFormData(prev => ({ ...prev, doorNo: '', street: '', area: '', pincode: '' }));
                      }}
                      style={{ marginBottom: '20px', textTransform: 'none' }}
                    >
                      Change to Manual Address
                    </Button>
                  </Box>
                ) : null}

                {addressMethod === 'manual' && (
                  <Box>
                    <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <Typography variant="body2" color="textSecondary">
                        Entering address manually
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => setAddressMethod(null)}
                        style={{ textTransform: 'none' }}
                      >
                        Use Location Instead
                      </Button>
                    </Box>
                  </Box>
                )}

                {addressMethod && (
                <form onSubmit={handlePlaceOrder}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        error={!!formErrors.customerName}
                        helperText={formErrors.customerName}
                        required
                        InputProps={{
                          startAdornment: <Person style={{ color: '#ff69b4', marginRight: '8px' }} />,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="deliveryPhone"
                        value={formData.deliveryPhone}
                        onChange={handleInputChange}
                        error={!!formErrors.deliveryPhone}
                        helperText={formErrors.deliveryPhone || 'Enter 10-15 digit phone number'}
                        required
                        InputProps={{
                          startAdornment: <Phone style={{ color: '#ff69b4', marginRight: '8px' }} />,
                        }}
                      />
                    </Grid>

                    {addressMethod === 'manual' && (
                    <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Door No / Building"
                        name="doorNo"
                        value={formData.doorNo}
                        onChange={handleInputChange}
                        error={!!formErrors.doorNo}
                        helperText={formErrors.doorNo}
                        required
                        InputProps={{
                          startAdornment: <Home style={{ color: '#ff69b4', marginRight: '8px' }} />,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Street"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        error={!!formErrors.street}
                        helperText={formErrors.street}
                        required
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Area / Locality"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        error={!!formErrors.area}
                        helperText={formErrors.area}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        error={!!formErrors.city}
                        helperText="Delivery available only in Coimbatore"
                        required
                        disabled
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        error={!!formErrors.pincode}
                        helperText={formErrors.pincode || 'Enter Coimbatore pincode (641xxx)'}
                        required
                        inputProps={{ maxLength: 6 }}
                        placeholder="641xxx"
                      />
                    </Grid>
                    </>
                    )}

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label={(() => {
                          const hasWeightBased = cart?.items?.some(item => {
                            const catName = item.item?.category?.name?.toLowerCase() || '';
                            return catName.includes('occasional') || catName.includes('premium') || catName.includes('party');
                          });
                          return hasWeightBased ? "Delivery Notes (Required for Cakes) *" : "Delivery Notes (Optional)";
                        })()}
                        name="deliveryNotes"
                        value={formData.deliveryNotes}
                        onChange={handleInputChange}
                        multiline
                        rows={3}
                        placeholder={(() => {
                          const hasWeightBased = cart?.items?.some(item => {
                            const catName = item.item?.category?.name?.toLowerCase() || '';
                            return catName.includes('occasional') || catName.includes('premium') || catName.includes('party');
                          });
                          return hasWeightBased 
                            ? "What to write on the cake? (e.g., 'Happy Birthday John!' or type 'Nothing' if you don't want any text)"
                            : "Any special instructions for delivery...";
                        })()}
                        error={!!formErrors.deliveryNotes}
                        helperText={formErrors.deliveryNotes || (() => {
                          const hasWeightBased = cart?.items?.some(item => {
                            const catName = item.item?.category?.name?.toLowerCase() || '';
                            return catName.includes('occasional') || catName.includes('premium') || catName.includes('party');
                          });
                          return hasWeightBased ? "Required: Tell us what message you want on your cake" : "";
                        })()}
                        InputProps={{
                          startAdornment: <Notes style={{ color: '#ff69b4', marginRight: '8px', alignSelf: 'flex-start', marginTop: '12px' }} />,
                        }}
                      />
                    </Grid>
                  </Grid>
                </form>
                )}
              </Paper>
            </Grid>

            {/* Order Summary */}
            <Grid item xs={12} md={5}>
              <Paper style={{ padding: '30px', borderRadius: '0', position: 'sticky', top: '100px' }}>
                <Box style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <ShoppingCart style={{ fontSize: 32, color: '#ff69b4', marginRight: '10px' }} />
                  <Typography variant="h5" style={{ fontWeight: 600 }}>
                    Order Summary
                  </Typography>
                </Box>

                <Divider style={{ marginBottom: '20px' }} />

                {cart?.items?.map((cartItem) => {
                  // Use stored price if available (for cakes with weight pricing)
                  const itemPrice = cartItem.priceAtAddition && cartItem.priceAtAddition > 0
                    ? cartItem.priceAtAddition
                    : (cartItem.eggType === 'EGGLESS' 
                        ? cartItem.item.price + 30 
                        : cartItem.item.price);
                  const itemTotal = itemPrice * cartItem.quantity;
                  
                  return (
                    <Box key={cartItem.id} style={{ marginBottom: '15px' }}>
                      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body1">
                            {cartItem.item.name}
                            {cartItem.selectedWeight && ` (${cartItem.selectedWeight} Kg)`}
                            {!cartItem.selectedWeight && ` × ${cartItem.quantity}`}
                          </Typography>
                          <Box style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                            {cartItem.selectedWeight && (
                              <Chip 
                                label={`${cartItem.selectedWeight} Kg`}
                                size="small"
                                style={{ 
                                  background: '#fff3e0',
                                  color: '#e65100',
                                  fontSize: '10px',
                                  height: '20px'
                                }}
                              />
                            )}
                            {cartItem.eggType === 'EGGLESS' && (
                              <Chip 
                                label="🌱 Eggless"
                                size="small"
                                style={{ 
                                  background: '#e8f5e9',
                                  color: '#2e7d32',
                                  fontSize: '10px',
                                  height: '20px'
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                        <Typography variant="body1" style={{ fontWeight: 600 }}>
                          ₹{itemTotal.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}

                <Divider style={{ margin: '20px 0' }} />

                <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <Typography variant="h6" style={{ fontWeight: 700 }}>
                    Total:
                  </Typography>
                  <Typography variant="h5" style={{ fontWeight: 700, color: '#000000' }}>
                    ₹{calculateTotal().toFixed(2)}
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handlePlaceOrder}
                  disabled={submitting || !addressMethod}
                  style={{
                    background: (submitting || !addressMethod) ? '#ccc' : '#e91e63',
                    color: '#fff',
                    padding: '14px',
                    fontSize: '16px',
                    fontWeight: 600,
                    textTransform: 'none',
                    marginBottom: '10px',
                    borderRadius: '0',
                  }}
                >
                  {submitting ? <CircularProgress size={24} style={{ color: '#fff' }} /> : 'Proceed to Payment'}
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/cart')}
                  disabled={submitting}
                  style={{
                    borderColor: '#e91e63',
                    color: '#e91e63',
                    padding: '12px',
                    textTransform: 'none',
                    borderRadius: '0',
                  }}
                >
                  Back to Cart
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Location Picker Dialog */}
      <LocationPicker
        open={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onSelectLocation={handleLocationSelect}
      />
      
      <Footer />
    </Box>
  );
};

export default Checkout;
