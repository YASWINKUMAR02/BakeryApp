import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { customerAPI, orderAPI, orderHistoryAPI } from '../../services/api';
import AdminHeader from '../../components/AdminHeader';
import AdminSidebar from '../../components/AdminSidebar';
import { showError } from '../../utils/toast';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await customerAPI.getAll();
      if (response.data.success) {
        setCustomers(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch customers');
      showError('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerClick = async (customer) => {
    setSelectedCustomer(customer);
    setDialogOpen(true);
    setLoadingOrders(true);
    
    try {
      // Fetch both active orders and order history
      const [ordersResponse, historyResponse] = await Promise.all([
        orderAPI.getByCustomer(customer.id),
        orderHistoryAPI.getByCustomer(customer.id)
      ]);
      
      const activeOrders = ordersResponse.data.success ? ordersResponse.data.data : [];
      const historyOrders = historyResponse.data || [];
      
      // Combine and sort by date
      const allOrders = [...activeOrders, ...historyOrders].sort((a, b) => 
        new Date(b.orderDate) - new Date(a.orderDate)
      );
      
      setCustomerOrders(allOrders);
    } catch (err) {
      console.error('Error fetching customer orders:', err);
      showError('Failed to load customer orders');
      setCustomerOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedCustomer(null);
    setCustomerOrders([]);
  };

  const handleOrderClick = async (order) => {
    setOrderDetailsOpen(true);
    setLoadingOrderDetails(true);
    
    console.log('Clicked order:', order);
    
    try {
      const response = await orderAPI.getById(order.id);
      console.log('Order details full response:', response);
      console.log('Order details data:', response.data);
      console.log('Order details items:', response.data?.data?.items);
      
      if (response.data.success && response.data.data) {
        const orderData = response.data.data;
        console.log('Setting order with items:', orderData.items);
        setSelectedOrder(orderData);
      } else {
        // If API call fails, use the order data we already have
        console.log('Using fallback order data');
        setSelectedOrder(order);
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      console.error('Error details:', err.response?.data);
      // Use the order data we already have from the list
      setSelectedOrder(order);
    } finally {
      setLoadingOrderDetails(false);
    }
  };

  const handleCloseOrderDetails = () => {
    setOrderDetailsOpen(false);
    setSelectedOrder(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Confirmed':
        return 'info';
      case 'Shipped':
        return 'primary';
      case 'Delivered':
        return 'success';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <>
      <AdminHeader title="Customer Management" showBack={true} onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
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
          {error && <Alert severity="error" style={{ marginBottom: '20px' }}>{error}</Alert>}

          <Paper style={{ padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
            <Box style={{ marginBottom: '20px' }}>
              <Typography variant="h5" style={{ fontWeight: 600 }}>
                All Customers
              </Typography>
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
                      <TableCell style={{ fontWeight: 600 }}>ID</TableCell>
                      <TableCell style={{ fontWeight: 600 }}>Name</TableCell>
                      <TableCell style={{ fontWeight: 600 }}>Email</TableCell>
                      <TableCell style={{ fontWeight: 600 }}>Phone</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {customers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" style={{ padding: '40px' }}>
                          No customers found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      customers.map((customer) => (
                        <TableRow key={customer.id} hover>
                          <TableCell>{customer.id}</TableCell>
                          <TableCell>
                            <Typography
                              style={{
                                color: '#1976d2',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                              onClick={() => handleCustomerClick(customer)}
                            >
                              {customer.name}
                            </Typography>
                          </TableCell>
                          <TableCell>{customer.email}</TableCell>
                          <TableCell>{customer.phone}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Container>
      </Box>

      {/* Customer Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}>
          Customer Details
        </DialogTitle>
        <DialogContent style={{ paddingTop: '20px' }}>
          {selectedCustomer && (
            <>
              {/* Customer Info */}
              <Grid container spacing={2} style={{ marginBottom: '24px' }}>
                <Grid item xs={12} sm={6}>
                  <Card style={{ background: '#f5f9ff' }}>
                    <CardContent>
                      <Typography variant="body2" color="textSecondary">Name</Typography>
                      <Typography variant="h6" style={{ fontWeight: 600 }}>{selectedCustomer.name}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card style={{ background: '#f5f9ff' }}>
                    <CardContent>
                      <Typography variant="body2" color="textSecondary">Email</Typography>
                      <Typography variant="h6" style={{ fontWeight: 600, fontSize: '16px' }}>{selectedCustomer.email}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card style={{ background: '#f5f9ff' }}>
                    <CardContent>
                      <Typography variant="body2" color="textSecondary">Phone</Typography>
                      <Typography variant="h6" style={{ fontWeight: 600 }}>{selectedCustomer.phone || 'N/A'}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card style={{ background: '#f5f9ff' }}>
                    <CardContent>
                      <Typography variant="body2" color="textSecondary">Customer ID</Typography>
                      <Typography variant="h6" style={{ fontWeight: 600 }}>#{selectedCustomer.id}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Divider style={{ marginBottom: '20px' }} />

              {/* Orders Section */}
              <Typography variant="h6" style={{ fontWeight: 600, marginBottom: '16px' }}>
                Order History ({customerOrders.length})
              </Typography>

              {loadingOrders ? (
                <Box style={{ textAlign: 'center', padding: '40px' }}>
                  <CircularProgress />
                </Box>
              ) : customerOrders.length === 0 ? (
                <Box style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  <Typography variant="body2">No orders found for this customer</Typography>
                </Box>
              ) : (
                <TableContainer component={Paper} style={{ maxHeight: '400px' }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ fontWeight: 600, background: '#f5f7fa' }}>Order ID</TableCell>
                        <TableCell style={{ fontWeight: 600, background: '#f5f7fa' }}>Date</TableCell>
                        <TableCell style={{ fontWeight: 600, background: '#f5f7fa' }}>Amount</TableCell>
                        <TableCell style={{ fontWeight: 600, background: '#f5f7fa' }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {customerOrders.map((order) => (
                        <TableRow 
                          key={order.id} 
                          hover
                          onClick={() => handleOrderClick(order)}
                          style={{ cursor: 'pointer' }}
                        >
                          <TableCell style={{ fontWeight: 600, color: '#1976d2' }}>#{order.id}</TableCell>
                          <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                          <TableCell style={{ fontWeight: 600 }}>₹{order.totalAmount?.toFixed(2) || '0.00'}</TableCell>
                          <TableCell>
                            <Chip
                              label={order.status}
                              color={getStatusColor(order.status)}
                              size="small"
                              style={{ fontWeight: 600, borderRadius: 0 }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions style={{ padding: '16px 24px' }}>
          <Button onClick={handleCloseDialog} style={{ textTransform: 'none' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog
        open={orderDetailsOpen}
        onClose={handleCloseOrderDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: '#fff' }}>
          Order Details - #{selectedOrder?.id}
        </DialogTitle>
        <DialogContent style={{ paddingTop: '20px' }}>
          {loadingOrderDetails ? (
            <Box style={{ textAlign: 'center', padding: '40px' }}>
              <CircularProgress />
            </Box>
          ) : selectedOrder && (
            <>
              {/* Order Info */}
              <Grid container spacing={2} style={{ marginBottom: '24px' }}>
                <Grid item xs={12} sm={6}>
                  <Card style={{ background: '#f5f9ff' }}>
                    <CardContent>
                      <Typography variant="body2" color="textSecondary">Order Date</Typography>
                      <Typography variant="h6" style={{ fontWeight: 600 }}>
                        {new Date(selectedOrder.orderDate).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card style={{ background: '#f5f9ff' }}>
                    <CardContent>
                      <Typography variant="body2" color="textSecondary">Status</Typography>
                      <Chip
                        label={selectedOrder.status}
                        color={getStatusColor(selectedOrder.status)}
                        style={{ fontWeight: 600, marginTop: '8px', borderRadius: 0 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card style={{ background: '#f5f9ff' }}>
                    <CardContent>
                      <Typography variant="body2" color="textSecondary">Customer Name</Typography>
                      <Typography variant="h6" style={{ fontWeight: 600 }}>{selectedOrder.customerName}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card style={{ background: '#f5f9ff' }}>
                    <CardContent>
                      <Typography variant="body2" color="textSecondary">Phone</Typography>
                      <Typography variant="h6" style={{ fontWeight: 600 }}>{selectedOrder.deliveryPhone || 'N/A'}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card style={{ background: '#f5f9ff' }}>
                    <CardContent>
                      <Typography variant="body2" color="textSecondary">Delivery Address</Typography>
                      <Typography variant="body1" style={{ fontWeight: 500, marginTop: '4px' }}>
                        {selectedOrder.deliveryAddress}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                {selectedOrder.deliveryNotes && (
                  <Grid item xs={12}>
                    <Card style={{ background: '#fff3e0' }}>
                      <CardContent>
                        <Typography variant="body2" color="textSecondary">Delivery Notes</Typography>
                        <Typography variant="body1" style={{ fontWeight: 500, marginTop: '4px' }}>
                          {selectedOrder.deliveryNotes}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>

              <Divider style={{ marginBottom: '20px' }} />

              {/* Order Items */}
              <Typography variant="h6" style={{ fontWeight: 600, marginBottom: '16px' }}>
                Order Items
              </Typography>

              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow style={{ background: '#f5f7fa' }}>
                        <TableCell style={{ fontWeight: 600 }}>Item</TableCell>
                        <TableCell style={{ fontWeight: 600 }}>Type</TableCell>
                        <TableCell style={{ fontWeight: 600 }}>Price</TableCell>
                        <TableCell style={{ fontWeight: 600 }}>Quantity</TableCell>
                        <TableCell style={{ fontWeight: 600 }}>Subtotal</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrder.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell style={{ fontWeight: 500 }}>{item.itemName}</TableCell>
                          <TableCell>
                            <Chip 
                              label={item.isEggless ? '🌱 Eggless' : 'Regular'} 
                              size="small"
                              style={{ 
                                background: item.isEggless ? '#4caf50' : '#2196f3',
                                color: '#fff',
                                borderRadius: 0,
                                fontWeight: 600
                              }}
                            />
                          </TableCell>
                          <TableCell style={{ fontWeight: 500 }}>₹{item.price?.toFixed(2)}</TableCell>
                          <TableCell style={{ fontWeight: 600 }}>{item.quantity}</TableCell>
                          <TableCell style={{ fontWeight: 700, color: '#000000' }}>₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow style={{ background: '#f5f7fa' }}>
                        <TableCell colSpan={4} align="right" style={{ fontWeight: 700, fontSize: '16px' }}>
                          Total Amount:
                        </TableCell>
                        <TableCell style={{ fontWeight: 700, fontSize: '16px', color: '#000000' }}>
                          ₹{selectedOrder.totalAmount?.toFixed(2) || '0.00'}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box>
                  <Card style={{ background: '#e3f2fd', padding: '24px', textAlign: 'center', marginBottom: '16px' }}>
                    <Typography variant="h5" style={{ fontWeight: 700, color: '#1976d2', marginBottom: '8px' }}>
                      ₹{selectedOrder.totalAmount?.toFixed(2) || '0.00'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Order Total
                    </Typography>
                  </Card>
                  <Card style={{ background: '#fff3e0', padding: '16px', textAlign: 'center' }}>
                    <Typography variant="body2" style={{ color: '#666' }}>
                      💡 Item details are not stored in order history. Only active orders show item breakdown.
                    </Typography>
                  </Card>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions style={{ padding: '16px 24px' }}>
          <Button onClick={handleCloseOrderDetails} style={{ textTransform: 'none' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Customers;
