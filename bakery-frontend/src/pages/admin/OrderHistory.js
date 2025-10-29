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
  CircularProgress,
  Chip,
  IconButton,
  Collapse,
  Divider,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Person,
  Phone,
  Home,
  Notes,
  ShoppingBag,
  History,
  CalendarToday,
  Search,
  FilterList,
  Clear,
  Payment,
} from '@mui/icons-material';
import { orderHistoryAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import AdminHeader from '../../components/AdminHeader';
import AdminSidebar from '../../components/AdminSidebar';
import { showSuccess, showError } from '../../utils/toast';

const OrderHistory = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      const response = await orderHistoryAPI.getAll();
      if (response.data) {
        // Sort by most recent first
        const sortedHistory = (response.data || []).sort((a, b) => 
          new Date(b.deliveredDate) - new Date(a.deliveredDate)
        );
        setOrderHistory(sortedHistory);
      }
    } catch (err) {
      console.error('Error fetching order history:', err);
      if (err.response?.status === 404) {
        setOrderHistory([]);
      } else {
        setError('Failed to fetch order history');
        showError('Failed to fetch order history');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMigrateDelivered = async () => {
    try {
      setLoading(true);
      await orderHistoryAPI.migrateDelivered();
      setSuccess('Delivered orders migrated to history successfully');
      showSuccess('Delivered orders migrated to history successfully');
      fetchOrderHistory();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to migrate delivered orders');
      showError('Failed to migrate delivered orders');
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getPlaceholderText = () => {
    switch (filterType) {
      case 'orderId':
        return 'Search by Order ID...';
      case 'customerName':
        return 'Search by Customer Name...';
      case 'address':
        return 'Search by Delivery Address...';
      case 'item':
        return 'Search by Item Name...';
      default:
        return 'Search by Order ID, Name, Address, or Item...';
    }
  };

  const filterOrders = (order) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    
    switch (filterType) {
      case 'orderId':
        return order.id?.toString().includes(query);
      case 'customerName':
        return order.customerName?.toLowerCase().includes(query);
      case 'address':
        return order.deliveryAddress?.toLowerCase().includes(query);
      case 'item':
        return order.orderItems?.some(item => 
          item.itemName?.toLowerCase().includes(query)
        );
      case 'all':
      default:
        return (
          order.id?.toString().includes(query) ||
          order.customerName?.toLowerCase().includes(query) ||
          order.customerPhone?.toLowerCase().includes(query) ||
          order.deliveryAddress?.toLowerCase().includes(query) ||
          order.orderItems?.some(item => 
            item.itemName?.toLowerCase().includes(query)
          )
        );
    }
  };

  // Pagination logic
  const filteredOrders = orderHistory.filter(filterOrders);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    setExpandedOrder(null); // Close any expanded order when changing pages
  };

  return (
    <>
      <AdminHeader title="Order History" showBack={true} onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
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

          <Paper style={{ padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
            <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <Box style={{ display: 'flex', alignItems: 'center' }}>
                <History style={{ fontSize: 32, color: '#1976d2', marginRight: '12px' }} />
                <Typography variant="h5" style={{ fontWeight: 600 }}>
                  Delivered Orders History
                </Typography>
              </Box>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleMigrateDelivered}
                disabled={loading}
                style={{ textTransform: 'none' }}
              >
                Migrate Delivered Orders
              </Button>
            </Box>

            <Alert severity="info" style={{ marginBottom: '20px' }}>
              This page shows all delivered orders that have been moved to the history table. 
              These orders are archived and cannot be modified.
            </Alert>

            {/* Filter and Search Bar */}
            <Grid container spacing={2} style={{ marginBottom: '20px' }}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Filter By</InputLabel>
                  <Select
                    value={filterType}
                    label="Filter By"
                    onChange={(e) => setFilterType(e.target.value)}
                    style={{ background: '#fff' }}
                  >
                    <MenuItem value="all">
                      <Box display="flex" alignItems="center">
                        <FilterList style={{ marginRight: '8px', fontSize: '18px' }} />
                        All Fields
                      </Box>
                    </MenuItem>
                    <MenuItem value="orderId">
                      <Box display="flex" alignItems="center">
                        <ShoppingBag style={{ marginRight: '8px', fontSize: '18px' }} />
                        Order ID
                      </Box>
                    </MenuItem>
                    <MenuItem value="customerName">
                      <Box display="flex" alignItems="center">
                        <Person style={{ marginRight: '8px', fontSize: '18px' }} />
                        Customer Name
                      </Box>
                    </MenuItem>
                    <MenuItem value="address">
                      <Box display="flex" alignItems="center">
                        <Home style={{ marginRight: '8px', fontSize: '18px' }} />
                        Address
                      </Box>
                    </MenuItem>
                    <MenuItem value="item">
                      <Box display="flex" alignItems="center">
                        <ShoppingBag style={{ marginRight: '8px', fontSize: '18px' }} />
                        Item Name
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={7}>
                <TextField
                  fullWidth
                  placeholder={getPlaceholderText()}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <Search style={{ marginRight: '8px', color: '#666' }} />,
                  }}
                  size="small"
                  style={{ background: '#fff' }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Clear />}
                  onClick={() => {
                    setSearchQuery('');
                    setFilterType('all');
                  }}
                  style={{ height: '40px' }}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>

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
                      <TableCell style={{ fontWeight: 600 }}>Customer</TableCell>
                      <TableCell style={{ fontWeight: 600 }}>Order Date</TableCell>
                      <TableCell style={{ fontWeight: 600 }}>Delivered Date</TableCell>
                      <TableCell style={{ fontWeight: 600 }}>Total Amount</TableCell>
                      <TableCell style={{ fontWeight: 600 }}>Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                          <Typography variant="body1" color="textSecondary">
                            {searchQuery ? 'No orders found matching your search.' : 'No order history available.'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentOrders.map((order) => (
                          <React.Fragment key={order.id}>
                            <TableRow hover>
                              <TableCell style={{ fontWeight: 600 }}>#{order.id}</TableCell>
                              <TableCell>{order.customerName}</TableCell>
                              <TableCell>
                                {new Date(order.orderDate).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                {new Date(order.deliveredDate).toLocaleDateString()}
                              </TableCell>
                              <TableCell style={{ fontWeight: 600, color: '#000000' }}>
                                ₹{order.totalAmount?.toFixed(2)}
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
                                              {order.deliveryAddress || 'N/A'}
                                            </Typography>
                                            {order.latitude && order.longitude && (
                                              <Typography variant="caption" color="primary" style={{ marginLeft: '24px', marginTop: '4px', display: 'block', fontWeight: 600 }}>
                                                📍 GPS Coordinates: Lat {order.latitude.toFixed(6)}, Long {order.longitude.toFixed(6)}
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
                                          <Divider style={{ margin: '15px 0' }} />
                                          <Box>
                                            <Typography variant="body2" color="textSecondary" style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                                              <CalendarToday style={{ fontSize: 18, marginRight: '6px', color: '#1976d2' }} />
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
                                            <ShoppingBag style={{ marginRight: '8px', color: '#1976d2' }} />
                                            Order Items
                                          </Typography>
                                          {order.orderItems && order.orderItems.length > 0 ? (
                                            <>
                                              {order.orderItems.map((item, index) => {
                                                console.log('Order History Item:', item.itemName, 'eggType:', item.eggType, 'selectedWeight:', item.selectedWeight);
                                                return (
                                                <Box key={index} style={{ marginBottom: '12px', padding: '12px', background: '#f9f9f9', borderRadius: '8px' }}>
                                                  <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                                                    <Box style={{ flex: 1 }}>
                                                      <Typography variant="body1" style={{ fontWeight: 600, color: '#333' }}>
                                                        {item.itemName}
                                                      </Typography>
                                                      {(item.selectedWeight || item.eggType) && (
                                                        <Box style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
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
                                                        </Box>
                                                      )}
                                                      <Typography variant="caption" color="textSecondary" style={{ display: 'block', marginTop: '6px' }}>
                                                        Quantity: {item.quantity} × ₹{item.price?.toFixed(2)}
                                                      </Typography>
                                                    </Box>
                                                    <Typography variant="h6" style={{ fontWeight: 700, color: '#000000', marginLeft: '16px' }}>
                                                      ₹{(item.price * item.quantity).toFixed(2)}
                                                    </Typography>
                                                  </Box>
                                                </Box>
                                                );
                                              })}
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
            
            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <Box style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                <Pagination 
                  count={totalPages} 
                  page={currentPage} 
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: '#4a5568',
                    },
                    '& .Mui-selected': {
                      backgroundColor: '#1976d2 !important',
                      color: '#fff !important',
                    },
                  }}
                />
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default OrderHistory;
