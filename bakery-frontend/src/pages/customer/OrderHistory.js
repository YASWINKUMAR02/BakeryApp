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
  CircularProgress,
  Alert,
  IconButton,
  Collapse,
  Divider,
  Grid,
  Chip,
} from '@mui/material';
import {
  History,
  ExpandMore,
  ExpandLess,
  Person,
  Phone,
  Home,
  Notes,
  ShoppingBag,
  CalendarToday,
  CheckCircle,
} from '@mui/icons-material';
import { orderHistoryAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import CustomerHeader from '../../components/CustomerHeader';

const OrderHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      const response = await orderHistoryAPI.getByCustomer(user.id);
      if (response.data) {
        setOrderHistory(response.data);
      }
    } catch (err) {
      console.error('Error fetching order history:', err);
      if (err.response?.status === 404) {
        setOrderHistory([]);
      } else {
        setError('Failed to fetch order history');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <>
      <CustomerHeader />

      <Box style={{ minHeight: '100vh', background: '#f5f5f5', paddingTop: '80px', paddingBottom: '40px' }}>
        <Container maxWidth="lg">
          {error && <Alert severity="error" style={{ marginBottom: '20px' }}>{error}</Alert>}

          <Paper style={{ padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
            <Box style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <History style={{ fontSize: 32, color: '#ff6b35', marginRight: '12px' }} />
              <Typography variant="h5" style={{ fontWeight: 600 }}>
                Delivered Orders
              </Typography>
            </Box>

            <Alert severity="success" style={{ marginBottom: '20px', background: '#e8f5e9' }}>
              <Box style={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircle style={{ marginRight: '8px' }} />
                These are your successfully delivered orders. Thank you for shopping with us!
              </Box>
            </Alert>

            {loading ? (
              <Box style={{ textAlign: 'center', padding: '40px' }}>
                <CircularProgress style={{ color: '#ff6b35' }} />
              </Box>
            ) : orderHistory.length === 0 ? (
              <Box style={{ textAlign: 'center', padding: '60px' }}>
                <History style={{ fontSize: 80, color: '#ccc', marginBottom: '20px' }} />
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No delivered orders yet
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Your delivered orders will appear here once they are completed.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/shop')}
                  style={{ marginTop: '20px', background: '#ff6b35', color: '#fff', textTransform: 'none' }}
                >
                  Continue Shopping
                </Button>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow style={{ background: '#fef6ee' }}>
                      <TableCell style={{ fontWeight: 600 }}>Order ID</TableCell>
                      <TableCell style={{ fontWeight: 600 }}>Order Date</TableCell>
                      <TableCell style={{ fontWeight: 600 }}>Delivered Date</TableCell>
                      <TableCell style={{ fontWeight: 600 }}>Total Amount</TableCell>
                      <TableCell style={{ fontWeight: 600 }}>Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderHistory.map((order) => (
                      <React.Fragment key={order.id}>
                        <TableRow hover>
                          <TableCell style={{ fontWeight: 600 }}>#{order.id}</TableCell>
                          <TableCell>
                            {new Date(order.orderDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </TableCell>
                          <TableCell>
                            <Box style={{ display: 'flex', alignItems: 'center' }}>
                              <CheckCircle style={{ fontSize: 18, color: '#4caf50', marginRight: '6px' }} />
                              {new Date(order.deliveredDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </Box>
                          </TableCell>
                          <TableCell style={{ fontWeight: 600, color: '#ff6b35' }}>
                            ₹{order.totalAmount?.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              size="small" 
                              onClick={() => toggleOrderDetails(order.id)}
                              style={{ color: '#ff6b35' }}
                            >
                              {expandedOrder === order.id ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                            <Collapse in={expandedOrder === order.id} timeout="auto" unmountOnExit>
                              <Box style={{ margin: '20px 0' }}>
                                <Grid container spacing={3}>
                                  {/* Delivery Details */}
                                  <Grid item xs={12} md={6}>
                                    <Paper style={{ padding: '20px', background: '#fef6ee', borderRadius: '8px' }}>
                                      <Typography variant="h6" style={{ fontWeight: 600, marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                                        <Home style={{ marginRight: '8px', color: '#ff6b35' }} />
                                        Delivery Information
                                      </Typography>
                                      <Box style={{ marginBottom: '12px' }}>
                                        <Typography variant="body2" color="textSecondary" style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                                          <Person style={{ fontSize: 18, marginRight: '6px', color: '#ff6b35' }} />
                                          Customer Name
                                        </Typography>
                                        <Typography variant="body1" style={{ fontWeight: 500, marginLeft: '24px' }}>
                                          {order.customerName || 'N/A'}
                                        </Typography>
                                      </Box>
                                      <Box style={{ marginBottom: '12px' }}>
                                        <Typography variant="body2" color="textSecondary" style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                                          <Phone style={{ fontSize: 18, marginRight: '6px', color: '#ff6b35' }} />
                                          Phone Number
                                        </Typography>
                                        <Typography variant="body1" style={{ fontWeight: 500, marginLeft: '24px' }}>
                                          {order.deliveryPhone || 'N/A'}
                                        </Typography>
                                      </Box>
                                      <Box style={{ marginBottom: '12px' }}>
                                        <Typography variant="body2" color="textSecondary" style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                                          <Home style={{ fontSize: 18, marginRight: '6px', color: '#ff6b35' }} />
                                          Delivery Address
                                        </Typography>
                                        <Typography variant="body1" style={{ fontWeight: 500, marginLeft: '24px' }}>
                                          {order.deliveryAddress && order.deliveryAddress.startsWith('location,') 
                                            ? (order.latitude && order.longitude 
                                                ? `📍 Lat: ${order.latitude.toFixed(6)}, Long: ${order.longitude.toFixed(6)}` 
                                                : '📍 Location-based Delivery')
                                            : (order.deliveryAddress || 'N/A')}
                                        </Typography>
                                      </Box>
                                      {order.deliveryNotes && (
                                        <Box style={{ marginBottom: '12px' }}>
                                          <Typography variant="body2" color="textSecondary" style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                                            <Notes style={{ fontSize: 18, marginRight: '6px', color: '#ff6b35' }} />
                                            Delivery Notes
                                          </Typography>
                                          <Typography variant="body1" style={{ fontWeight: 500, marginLeft: '24px', fontStyle: 'italic' }}>
                                            {order.deliveryNotes}
                                          </Typography>
                                        </Box>
                                      )}
                                      <Divider style={{ margin: '15px 0' }} />
                                      <Box>
                                        <Typography variant="body2" color="textSecondary" style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                                          <CalendarToday style={{ fontSize: 18, marginRight: '6px', color: '#ff6b35' }} />
                                          Delivered On
                                        </Typography>
                                        <Typography variant="body1" style={{ fontWeight: 500, marginLeft: '24px' }}>
                                          {new Date(order.deliveredDate).toLocaleString()}
                                        </Typography>
                                      </Box>
                                    </Paper>
                                  </Grid>

                                  {/* Order Items */}
                                  <Grid item xs={12} md={6}>
                                    <Paper style={{ padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                                      <Typography variant="h6" style={{ fontWeight: 600, marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                                        <ShoppingBag style={{ marginRight: '8px', color: '#ff6b35' }} />
                                        Order Items
                                      </Typography>
                                      {order.orderItems && order.orderItems.length > 0 ? (
                                        order.orderItems.map((item, index) => (
                                          <Box key={index} style={{ marginBottom: '12px' }}>
                                            <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                              <Typography variant="body1" style={{ fontWeight: 500 }}>
                                                {item.itemName}
                                              </Typography>
                                              <Typography variant="body2" color="textSecondary">
                                                x{item.quantity}
                                              </Typography>
                                            </Box>
                                            <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                                              <Typography variant="body2" color="textSecondary">
                                                ₹{item.price?.toFixed(2)} each
                                              </Typography>
                                              <Typography variant="body1" style={{ fontWeight: 600, color: '#000000' }}>
                                                ₹{(item.price * item.quantity).toFixed(2)}
                                              </Typography>
                                            </Box>
                                            {index < order.orderItems.length - 1 && <Divider style={{ marginTop: '12px' }} />}
                                          </Box>
                                        ))
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
            )}
          </Paper>

          {orderHistory.length > 0 && (
            <Paper style={{ padding: '20px', borderRadius: '12px', background: '#fff', textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                Thank you for being a valued customer! We hope you enjoyed your orders.
              </Typography>
            </Paper>
          )}
        </Container>
      </Box>
    </>
  );
};

export default OrderHistory;
