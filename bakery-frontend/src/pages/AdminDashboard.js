import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
} from '@mui/material';
import { 
  Category,
  Inventory,
  People,
  ShoppingCart,
  History,
  TrendingUp,
  CurrencyRupee,
  LocalShipping,
  CheckCircle,
  Schedule,
  Assessment,
  WavingHand,
  Bolt,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AdminHeader from '../components/AdminHeader';
import AdminSidebar from '../components/AdminSidebar';
import axios from 'axios';
import { toast } from 'react-toastify';

const MotionCard = motion(Card);
const MotionPaper = motion(Paper);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/admin/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        const data = response.data.data;
        console.log('Dashboard stats:', data); // Debug log
        
        // If confirmedOrders is not provided, calculate from pendingOrders or set to 0
        if (data.confirmedOrders === undefined && data.pendingOrders !== undefined) {
          data.confirmedOrders = data.pendingOrders;
        }
        
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    background: '#f5f5f5',
    paddingTop: '80px',
    paddingBottom: '40px',
  };

  const statCardStyle = {
    padding: '24px',
    borderRadius: '12px',
    background: '#ffffff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  };

  const navCardStyle = {
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    height: '100%',
    cursor: 'pointer',
    background: '#ffffff',
    transition: 'all 0.3s ease',
  };

  const iconStyle = {
    fontSize: '48px',
    marginBottom: '16px',
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: stats ? `₹${stats.totalRevenue?.toFixed(2) || '0.00'}` : '₹0.00',
      icon: <CurrencyRupee style={{ fontSize: '40px', color: '#fff' }} />,
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      bgColor: '#667eea',
    },
    {
      title: "Today's Revenue",
      value: stats ? `₹${stats.todayRevenue?.toFixed(2) || '0.00'}` : '₹0.00',
      icon: <CurrencyRupee style={{ fontSize: '40px', color: '#fff' }} />,
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      bgColor: '#f5576c',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: <ShoppingCart style={{ fontSize: '40px', color: '#fff' }} />,
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      bgColor: '#4facfe',
    },
    {
      title: 'Confirmed Orders',
      value: stats?.confirmedOrders || 0,
      icon: <Schedule style={{ fontSize: '40px', color: '#fff' }} />,
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      bgColor: '#fa709a',
    },
    {
      title: 'Delivered Orders',
      value: stats?.deliveredOrders || 0,
      icon: <CheckCircle style={{ fontSize: '40px', color: '#fff' }} />,
      color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      bgColor: '#30cfd0',
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers || 0,
      icon: <People style={{ fontSize: '40px', color: '#fff' }} />,
      color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      bgColor: '#a8edea',
    },
    {
      title: 'Total Items',
      value: stats?.totalItems || 0,
      icon: <Inventory style={{ fontSize: '40px', color: '#fff' }} />,
      color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      bgColor: '#fcb69f',
    },
    {
      title: 'Categories',
      value: stats?.totalCategories || 0,
      icon: <Category style={{ fontSize: '40px', color: '#fff' }} />,
      color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      bgColor: '#ff9a9e',
    },
  ];

  const navigationCards = [
    {
      title: 'Categories',
      description: 'Manage product categories',
      icon: <Category style={{ ...iconStyle, color: '#667eea' }} />,
      path: '/admin/categories',
    },
    {
      title: 'Items',
      description: 'Manage bakery items',
      icon: <Inventory style={{ ...iconStyle, color: '#f5576c' }} />,
      path: '/admin/items',
    },
    {
      title: 'Orders',
      description: 'View and manage orders',
      icon: <ShoppingCart style={{ ...iconStyle, color: '#4facfe' }} />,
      path: '/admin/orders',
    },
    {
      title: 'Customers',
      description: 'View all customers',
      icon: <People style={{ ...iconStyle, color: '#fa709a' }} />,
      path: '/admin/customers',
    },
    {
      title: 'Order History',
      description: 'View delivered orders',
      icon: <History style={{ ...iconStyle, color: '#30cfd0' }} />,
      path: '/admin/order-history',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'DELIVERED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <>
        <AdminHeader title="Admin Dashboard" onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <AdminSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <Box sx={{
          minHeight: '100vh',
          background: '#f5f5f5',
          paddingTop: { xs: '70px', sm: '80px' },
          paddingBottom: { xs: '20px', sm: '40px' },
          paddingLeft: { xs: '8px', sm: '16px' },
          paddingRight: { xs: '8px', sm: '16px' },
          marginLeft: { xs: 0, md: sidebarOpen ? '260px' : '70px' },
          transition: 'margin-left 0.3s ease',
        }}>
          <Container maxWidth="xl">
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
              <CircularProgress size={60} />
            </Box>
          </Container>
        </Box>
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Admin Dashboard" onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <AdminSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <Box sx={{
        minHeight: '100vh',
        background: '#f5f5f5',
        paddingTop: { xs: '70px', sm: '80px' },
        paddingBottom: { xs: '20px', sm: '40px' },
        paddingLeft: { xs: '8px', sm: '16px' },
        paddingRight: { xs: '8px', sm: '16px' },
        marginLeft: { xs: 0, md: sidebarOpen ? '260px' : '70px' },
        transition: 'margin-left 0.3s ease',
      }}>
        <Container maxWidth="xl">
          {/* Welcome Section */}
          <MotionPaper
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            elevation={0}
            style={{
              padding: '30px',
              borderRadius: '12px',
              marginBottom: '30px',
              background: '#ffffff',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
              <Box>
                <Typography
                  variant="h4"
                  gutterBottom
                  style={{
                    fontWeight: 700,
                    color: '#1a1a2e',
                    marginBottom: '8px',
                  }}
                >
                  <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Welcome back, {user?.name}!
                    <WavingHand style={{ color: '#ff6b35' }} />
                  </Box>
                </Typography>
                <Typography variant="body1" style={{ color: '#666', fontSize: '16px' }}>
                  {user?.email} • Admin Dashboard
                </Typography>
              </Box>
              <Box textAlign="right">
                <Typography variant="body2" style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>
                  Today
                </Typography>
                <Typography variant="h6" style={{ color: '#ff6b35', fontWeight: 600 }}>
                  {new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Typography>
              </Box>
            </Box>
          </MotionPaper>

          {/* Statistics Cards */}
          <Typography
            variant="h5"
            style={{
              color: '#1a1a2e',
              fontWeight: 700,
              marginBottom: '20px',
            }}
          >
            <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Assessment style={{ color: '#1976d2' }} />
              Business Overview
            </Box>
          </Typography>
          <Grid container spacing={3} style={{ marginBottom: '30px' }}>
            {statCards.map((card, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  style={statCardStyle}
                >
                  <Box
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '100px',
                      height: '100px',
                      background: card.color,
                      borderRadius: '0 12px 0 100%',
                      opacity: 0.1,
                    }}
                  />
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography
                        variant="body2"
                        style={{ color: '#666', fontWeight: 600, marginBottom: '8px', fontSize: '13px' }}
                      >
                        {card.title}
                      </Typography>
                      <Typography
                        variant="h4"
                        style={{ fontWeight: 700, color: '#1a1a2e' }}
                      >
                        {card.value}
                      </Typography>
                    </Box>
                    <Box
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '12px',
                        background: card.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 4px 12px ${card.bgColor}40`,
                      }}
                    >
                      {card.icon}
                    </Box>
                  </Box>
                </MotionCard>
              </Grid>
            ))}
          </Grid>

          {/* Recent Orders */}
          {stats?.recentOrders && stats.recentOrders.length > 0 && (
            <MotionPaper
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              style={{
                padding: '24px',
                borderRadius: '12px',
                marginBottom: '30px',
                background: '#ffffff',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Typography
                variant="h6"
                style={{ fontWeight: 700, marginBottom: '20px', color: '#1a1a2e' }}
              >
                <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingCart style={{ color: '#1976d2' }} />
                  Recent Orders
                </Box>
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow style={{ background: '#f5f7fa' }}>
                      <TableCell style={{ fontWeight: 600 }}>Order ID</TableCell>
                      <TableCell style={{ fontWeight: 600 }}>Customer</TableCell>
                      <TableCell style={{ fontWeight: 600 }}>Amount</TableCell>
                      <TableCell style={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell style={{ fontWeight: 600 }}>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.recentOrders.map((order) => (
                      <TableRow key={order.orderId} hover>
                        <TableCell style={{ fontWeight: 600, color: '#1976d2' }}>#{order.orderId}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell style={{ fontWeight: 600 }}>₹{order.totalAmount}</TableCell>
                        <TableCell>
                          <Chip
                            label={order.status}
                            color={getStatusColor(order.status)}
                            size="small"
                            style={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell style={{ color: '#666' }}>{order.orderDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </MotionPaper>
          )}

          {/* Quick Actions */}
          <Typography
            variant="h5"
            style={{
              color: '#1a1a2e',
              fontWeight: 700,
              marginBottom: '20px',
            }}
          >
            <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bolt style={{ color: '#ff9800' }} />
              Quick Actions
            </Box>
          </Typography>
          <Grid container spacing={3}>
            {navigationCards.map((card, index) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                <MotionCard
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -8 }}
                  style={navCardStyle}
                  onClick={() => navigate(card.path)}
                >
                  <CardContent>
                    {card.icon}
                    <Typography variant="h6" gutterBottom style={{ fontWeight: 600 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {card.description}
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default AdminDashboard;
