import React, { useState, useEffect } from 'react';
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
  Chip,
  IconButton,
  Collapse,
  Divider,
  Grid,
  Tabs,
  Tab,
  Pagination,
  TextField,
} from '@mui/material';
import {
  Receipt,
  ExpandMore,
  ExpandLess,
  Person,
  Phone,
  Home,
  Notes,
  ShoppingBag,
  History,
  CalendarToday,
  CheckCircle,
  Edit,
  Save,
  Cancel,
  LocationOn,
} from '@mui/icons-material';
import { orderAPI, orderHistoryAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import CustomerHeader from '../../components/CustomerHeader';
import Footer from '../../components/Footer';
import { showSuccess, showError } from '../../utils/toast';
import LocationPicker from '../../components/LocationPicker';
import { OrderCardSkeleton } from '../../components/LoadingSkeleton';

const Orders = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedHistoryOrder, setExpandedHistoryOrder] = useState(null); // For order history expand/collapse
  const [tabValue, setTabValue] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const ordersPerPage = 5;
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    doorNo: '',
    street: '',
    area: '',
    city: 'Coimbatore',
    pincode: '',
    deliveryPhone: '',
    deliveryNotes: '',
  });
  const [updating, setUpdating] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [editLocationCoordinates, setEditLocationCoordinates] = useState(null);
  const [editAddressMethod, setEditAddressMethod] = useState(null); // 'location' or 'manual'

  useEffect(() => {
    fetchOrders();
    fetchOrderHistory();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getByCustomer(user.id);
      if (response.data.success) {
        // Sort orders by most recent first
        const sortedOrders = (response.data.data || []).sort((a, b) => 
          new Date(b.orderDate) - new Date(a.orderDate)
        );
        setOrders(sortedOrders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      // If 404 or no orders, just show empty state
      if (err.response?.status === 404) {
        setOrders([]);
      } else {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderHistory = async () => {
    try {
      const response = await orderHistoryAPI.getByCustomer(user.id);
      if (response.data) {
        // Sort order history by most recent first
        const sortedHistory = (response.data || []).sort((a, b) => 
          new Date(b.orderDate) - new Date(a.orderDate)
        );
        setOrderHistory(sortedHistory);
      }
    } catch (err) {
      console.error('Error fetching order history:', err);
      if (err.response?.status === 404) {
        setOrderHistory([]);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Confirmed':
        return 'info';
      case 'Packed':
        return 'warning';
      case 'Out for Delivery':
        return 'primary';
      case 'Delivered':
        return 'success';
      default:
        return 'default';
    }
  };

  const toggleHistoryOrderDetails = (orderId) => {
    setExpandedHistoryOrder(expandedHistoryOrder === orderId ? null : orderId);
  };

  // Pagination logic for current orders
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalOrderPages = Math.ceil(orders.length / ordersPerPage);

  // Pagination logic for order history
  const indexOfLastHistory = historyPage * ordersPerPage;
  const indexOfFirstHistory = indexOfLastHistory - ordersPerPage;
  const currentHistory = orderHistory.slice(indexOfFirstHistory, indexOfLastHistory);
  const totalHistoryPages = Math.ceil(orderHistory.length / ordersPerPage);

  const handleCurrentPageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleHistoryPageChange = (event, value) => {
    setHistoryPage(value);
    setExpandedHistoryOrder(null); // Close any expanded order when changing pages
  };

  const handleEditAddress = (order) => {
    setEditingOrderId(order.id);
    setEditAddressMethod(null); // Reset method choice - let user choose
    setEditLocationCoordinates(null); // Reset coordinates
    
    // Parse existing address into separate fields
    // Format: "Door No, Street, Area, City - Pincode" OR "location, , , Coimbatore -"
    let doorNo = '', street = '', area = '', city = 'Coimbatore', pincode = '';
    
    if (order.deliveryAddress) {
      // Split by comma to get parts
      const parts = order.deliveryAddress.split(',').map(part => part.trim());
      
      // Check if first part is 'location'
      if (parts[0].toLowerCase() === 'location') {
        // It's a location-based address, just set doorNo to 'location'
        doorNo = 'location';
        street = '';
        area = '';
        city = 'Coimbatore';
        pincode = '';
        // Don't auto-select, let user choose
        
        // Store existing coordinates for reference
        if (order.latitude && order.longitude) {
          setEditLocationCoordinates({
            lat: order.latitude,
            lng: order.longitude,
          });
        }
      } else {
        // Don't auto-select manual, let user choose
        // Regular address parsing
        doorNo = parts[0] || '';
        street = parts[1] || '';
        
        // Find the part that contains the dash (City - Pincode)
        let cityPincodeIndex = -1;
        for (let i = parts.length - 1; i >= 2; i--) {
          if (parts[i].includes('-')) {
            cityPincodeIndex = i;
            break;
          }
        }
        
        if (cityPincodeIndex !== -1) {
          // Combine all parts between street and city-pincode as area
          area = parts.slice(2, cityPincodeIndex).join(', ');
          
          // Parse city and pincode from the last part
          const lastPart = parts[cityPincodeIndex];
          if (lastPart.includes(' - ')) {
            const [cityPart, pincodePart] = lastPart.split(' - ').map(p => p.trim());
            city = cityPart || 'Coimbatore';
            pincode = pincodePart || '';
          } else if (lastPart.includes('-')) {
            const [cityPart, pincodePart] = lastPart.split('-').map(p => p.trim());
            city = cityPart || 'Coimbatore';
            pincode = pincodePart || '';
          }
        } else {
          // No dash found, combine remaining parts as area
          area = parts.slice(2).join(', ');
        }
      }
    }
    
    setEditFormData({
      doorNo,
      street,
      area,
      city,
      pincode,
      deliveryPhone: order.deliveryPhone || '',
      deliveryNotes: order.deliveryNotes || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingOrderId(null);
    setEditFormData({
      doorNo: '',
      street: '',
      area: '',
      city: 'Coimbatore',
      pincode: '',
      deliveryPhone: '',
      deliveryNotes: '',
    });
    setEditLocationCoordinates(null);
    setEditAddressMethod(null);
  };

  const handleEditFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLocationSelectInEdit = (locationData) => {
    // Set 'location' as the address when using GPS verification
    setEditFormData(prev => ({
      ...prev,
      doorNo: 'location',
      street: '',
      area: '',
      city: 'Coimbatore',
      pincode: '',
    }));
    
    // Store coordinates
    setEditLocationCoordinates({
      lat: locationData.lat,
      lng: locationData.lng,
    });
    
    setEditAddressMethod('location');
    showSuccess('Location verified! Your GPS location will be used for delivery.');
  };

  const handleSaveAddress = async (orderId) => {
    // Validation
    if (!editFormData.deliveryPhone) {
      showError('Please enter phone number');
      return;
    }
    
    // Check if using location-based address
    const isLocationBased = editFormData.doorNo.trim().toLowerCase() === 'location';
    
    if (!editFormData.doorNo) {
      showError('Please fill in door number or use location verification');
      return;
    }
    
    // Only validate other fields if not using location
    if (!isLocationBased) {
      if (!editFormData.street || !editFormData.area || !editFormData.pincode) {
        showError('Please fill in all address fields');
        return;
      }
      if (!/^641[0-9]{3}$/.test(editFormData.pincode)) {
        showError('Please enter a valid Coimbatore pincode (641xxx)');
        return;
      }
    }

    setUpdating(true);
    try {
      // Combine address fields into single string
      const deliveryAddress = `${editFormData.doorNo}, ${editFormData.street}, ${editFormData.area}, ${editFormData.city} - ${editFormData.pincode}`;
      
      const updateData = {
        deliveryAddress: deliveryAddress,
        deliveryPhone: editFormData.deliveryPhone,
        deliveryNotes: editFormData.deliveryNotes,
        latitude: editLocationCoordinates?.lat || null,
        longitude: editLocationCoordinates?.lng || null,
      };
      
      const response = await orderAPI.updateAddress(orderId, user.id, updateData);
      if (response.data.success) {
        showSuccess(response.data.message || 'Address updated successfully!');
        setEditingOrderId(null);
        setEditLocationCoordinates(null); // Reset coordinates
        setEditAddressMethod(null); // Reset method
        setEditFormData({ // Reset form
          doorNo: '',
          street: '',
          area: '',
          city: 'Coimbatore',
          pincode: '',
          deliveryPhone: '',
          deliveryNotes: '',
        });
        fetchOrders(); // Refresh orders to show updated data
      } else {
        showError(response.data.message || 'Failed to update address');
      }
    } catch (error) {
      console.error('Error updating address:', error);
      showError(error.response?.data?.message || 'Failed to update address');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CustomerHeader />

      <Box sx={{ flex: 1, background: '#f5f5f5', paddingTop: { xs: '80px', md: '80px' }, paddingBottom: { xs: '12px', md: '16px' }, paddingLeft: { xs: '4px', md: '8px' }, paddingRight: { xs: '4px', md: '8px' } }}>
        <Container maxWidth="lg">
          {error && <Alert severity="error" style={{ marginBottom: '20px' }}>{error}</Alert>}

          <Paper sx={{ padding: { xs: '8px', md: '12px' }, borderRadius: '0', marginBottom: { xs: '8px', md: '12px' } }}>
            <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: { xs: '6px', md: '8px' }, fontSize: { xs: '0.9rem', md: '1rem' } }}>
              My Orders
            </Typography>

            <Tabs 
              value={tabValue} 
              onChange={(e, newValue) => setTabValue(newValue)}
              sx={{ 
                marginBottom: { xs: '6px', md: '8px' }, 
                borderBottom: '1px solid #e0e0e0', 
                minHeight: { xs: '32px', md: '36px' },
                '& .MuiTab-root': {
                  color: '#666',
                },
                '& .Mui-selected': {
                  color: '#ff69b4 !important',
                },
              }}
              TabIndicatorProps={{
                style: { backgroundColor: '#ff69b4' }
              }}
            >
              <Tab 
                icon={<Receipt />} 
                iconPosition="start" 
                label="Current Orders" 
                style={{ textTransform: 'none', fontWeight: 600 }}
              />
              <Tab 
                icon={<History />} 
                iconPosition="start" 
                label="Order History" 
                style={{ textTransform: 'none', fontWeight: 600 }}
              />
            </Tabs>

            {/* Current Orders Tab */}
            {tabValue === 0 && (
              <>
                {loading ? (
                  <>
                    {[...Array(3)].map((_, index) => (
                      <OrderCardSkeleton key={index} />
                    ))}
                  </>
                ) : orders.length === 0 ? (
                  <Box sx={{ textAlign: 'center', padding: { xs: '20px 12px', md: '30px 16px' } }}>
                    <Receipt sx={{ fontSize: { xs: 40, md: 50 }, color: '#ccc', marginBottom: { xs: '6px', md: '8px' } }} />
                    <Typography variant="body1" color="textSecondary" gutterBottom sx={{ fontSize: { xs: '0.85rem', md: '1rem' } }}>
                      No current orders
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                      Start shopping to place your first order!
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => navigate('/shop')}
                      style={{ marginTop: '20px', background: '#e91e63', color: '#fff', textTransform: 'none' }}
                    >
                      Browse Items
                    </Button>
                  </Box>
                ) : (
              <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow style={{ background: '#fef6ee' }}>
                      <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.7rem', md: '0.875rem' }, padding: { xs: '6px 4px', md: '16px' } }}>Order ID</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.7rem', md: '0.875rem' }, padding: { xs: '6px 4px', md: '16px' } }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.7rem', md: '0.875rem' }, padding: { xs: '6px 4px', md: '16px' } }}>Total</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.7rem', md: '0.875rem' }, padding: { xs: '6px 4px', md: '16px' } }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentOrders.map((order) => (
                      <React.Fragment key={order.id}>
                        <TableRow hover>
                          <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.7rem', md: '0.875rem' }, padding: { xs: '6px 4px', md: '16px' } }}>#{order.id}</TableCell>
                          <TableCell sx={{ fontSize: { xs: '0.65rem', md: '0.875rem' }, padding: { xs: '6px 4px', md: '16px' } }}>
                            {new Date(order.orderDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600, color: '#000000', fontSize: { xs: '0.7rem', md: '0.875rem' }, padding: { xs: '6px 4px', md: '16px' } }}>
                            ₹{order.totalAmount?.toFixed(2)}
                          </TableCell>
                          <TableCell sx={{ padding: { xs: '6px 4px', md: '16px' } }}>
                            <Chip 
                              label={order.status} 
                              color={getStatusColor(order.status)} 
                              size="small"
                              sx={{ fontWeight: 600, fontSize: { xs: '0.6rem', md: '0.75rem' }, height: { xs: '20px', md: '24px' } }}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ paddingBottom: 0, paddingTop: 0, padding: { xs: '0 4px', md: '0 16px' } }} colSpan={4}>
                              <Box sx={{ margin: { xs: '8px 0', md: '12px 0' } }}>
                                <Grid container spacing={{ xs: 1, md: 2 }}>
                                  {/* Delivery Details */}
                                  <Grid item xs={12} md={6}>
                                    <Paper sx={{ padding: { xs: '6px', md: '10px' }, background: '#fef6ee', borderRadius: '0' }}>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: { xs: '6px', md: '8px' } }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', fontSize: { xs: '0.75rem', md: '0.95rem' } }}>
                                          <Home sx={{ marginRight: { xs: '4px', md: '8px' }, color: '#ff69b4', fontSize: { xs: '16px', md: '20px' } }} />
                                          Delivery Information
                                        </Typography>
                                        {order.status !== 'Delivered' && editingOrderId !== order.id && (
                                          <IconButton 
                                            size="small" 
                                            onClick={() => handleEditAddress(order)}
                                            style={{ color: '#ff69b4' }}
                                            title="Edit Address"
                                          >
                                            <Edit fontSize="small" />
                                          </IconButton>
                                        )}
                                      </Box>

                                      {editingOrderId === order.id ? (
                                        // Edit Mode
                                        <Box>
                                          <Alert severity="info" sx={{ marginBottom: { xs: '8px', md: '12px' }, fontSize: { xs: '0.7rem', md: '13px' }, padding: { xs: '4px 8px', md: '6px 16px' } }}>
                                            <strong>Note:</strong> Delivery is only available for Coimbatore (Pincode: 641xxx)
                                          </Alert>

                                          {!editAddressMethod ? (
                                            // Show choice buttons
                                            <Box>
                                              <Typography variant="body2" sx={{ marginBottom: { xs: '8px', md: '12px' }, textAlign: 'center', fontWeight: 600, fontSize: { xs: '0.7rem', md: '0.875rem' } }}>
                                                How would you like to update your address?
                                              </Typography>
                                              
                                              <Grid container spacing={{ xs: 1, md: 2 }}>
                                                <Grid item xs={6}>
                                                  <Button
                                                    fullWidth
                                                    variant="contained"
                                                    size="small"
                                                    startIcon={<LocationOn />}
                                                    onClick={() => setShowLocationPicker(true)}
                                                    sx={{
                                                      background: '#ff69b4',
                                                      color: '#fff',
                                                      padding: { xs: '8px', md: '12px' },
                                                      textTransform: 'none',
                                                      fontWeight: 600,
                                                      fontSize: { xs: '0.7rem', md: '0.875rem' },
                                                    }}
                                                  >
                                                    Use Location
                                                  </Button>
                                                </Grid>
                                                
                                                <Grid item xs={6}>
                                                  <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<Edit />}
                                                    onClick={() => setEditAddressMethod('manual')}
                                                    sx={{
                                                      borderColor: '#ff69b4',
                                                      color: '#ff69b4',
                                                      padding: { xs: '8px', md: '12px' },
                                                      textTransform: 'none',
                                                      fontWeight: 600,
                                                      fontSize: { xs: '0.7rem', md: '0.875rem' },
                                                    }}
                                                  >
                                                    Manual Entry
                                                  </Button>
                                                </Grid>
                                              </Grid>
                                            </Box>
                                          ) : editAddressMethod === 'location' ? (
                                            <Box>
                                              <Alert severity="success" style={{ marginBottom: '12px', fontSize: '13px' }}>
                                                ✓ Using GPS Location
                                              </Alert>
                                              <Button
                                                size="small"
                                                onClick={() => {
                                                  setEditAddressMethod(null);
                                                  setEditLocationCoordinates(null);
                                                  setEditFormData(prev => ({ ...prev, doorNo: '', street: '', area: '', pincode: '' }));
                                                }}
                                                style={{ marginBottom: '12px', textTransform: 'none' }}
                                              >
                                                Change to Manual
                                              </Button>
                                            </Box>
                                          ) : (
                                            <Box>
                                              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                                <Typography variant="caption" color="textSecondary">
                                                  Manual address entry
                                                </Typography>
                                                <Button
                                                  size="small"
                                                  onClick={() => setEditAddressMethod(null)}
                                                  style={{ textTransform: 'none', fontSize: '12px' }}
                                                >
                                                  Use Location
                                                </Button>
                                              </Box>
                                            </Box>
                                          )}
                                          
                                          {editAddressMethod && (
                                          <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                              <TextField
                                                fullWidth
                                                label="Phone Number"
                                                name="deliveryPhone"
                                                value={editFormData.deliveryPhone}
                                                onChange={handleEditFormChange}
                                                variant="outlined"
                                                size="small"
                                                required
                                                InputProps={{
                                                  startAdornment: <Phone style={{ color: '#ff69b4', marginRight: '8px', fontSize: 18 }} />,
                                                }}
                                              />
                                            </Grid>
                                            
                                            {editAddressMethod === 'manual' && (
                                            <>
                                            <Grid item xs={6}>
                                              <TextField
                                                fullWidth
                                                label="Door No / Building"
                                                name="doorNo"
                                                value={editFormData.doorNo}
                                                onChange={handleEditFormChange}
                                                variant="outlined"
                                                size="small"
                                                required
                                                InputProps={{
                                                  startAdornment: <Home style={{ color: '#ff69b4', marginRight: '8px', fontSize: 18 }} />,
                                                }}
                                              />
                                            </Grid>
                                            
                                            <Grid item xs={6}>
                                              <TextField
                                                fullWidth
                                                label="Street"
                                                name="street"
                                                value={editFormData.street}
                                                onChange={handleEditFormChange}
                                                variant="outlined"
                                                size="small"
                                                required
                                              />
                                            </Grid>
                                            
                                            <Grid item xs={12}>
                                              <TextField
                                                fullWidth
                                                label="Area / Locality"
                                                name="area"
                                                value={editFormData.area}
                                                onChange={handleEditFormChange}
                                                variant="outlined"
                                                size="small"
                                                required
                                              />
                                            </Grid>
                                            
                                            <Grid item xs={6}>
                                              <TextField
                                                fullWidth
                                                label="City"
                                                name="city"
                                                value={editFormData.city}
                                                variant="outlined"
                                                size="small"
                                                disabled
                                                InputProps={{
                                                  readOnly: true,
                                                }}
                                              />
                                            </Grid>
                                            
                                            <Grid item xs={6}>
                                              <TextField
                                                fullWidth
                                                label="Pincode"
                                                name="pincode"
                                                value={editFormData.pincode}
                                                onChange={handleEditFormChange}
                                                variant="outlined"
                                                size="small"
                                                required
                                                placeholder="641xxx"
                                                inputProps={{ maxLength: 6 }}
                                              />
                                            </Grid>
                                            </>
                                            )}
                                            
                                            <Grid item xs={12}>
                                              <TextField
                                                fullWidth
                                                label="Delivery Notes (Optional)"
                                                name="deliveryNotes"
                                                value={editFormData.deliveryNotes}
                                                onChange={handleEditFormChange}
                                                variant="outlined"
                                                size="small"
                                                multiline
                                                rows={2}
                                                placeholder="Any special instructions for delivery..."
                                                InputProps={{
                                                  startAdornment: <Notes style={{ color: '#ff69b4', marginRight: '8px', fontSize: 18, alignSelf: 'flex-start', marginTop: '12px' }} />,
                                                }}
                                              />
                                            </Grid>
                                          </Grid>
                                          )}
                                          
                                          <Box style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                                            <Button
                                              variant="contained"
                                              size="small"
                                              startIcon={updating ? <CircularProgress size={16} style={{ color: '#fff' }} /> : <Save />}
                                              onClick={() => handleSaveAddress(order.id)}
                                              disabled={updating}
                                              style={{
                                                background: updating ? '#ccc' : '#4caf50',
                                                color: '#fff',
                                                textTransform: 'none',
                                                flex: 1,
                                              }}
                                            >
                                              {updating ? 'Saving...' : 'Save Changes'}
                                            </Button>
                                            <Button
                                              variant="outlined"
                                              size="small"
                                              startIcon={<Cancel />}
                                              onClick={handleCancelEdit}
                                              disabled={updating}
                                              style={{
                                                borderColor: '#f44336',
                                                color: '#f44336',
                                                textTransform: 'none',
                                                flex: 1,
                                              }}
                                            >
                                              Cancel
                                            </Button>
                                          </Box>
                                        </Box>
                                      ) : (
                                        // View Mode
                                        <>
                                          <Box sx={{ marginBottom: { xs: '8px', md: '12px' } }}>
                                            <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', marginBottom: { xs: '2px', md: '4px' }, fontSize: { xs: '0.7rem', md: '0.875rem' } }}>
                                              <Person sx={{ fontSize: { xs: 14, md: 18 }, marginRight: { xs: '4px', md: '6px' }, color: '#ff69b4' }} />
                                              Customer Name
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 500, marginLeft: { xs: '18px', md: '24px' }, fontSize: { xs: '0.75rem', md: '1rem' } }}>
                                              {order.customerName || 'N/A'}
                                            </Typography>
                                          </Box>
                                          <Box sx={{ marginBottom: { xs: '8px', md: '12px' } }}>
                                            <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', marginBottom: { xs: '2px', md: '4px' }, fontSize: { xs: '0.7rem', md: '0.875rem' } }}>
                                              <Phone sx={{ fontSize: { xs: 14, md: 18 }, marginRight: { xs: '4px', md: '6px' }, color: '#ff69b4' }} />
                                              Phone Number
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 500, marginLeft: { xs: '18px', md: '24px' }, fontSize: { xs: '0.75rem', md: '1rem' } }}>
                                              {order.deliveryPhone || 'N/A'}
                                            </Typography>
                                          </Box>
                                          <Box sx={{ marginBottom: { xs: '8px', md: '12px' } }}>
                                            <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', marginBottom: { xs: '2px', md: '4px' }, fontSize: { xs: '0.7rem', md: '0.875rem' } }}>
                                              <Home sx={{ fontSize: { xs: 14, md: 18 }, marginRight: { xs: '4px', md: '6px' }, color: '#ff69b4' }} />
                                              Delivery Address
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 500, marginLeft: { xs: '18px', md: '24px' }, fontSize: { xs: '0.7rem', md: '1rem' }, lineHeight: { xs: 1.3, md: 1.5 } }}>
                                              {order.deliveryAddress && order.deliveryAddress.startsWith('location,') 
                                                ? (order.latitude && order.longitude 
                                                    ? `📍 Lat: ${order.latitude.toFixed(6)}, Long: ${order.longitude.toFixed(6)}` 
                                                    : '📍 Location-based Delivery')
                                                : (order.deliveryAddress || 'N/A')}
                                            </Typography>
                                          </Box>
                                          {order.deliveryNotes && (
                                            <Box>
                                              <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', marginBottom: { xs: '2px', md: '4px' }, fontSize: { xs: '0.7rem', md: '0.875rem' } }}>
                                                <Notes sx={{ fontSize: { xs: 14, md: 18 }, marginRight: { xs: '4px', md: '6px' }, color: '#ff69b4' }} />
                                                Delivery Notes
                                              </Typography>
                                              <Typography variant="body1" sx={{ fontWeight: 500, marginLeft: { xs: '18px', md: '24px' }, fontStyle: 'italic', fontSize: { xs: '0.7rem', md: '1rem' } }}>
                                                {order.deliveryNotes}
                                              </Typography>
                                            </Box>
                                          )}
                                        </>
                                      )}
                                    </Paper>
                                  </Grid>

                                  {/* Order Items */}
                                  <Grid item xs={12} md={6}>
                                    <Paper sx={{ padding: { xs: '6px', md: '10px' }, background: '#fff', borderRadius: '0', border: '1px solid #e0e0e0' }}>
                                      <Typography variant="subtitle2" sx={{ fontWeight: 600, marginBottom: { xs: '6px', md: '8px' }, display: 'flex', alignItems: 'center', fontSize: { xs: '0.75rem', md: '0.95rem' } }}>
                                        <ShoppingBag sx={{ marginRight: { xs: '4px', md: '8px' }, color: '#ff69b4', fontSize: { xs: 16, md: 20 } }} />
                                        Order Items
                                      </Typography>
                                      {order.orderItems && order.orderItems.length > 0 ? (
                                        <>
                                          {order.orderItems.map((item, index) => (
                                            <Box key={index} sx={{ marginBottom: { xs: '4px', md: '6px' }, padding: { xs: '6px', md: '8px' }, background: '#f9f9f9', borderRadius: '0' }}>
                                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: { xs: '6px', md: '8px' } }}>
                                                <Box style={{ flex: 1 }}>
                                                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#333', fontSize: { xs: '0.75rem', md: '1rem' } }}>
                                                    {item.item?.name || item.itemName || 'Unknown Item'}
                                                    {!item.item && item.itemName && (
                                                      <Chip 
                                                        label="Discontinued" 
                                                        size="small" 
                                                        sx={{ marginLeft: { xs: '4px', md: '8px' }, height: { xs: '16px', md: '20px' }, fontSize: { xs: '0.6rem', md: '11px' } }}
                                                      />
                                                    )}
                                                  </Typography>
                                                  <Box style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                                                    {item.selectedWeight && (
                                                      <Chip 
                                                        label={`${item.selectedWeight} Kg`}
                                                        size="small"
                                                        sx={{ 
                                                          background: '#fff3e0',
                                                          color: '#e65100',
                                                          fontSize: { xs: '0.6rem', md: '10px' },
                                                          height: { xs: '16px', md: '20px' }
                                                        }}
                                                      />
                                                    )}
                                                    {item.eggType === 'EGGLESS' && (
                                                      <Chip 
                                                        label="🌱 Eggless"
                                                        size="small"
                                                        sx={{ 
                                                          background: '#e8f5e9',
                                                          color: '#2e7d32',
                                                          fontSize: { xs: '0.6rem', md: '10px' },
                                                          height: { xs: '16px', md: '20px' }
                                                        }}
                                                      />
                                                    )}
                                                    {item.eggType === 'EGG' && (
                                                      <Chip 
                                                        label="🥚 Egg"
                                                        size="small"
                                                        sx={{ 
                                                          background: '#fff9c4',
                                                          color: '#f57f17',
                                                          fontSize: { xs: '0.6rem', md: '10px' },
                                                          height: { xs: '16px', md: '20px' }
                                                        }}
                                                      />
                                                    )}
                                                  </Box>
                                                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block', marginTop: { xs: '3px', md: '4px' }, fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                                                    Quantity: {item.quantity} × ₹{item.price?.toFixed(2)}
                                                  </Typography>
                                                </Box>
                                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#000000', marginLeft: { xs: '8px', md: '16px' }, fontSize: { xs: '0.8rem', md: '1.25rem' } }}>
                                                  ₹{(item.price * item.quantity).toFixed(2)}
                                                </Typography>
                                              </Box>
                                            </Box>
                                          ))}
                                          <Divider sx={{ margin: { xs: '8px 0', md: '12px 0' } }} />
                                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: { xs: '6px', md: '8px' }, background: '#fff3e0', borderRadius: '0' }}>
                                            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '0.8rem', md: '1.25rem' } }}>
                                              Order Total
                                            </Typography>
                                            <Typography variant="h5" sx={{ fontWeight: 700, color: '#000000', fontSize: { xs: '0.9rem', md: '1.5rem' } }}>
                                              ₹{order.totalAmount?.toFixed(2)}
                                            </Typography>
                                          </Box>
                                        </>
                                      ) : (
                                        <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                                          No items found
                                        </Typography>
                                      )}
                                    </Paper>
                                  </Grid>
                                </Grid>
                              </Box>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {totalOrderPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: { xs: '16px', md: '24px' } }}>
                  <Pagination 
                    count={totalOrderPages} 
                    page={currentPage} 
                    onChange={handleCurrentPageChange}
                    color="primary"
                    size="medium"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: '#4a5568',
                        fontSize: { xs: '0.75rem', md: '0.875rem' },
                        minWidth: { xs: '28px', md: '32px' },
                        height: { xs: '28px', md: '32px' },
                      },
                      '& .Mui-selected': {
                        backgroundColor: '#ff69b4 !important',
                        color: '#fff !important',
                      },
                      '& .MuiPaginationItem-root:hover': {
                        backgroundColor: 'rgba(255, 105, 180, 0.1)',
                      },
                    }}
                  />
                </Box>
              )}
              </>
                )}
              </>
            )}

            {/* Order History Tab */}
            {tabValue === 1 && (
              <>
                {loading ? (
                  <>
                    {[...Array(3)].map((_, index) => (
                      <OrderCardSkeleton key={index} />
                    ))}
                  </>
                ) : orderHistory.length === 0 ? (
                  <Box sx={{ textAlign: 'center', padding: { xs: '40px 20px', md: '60px' } }}>
                    <History sx={{ fontSize: { xs: 60, md: 80 }, color: '#ccc', marginBottom: { xs: '12px', md: '20px' } }} />
                    <Typography variant="h6" color="textSecondary" gutterBottom sx={{ fontSize: { xs: '0.95rem', md: '1.25rem' } }}>
                      No order history
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                      Your completed and cancelled orders will appear here
                    </Typography>
                  </Box>
                ) : (
                  <>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow style={{ background: '#f5f5f5' }}>
                          <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.7rem', md: '0.875rem' }, padding: { xs: '6px 4px', md: '16px' } }}>Order ID</TableCell>
                          <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.7rem', md: '0.875rem' }, padding: { xs: '6px 4px', md: '16px' } }}>Date</TableCell>
                          <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.7rem', md: '0.875rem' }, padding: { xs: '6px 4px', md: '16px' } }}>Total</TableCell>
                          <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.7rem', md: '0.875rem' }, padding: { xs: '6px 4px', md: '16px' } }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.7rem', md: '0.875rem' }, padding: { xs: '6px 4px', md: '16px' } }}>Details</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {currentHistory.map((order) => (
                          <React.Fragment key={order.id}>
                            <TableRow hover>
                              <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.7rem', md: '0.875rem' }, padding: { xs: '6px 4px', md: '16px' } }}>#{order.id}</TableCell>
                              <TableCell sx={{ fontSize: { xs: '0.65rem', md: '0.875rem' }, padding: { xs: '6px 4px', md: '16px' } }}>
                                {new Date(order.orderDate).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </TableCell>
                              <TableCell sx={{ fontWeight: 600, color: '#000000', fontSize: { xs: '0.7rem', md: '0.875rem' }, padding: { xs: '6px 4px', md: '16px' } }}>
                                ₹{order.totalAmount?.toFixed(2)}
                              </TableCell>
                              <TableCell sx={{ padding: { xs: '6px 4px', md: '16px' } }}>
                                <Chip 
                                  icon={order.status === 'Delivered' ? <CheckCircle /> : null}
                                  label={order.status} 
                                  color={order.status === 'Delivered' ? 'success' : 'default'}
                                  size="small"
                                  sx={{ fontSize: { xs: '0.6rem', md: '0.75rem' }, height: { xs: '20px', md: '24px' } }}
                                />
                              </TableCell>
                              <TableCell sx={{ padding: { xs: '6px 4px', md: '16px' } }}>
                                <IconButton
                                  size="small"
                                  onClick={() => toggleHistoryOrderDetails(order.id)}
                                  style={{ color: '#ff69b4' }}
                                >
                                  {expandedHistoryOrder === order.id ? <ExpandLess /> : <ExpandMore />}
                                </IconButton>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell colSpan={5} sx={{ padding: 0 }}>
                                <Collapse in={expandedHistoryOrder === order.id} timeout="auto" unmountOnExit>
                                  <Box style={{ padding: '20px', background: '#fafafa' }}>
                                    <Grid container spacing={2}>
                                      <Grid item xs={12} md={6}>
                                        <Paper style={{ padding: '16px' }}>
                                          <Typography variant="subtitle2" style={{ fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                                            <Person style={{ marginRight: '8px', fontSize: '20px' }} />
                                            Delivery Information
                                          </Typography>
                                          <Typography variant="body2" style={{ marginBottom: '8px' }}>
                                            <strong>Name:</strong> {order.customerName}
                                          </Typography>
                                          <Typography variant="body2" style={{ marginBottom: '8px', display: 'flex', alignItems: 'start' }}>
                                            <Home style={{ marginRight: '8px', fontSize: '18px', marginTop: '2px' }} />
                                            {order.deliveryAddress && order.deliveryAddress.startsWith('location,') 
                                              ? (order.latitude && order.longitude 
                                                  ? `📍 Lat: ${order.latitude.toFixed(6)}, Long: ${order.longitude.toFixed(6)}` 
                                                  : '📍 Location-based Delivery')
                                              : (order.deliveryAddress || 'N/A')}
                                          </Typography>
                                          <Typography variant="body2" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                                            <Phone style={{ marginRight: '8px', fontSize: '18px' }} />
                                            {order.deliveryPhone}
                                          </Typography>
                                          {order.deliveryNotes && (
                                            <Typography variant="body2" style={{ display: 'flex', alignItems: 'start' }}>
                                              <Notes style={{ marginRight: '8px', fontSize: '18px', marginTop: '2px' }} />
                                              {order.deliveryNotes}
                                            </Typography>
                                          )}
                                        </Paper>
                                      </Grid>
                                      <Grid item xs={12} md={6}>
                                        <Paper style={{ padding: '10px', background: '#fff', borderRadius: '0', border: '1px solid #e0e0e0' }}>
                                          <Typography variant="subtitle2" style={{ fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', fontSize: '0.95rem' }}>
                                            <ShoppingBag style={{ marginRight: '8px', color: '#ff69b4' }} />
                                            Order Items
                                          </Typography>
                                          {order.orderItems && order.orderItems.length > 0 ? (
                                            <>
                                              {order.orderItems.map((item, index) => (
                                                <Box key={index} style={{ marginBottom: '6px', padding: '8px', background: '#f9f9f9', borderRadius: '0' }}>
                                                  <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                                                    <Box style={{ flex: 1 }}>
                                                      <Typography variant="body1" style={{ fontWeight: 600, color: '#333' }}>
                                                        {item.itemName}
                                                      </Typography>
                                                      <Box style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                                                        {item.selectedWeight && (
                                                          <Chip 
                                                            label={`${item.selectedWeight} Kg`}
                                                            size="small"
                                                            style={{ 
                                                              background: '#fff3e0',
                                                              color: '#e65100',
                                                              fontSize: '10px',
                                                              height: '20px'
                                                            }}
                                                          />
                                                        )}
                                                        {item.eggType === 'EGGLESS' && (
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
                                                        {item.eggType === 'EGG' && (
                                                          <Chip 
                                                            label="🥚 Egg"
                                                            size="small"
                                                            style={{ 
                                                              background: '#fff9c4',
                                                              color: '#f57f17',
                                                              fontSize: '10px',
                                                              height: '20px'
                                                            }}
                                                          />
                                                        )}
                                                      </Box>
                                                      <Typography variant="caption" color="textSecondary" style={{ display: 'block', marginTop: '4px' }}>
                                                        Quantity: {item.quantity} × ₹{item.price?.toFixed(2)}
                                                      </Typography>
                                                    </Box>
                                                    <Typography variant="h6" style={{ fontWeight: 700, color: '#000000', marginLeft: '16px' }}>
                                                      ₹{(item.price * item.quantity).toFixed(2)}
                                                    </Typography>
                                                  </Box>
                                                </Box>
                                              ))}
                                              <Divider style={{ margin: '12px 0' }} />
                                              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: '#fff3e0', borderRadius: '0' }}>
                                                <Typography variant="h6" style={{ fontWeight: 700 }}>
                                                  Order Total
                                                </Typography>
                                                <Typography variant="h5" style={{ fontWeight: 700, color: '#000000' }}>
                                                  ₹{order.totalAmount?.toFixed(2)}
                                                </Typography>
                                              </Box>
                                            </>
                                          ) : (
                                            <Typography variant="body2" color="textSecondary">
                                              No items found
                                            </Typography>
                                          )}
                                        </Paper>
                                      </Grid>
                                    </Grid>
                                  </Box>
                                </Collapse>
                              </TableCell>
                            </TableRow>
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {totalHistoryPages > 1 && (
                    <Box style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                      <Pagination 
                        count={totalHistoryPages} 
                        page={historyPage} 
                        onChange={handleHistoryPageChange}
                        color="primary"
                        size="large"
                        sx={{
                          '& .MuiPaginationItem-root': {
                            color: '#4a5568',
                          },
                          '& .Mui-selected': {
                            backgroundColor: '#ff69b4 !important',
                            color: '#fff !important',
                          },
                          '& .MuiPaginationItem-root:hover': {
                            backgroundColor: 'rgba(255, 105, 180, 0.1)',
                          },
                        }}
                      />
                    </Box>
                  )}
                  </>
                )}
              </>
            )}
          </Paper>

          {orders.length > 0 && (
            <Paper style={{ padding: '20px', borderRadius: '0', background: '#fff', textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                Need help with an order? Contact our support team.
              </Typography>
            </Paper>
          )}
        </Container>
      </Box>

      {/* Location Picker Dialog */}
      <LocationPicker
        open={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onSelectLocation={handleLocationSelectInEdit}
      />
      
      <Footer />
    </Box>
  );
};

export default Orders;
