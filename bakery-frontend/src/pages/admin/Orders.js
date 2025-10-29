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
    
    // Optimistic update - immediately update UI
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    
    try {
      await orderAPI.updateStatus(orderId, { status: newStatus });
      
      // Find the order to get customer ID
      const order = orders.find(o => o.id === orderId);
      const customerId = order?.customer?.id;
      
      // Send notification to customer based on status
      if (customerId) {
        if (newStatus === 'Confirmed') {
          notifyCustomerOrderConfirmed(customerId, orderId);
        } else if (newStatus === 'Packed') {
          // Notify customer that order is packed and ready
          notifyCustomerOrderPacked(customerId, orderId);
        } else if (newStatus === 'Out for Delivery') {
          notifyCustomerOrderOutForDelivery(customerId, orderId);
        } else if (newStatus === 'Delivered') {
          notifyCustomerOrderDelivered(customerId, orderId);
          // Also notify admin that order was delivered
          notifyAdminOrderDelivered(user.id, orderId);
        }
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
      <AdminHeader title="Order Management" showBack={true} />
      <AdminSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <Box style={{ minHeight: '100vh', background: '#f5f5f5', paddingTop: '80px', paddingBottom: '40px', marginLeft: sidebarOpen ? '260px' : '70px', transition: 'margin-left 0.3s ease' }}>
        <Container maxWidth="lg">
          {success && <Alert severity="success" style={{ marginBottom: '20px' }}>{success}</Alert>}
          {error && <Alert severity="error" style={{ marginBottom: '20px' }}>{error}</Alert>}

          <Paper style={{ padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
            <Box style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" style={{ fontWeight: 600 }}>
                All Orders
              </Typography>
              <Button
                variant="contained"
                startIcon={refreshing ? <CircularProgress size={16} style={{ color: '#fff' }} /> : <Refresh />}
                onClick={handleRefresh}
                disabled={refreshing}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
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
            ) : (
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
