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
  Alert,
  AppBar,
  Toolbar,
  CircularProgress,
  Chip,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Collapse,
  Divider,
  Grid,
  TextField,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Person,
  Phone,
  Home,
  Notes,
  ShoppingBag,
  Search,
  Refresh,
  Payment,
} from '@mui/icons-material';
import { orderAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import AdminHeader from '../../components/AdminHeader';
import AdminSidebar from '../../components/AdminSidebar';
import { notifyCustomerOrderConfirmed, notifyCustomerOrderPacked, notifyCustomerOrderOutForDelivery, notifyCustomerOrderDelivered, notifyAdminOrderDelivered } from '../../utils/notificationUtils';
import { showSuccess, showError } from '../../utils/toast';

const Orders = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getAll();
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch orders');
      showError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await orderAPI.getAll();
      if (response.data.success) {
        setOrders(response.data.data);
        showSuccess('Orders refreshed successfully!');
      }
    } catch (err) {
      showError('Failed to refresh orders');
    } finally {
      setRefreshing(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    
    // Find the order BEFORE updating to get customer ID
    const order = orders.find(o => o.id === orderId);
    const customerId = order?.customer?.id;
    
    console.log('🔍 Order details:', { orderId, customerId, customerName: order?.customer?.name, newStatus });
    
    // Optimistic update - immediately update UI
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    
    try {
      await orderAPI.updateStatus(orderId, { status: newStatus });
      
      // Send notification to customer based on status
      if (customerId) {
        console.log('📤 Sending notification to customer:', customerId, 'for order:', orderId, 'status:', newStatus);
        try {
          if (newStatus === 'Confirmed') {
            await notifyCustomerOrderConfirmed(customerId, orderId);
          } else if (newStatus === 'Packed') {
            // Notify customer that order is packed and ready
            await notifyCustomerOrderPacked(customerId, orderId);
          } else if (newStatus === 'Out for Delivery') {
            await notifyCustomerOrderOutForDelivery(customerId, orderId);
          } else if (newStatus === 'Delivered') {
            await notifyCustomerOrderDelivered(customerId, orderId);
            // Also notify admin that order was delivered
            await notifyAdminOrderDelivered(user.id, orderId);
          }
          console.log('✅ Notification sent successfully');
        } catch (notifError) {
          console.error('❌ Failed to send notification:', notifError);
          // Don't fail the status update if notification fails
        }
      } else {
        console.warn('⚠️ No customer ID found for order:', orderId);
      }
      
      showSuccess(`Order #${orderId} status updated to ${newStatus}`);
      // Refresh to get latest data from server
      await fetchOrders();
    } catch (err) {
      // Revert optimistic update on error
      await fetchOrders();
      showError('Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
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

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <>
      <AdminHeader title="Order Management" showBack={true} onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <AdminSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <Box sx={{ 
        minHeight: '100vh', 
        background: '#f5f5f5', 
        paddingTop: { xs: '70px', sm: '80px' }, 
        paddingBottom: { xs: '20px', sm: '40px' },
        paddingLeft: { xs: '8px', sm: '16px' },
        paddingRight: { xs: '8px', sm: '16px' },
        marginLeft: { xs: 0, md: sidebarOpen ? '260px' : '70px' },
        transition: 'margin-left 0.3s ease'
      }}>
        <Container maxWidth="lg">
          {success && <Alert severity="success" style={{ marginBottom: '20px' }}>{success}</Alert>}
          {error && <Alert severity="error" style={{ marginBottom: '20px' }}>{error}</Alert>}

          <Paper sx={{ padding: { xs: '12px', sm: '20px' }, borderRadius: '12px', marginBottom: '20px' }}>
            <Box sx={{ 
              marginBottom: '20px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: { xs: 'flex-start', sm: 'center' },
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: '12px', sm: '0' }
            }}>
              <Typography variant="h5" sx={{ fontWeight: 600, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                All Orders
              </Typography>
              <Button
                variant="contained"
                startIcon={refreshing ? <CircularProgress size={16} style={{ color: '#fff' }} /> : <Refresh />}
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </Box>
            
            {/* Search Bar */}
            <Box style={{ marginBottom: '20px', marginTop: '20px' }}>
              <TextField
                fullWidth
                placeholder="Search by Order ID or Customer Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <Search style={{ marginRight: '8px', color: '#666' }} />,
                }}
                size="small"
                style={{ background: '#fff' }}
              />
            </Box>

            {loading ? (
              <Box style={{ textAlign: 'center', padding: '40px' }}>
                <CircularProgress />
              </Box>
            ) : isMobile ? (
              // Mobile Card View
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {orders.length === 0 ? (
                  <Typography align="center" sx={{ padding: '40px', color: '#666' }}>
                    No orders found.
                  </Typography>
                ) : (
                  orders
                    .filter(order => 
                      order.id.toString().includes(searchQuery) ||
                      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((order) => (
                      <Card key={order.id} sx={{ borderRadius: '8px', boxShadow: 2 }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                                Order #{order.id}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {new Date(order.orderDate).toLocaleDateString()}
                              </Typography>
                            </Box>
                            <Chip 
                              label={order.status} 
                              color={getStatusColor(order.status)} 
                              size="small" 
                            />
                          </Box>

                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Customer:</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {order.customerName}
                              </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Total Amount:</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                                ₹{order.totalAmount?.toFixed(2)}
                              </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Payment:</Typography>
                              <Chip 
                                label="Online (Razorpay)" 
                                size="small" 
                                color="success"
                                sx={{ fontSize: '0.75rem' }}
                              />
                            </Box>
                          </Box>

                          <Divider sx={{ my: 2 }} />

                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                              Update Status:
                            </Typography>
                            <FormControl fullWidth size="small">
                              <Select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                disabled={updatingOrderId === order.id}
                              >
                                <MenuItem value="Confirmed">Confirmed</MenuItem>
                                <MenuItem value="Packed">Packed</MenuItem>
                                <MenuItem value="Out for Delivery">Out for Delivery</MenuItem>
                                <MenuItem value="Delivered">Delivered</MenuItem>
                              </Select>
                            </FormControl>
                            {updatingOrderId === order.id && (
                              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                                <CircularProgress size={20} />
                              </Box>
                            )}
                          </Box>

                          <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => toggleOrderDetails(order.id)}
                            endIcon={expandedOrder === order.id ? <ExpandLess /> : <ExpandMore />}
                            sx={{ textTransform: 'none' }}
                          >
                            {expandedOrder === order.id ? 'Hide Details' : 'View Details'}
                          </Button>

                          <Collapse in={expandedOrder === order.id} timeout="auto" unmountOnExit>
                            <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f7fa', borderRadius: '8px' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center' }}>
                                <Home style={{ marginRight: '8px', fontSize: '18px' }} />
                                Delivery Information
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 0.5 }}>
                                <strong>Address:</strong> {order.deliveryAddress && order.deliveryAddress.startsWith('location,') 
                                  ? (order.latitude && order.longitude 
                                      ? `📍 GPS Location: Lat ${order.latitude.toFixed(6)}, Long ${order.longitude.toFixed(6)}` 
                                      : '📍 Location-based Delivery')
                                  : (order.deliveryAddress || 'N/A')}
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 0.5 }}>
                                <strong>Phone:</strong> {order.deliveryPhone || order.phoneNumber || 'N/A'}
                              </Typography>
                              {order.deliveryNotes && (
                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                  <strong>Notes:</strong> {order.deliveryNotes}
                                </Typography>
                              )}
                              <Typography variant="body2" sx={{ mb: 0.5 }}>
                                <strong>Payment:</strong> 💳 Online Payment (Razorpay)
                              </Typography>
                              {order.paymentId && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 2 }}>
                                  Payment ID: {order.paymentId}
                                </Typography>
                              )}
                              {order.paymentVerified && (
                                <Typography variant="caption" sx={{ display: 'block', ml: 2, color: '#28a745', fontWeight: 600 }}>
                                  ✓ Payment Verified
                                </Typography>
                              )}

                              <Divider sx={{ my: 2 }} />

                              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center' }}>
                                <ShoppingBag style={{ marginRight: '8px', fontSize: '18px' }} />
                                Order Items
                              </Typography>
                              {(order.orderItems || order.items)?.map((item, idx) => (
                                <Box key={idx} sx={{ mb: 1, p: 1, bgcolor: 'white', borderRadius: '4px' }}>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {item.item?.name || item.itemName || 'Unknown Item'}
                                  </Typography>
                                  {item.selectedWeight && (
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                      Weight: {item.selectedWeight} Kg
                                    </Typography>
                                  )}
                                  {item.eggless && (
                                    <Typography variant="caption" sx={{ display: 'block', color: '#4caf50' }}>
                                      🌱 Eggless
                                    </Typography>
                                  )}
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                    <Typography variant="caption" color="text.secondary">
                                      Qty: {item.quantity} × ₹{item.price?.toFixed(2)}
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                      ₹{(item.quantity * item.price)?.toFixed(2)}
                                    </Typography>
                                  </Box>
                                </Box>
                              ))}
                            </Box>
                          </Collapse>
                        </CardContent>
                      </Card>
                    ))
                )}
              </Box>
            ) : (
              // Desktop Table View
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow style={{ background: '#f5f7fa' }}>
                      <TableCell style={{ fontWeight: 600 }}>Order ID</TableCell>
                      <TableCell style={{ fontWeight: 600 }}>Date</TableCell>
                      <TableCell style={{ fontWeight: 600 }}>Total Amount</TableCell>
                      <TableCell style={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell style={{ fontWeight: 600 }}>Update Status</TableCell>
                      <TableCell style={{ fontWeight: 600 }}>Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" style={{ padding: '40px' }}>
                          No orders found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      orders
                        .filter(order => 
                          order.id.toString().includes(searchQuery) ||
                          order.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((order) => (
                        <React.Fragment key={order.id}>
                          <TableRow hover>
                            <TableCell>#{order.id}</TableCell>
                            <TableCell>
                              {new Date(order.orderDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>₹{order.totalAmount?.toFixed(2)}</TableCell>
                            <TableCell>
                              <Chip 
                                label={order.status} 
                                color={getStatusColor(order.status)} 
                                size="small" 
                              />
                            </TableCell>
                            <TableCell>
                              <FormControl size="small" style={{ minWidth: 120 }}>
                                <Select
                                  value={order.status}
                                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                  disabled={updatingOrderId === order.id}
                                  style={{ 
                                    opacity: updatingOrderId === order.id ? 0.6 : 1,
                                    cursor: updatingOrderId === order.id ? 'wait' : 'pointer'
                                  }}
                                >
                                  <MenuItem value="Confirmed">Confirmed</MenuItem>
                                  <MenuItem value="Packed">Packed</MenuItem>
                                  <MenuItem value="Out for Delivery">Out for Delivery</MenuItem>
                                  <MenuItem value="Delivered">Delivered</MenuItem>
                                </Select>
                              </FormControl>
                              {updatingOrderId === order.id && (
                                <CircularProgress 
                                  size={16} 
                                  style={{ marginLeft: '8px', verticalAlign: 'middle' }} 
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              <IconButton 
                                size="small" 
                                onClick={() => toggleOrderDetails(order.id)}
                                color="primary"
                              >
                                {expandedOrder === order.id ? <ExpandLess /> : <ExpandMore />}
                              </IconButton>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                              <Collapse in={expandedOrder === order.id} timeout="auto" unmountOnExit>
                                <Box style={{ margin: '20px 0' }}>
                                  <Grid container spacing={3}>
                                    {/* Delivery Details */}
                                    <Grid item xs={12} md={6}>
                                      <Paper style={{ padding: '20px', background: '#f5f7fa', borderRadius: '8px' }}>
                                        <Typography variant="h6" style={{ fontWeight: 600, marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                                          <Home style={{ marginRight: '8px', color: '#1976d2' }} />
                                          Delivery Information
                                        </Typography>
                                        <Box style={{ marginBottom: '12px' }}>
                                          <Typography variant="body2" color="textSecondary" style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                                            <Person style={{ fontSize: 18, marginRight: '6px', color: '#1976d2' }} />
                                            Customer Name
                                          </Typography>
                                          <Typography variant="body1" style={{ fontWeight: 500, marginLeft: '24px' }}>
                                            {order.customerName || 'N/A'}
                                          </Typography>
                                        </Box>
                                        <Box style={{ marginBottom: '12px' }}>
                                          <Typography variant="body2" color="textSecondary" style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                                            <Phone style={{ fontSize: 18, marginRight: '6px', color: '#1976d2' }} />
                                            Phone Number
                                          </Typography>
                                          <Typography variant="body1" style={{ fontWeight: 500, marginLeft: '24px' }}>
                                            {order.deliveryPhone || 'N/A'}
                                          </Typography>
                                        </Box>
                                        <Box style={{ marginBottom: '12px' }}>
                                          <Typography variant="body2" color="textSecondary" style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                                            <Home style={{ fontSize: 18, marginRight: '6px', color: '#1976d2' }} />
                                            Delivery Address
                                          </Typography>
                                          <Typography variant="body1" style={{ fontWeight: 500, marginLeft: '24px', wordBreak: 'break-word' }}>
                                            {order.deliveryAddress && order.deliveryAddress.startsWith('location,') 
                                              ? (order.latitude && order.longitude 
                                                  ? `📍 GPS Location: Lat ${order.latitude.toFixed(6)}, Long ${order.longitude.toFixed(6)}` 
                                                  : '📍 Location-based Delivery')
                                              : (order.deliveryAddress || 'N/A')}
                                          </Typography>
                                          {order.latitude && order.longitude && !order.deliveryAddress?.startsWith('location,') && (
                                            <Typography variant="caption" color="primary" style={{ marginLeft: '24px', marginTop: '4px', display: 'block', fontWeight: 600 }}>
                                              📍 GPS: {order.latitude.toFixed(6)}, {order.longitude.toFixed(6)}
                                            </Typography>
                                          )}
                                        </Box>
                                        {order.deliveryNotes && (
                                          <Box style={{ marginBottom: '12px' }}>
                                            <Typography variant="body2" color="textSecondary" style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                                              <Notes style={{ fontSize: 18, marginRight: '6px', color: '#1976d2' }} />
                                              Delivery Notes
                                            </Typography>
                                            <Typography variant="body1" style={{ fontWeight: 500, marginLeft: '24px', fontStyle: 'italic' }}>
                                              {order.deliveryNotes}
                                            </Typography>
                                          </Box>
                                        )}
                                        <Box style={{ marginBottom: '12px' }}>
                                          <Typography variant="body2" color="textSecondary" style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                                            <Payment style={{ fontSize: 18, marginRight: '6px', color: '#1976d2' }} />
                                            Payment Method
                                          </Typography>
                                          <Typography variant="body1" style={{ fontWeight: 500, marginLeft: '24px' }}>
                                            💳 Online Payment (Razorpay)
                                          </Typography>
                                          {order.paymentId && (
                                            <Typography variant="caption" style={{ marginLeft: '24px', marginTop: '4px', display: 'block', color: '#666' }}>
                                              Payment ID: {order.paymentId}
                                            </Typography>
                                          )}
                                          {order.paymentVerified && (
                                            <Typography variant="caption" style={{ marginLeft: '24px', marginTop: '2px', display: 'block', color: '#28a745', fontWeight: 600 }}>
                                              ✓ Payment Verified
                                            </Typography>
                                          )}
                                        </Box>
                                      </Paper>
                                    </Grid>

                                    {/* Order Items */}
                                    <Grid item xs={12} md={6}>
                                      <Paper style={{ padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                                        <Typography variant="h6" style={{ fontWeight: 600, marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                                          <ShoppingBag style={{ marginRight: '8px', color: '#1976d2' }} />
                                          Order Items
                                        </Typography>
                                        {order.orderItems && order.orderItems.length > 0 ? (
                                          <>
                                            {order.orderItems.map((item, index) => (
                                              <Box key={index} style={{ marginBottom: '12px', padding: '12px', background: '#f9f9f9', borderRadius: '8px' }}>
                                                <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                                                  <Box style={{ flex: 1 }}>
                                                    <Typography variant="body1" style={{ fontWeight: 600, color: '#333' }}>
                                                      {item.item?.name || item.itemName || 'Unknown Item'}
                                                      {!item.item && item.itemName && (
                                                        <Chip 
                                                          label="Deleted" 
                                                          size="small" 
                                                          color="error"
                                                          style={{ marginLeft: '8px', height: '20px', fontSize: '11px' }}
                                                        />
                                                      )}
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
                                            <Divider style={{ margin: '16px 0' }} />
                                            <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#e3f2fd', borderRadius: '8px' }}>
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
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default Orders;
