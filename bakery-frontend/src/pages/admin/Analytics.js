import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  CurrencyRupee,
  Inventory,
} from '@mui/icons-material';
import AdminHeader from '../../components/AdminHeader';
import AdminSidebar from '../../components/AdminSidebar';
import { orderAPI, orderHistoryAPI } from '../../services/api';
import { showError } from '../../utils/toast';

const Analytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [topItems, setTopItems] = useState([]);
  const [stats, setStats] = useState({
    totalItemsSold: 0,
    totalRevenue: 0,
    totalOrders: 0,
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch all orders and order history
      const [ordersResponse, historyResponse] = await Promise.all([
        orderAPI.getAll(),
        orderHistoryAPI.getAll()
      ]);

      const allOrders = [
        ...(ordersResponse.data.success ? ordersResponse.data.data : []),
        ...(historyResponse.data || [])
      ];

      // Calculate item statistics
      const itemStats = {};
      let totalItemsSold = 0;
      let totalRevenue = 0;

      allOrders.forEach(order => {
        if (order.orderItems && Array.isArray(order.orderItems)) {
          order.orderItems.forEach(item => {
            const itemName = item.itemName || 'Unknown Item';
            const quantity = item.quantity || 0;
            const price = item.price || 0;
            const revenue = quantity * price;

            if (!itemStats[itemName]) {
              itemStats[itemName] = {
                name: itemName,
                totalQuantity: 0,
                totalRevenue: 0,
                orderCount: 0,
              };
            }

            itemStats[itemName].totalQuantity += quantity;
            itemStats[itemName].totalRevenue += revenue;
            itemStats[itemName].orderCount += 1;
            totalItemsSold += quantity;
            totalRevenue += revenue;
          });
        }
      });

      // Convert to array and sort by quantity
      const sortedItems = Object.values(itemStats)
        .sort((a, b) => b.totalQuantity - a.totalQuantity);

      setTopItems(sortedItems);
      setStats({
        totalItemsSold,
        totalRevenue,
        totalOrders: allOrders.length,
      });

    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to fetch analytics data');
      showError('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Items Sold',
      value: stats.totalItemsSold,
      icon: <ShoppingCart style={{ fontSize: '40px', color: '#fff' }} />,
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      bgColor: '#667eea',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toFixed(2)}`,
      icon: <CurrencyRupee style={{ fontSize: '40px', color: '#fff' }} />,
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      bgColor: '#f5576c',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: <Inventory style={{ fontSize: '40px', color: '#fff' }} />,
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      bgColor: '#4facfe',
    },
    {
      title: 'Unique Items',
      value: topItems.length,
      icon: <TrendingUp style={{ fontSize: '40px', color: '#fff' }} />,
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      bgColor: '#43e97b',
    },
  ];

  return (
    <>
      <AdminHeader title="Sales Analytics" showBack={true} onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
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

          {/* Statistics Cards */}
          <Grid container spacing={3} style={{ marginBottom: '30px' }}>
            {statCards.map((card, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card style={{ 
                  padding: '20px', 
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
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
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="body2" style={{ color: '#666', fontWeight: 600, marginBottom: '8px', fontSize: '13px' }}>
                          {card.title}
                        </Typography>
                        <Typography variant="h4" style={{ fontWeight: 700, color: '#1a1a2e' }}>
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
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Top Selling Items Table */}
          <Paper style={{ padding: '20px', borderRadius: '12px' }}>
            <Box style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <TrendingUp style={{ fontSize: 32, color: '#1976d2', marginRight: '12px' }} />
              <Typography variant="h5" style={{ fontWeight: 600 }}>
                Most Bought Items
              </Typography>
            </Box>

            <Alert severity="info" style={{ marginBottom: '20px' }}>
              This shows all items sorted by total quantity sold across all orders.
            </Alert>

            {loading ? (
              <Box style={{ textAlign: 'center', padding: '40px' }}>
                <CircularProgress />
              </Box>
            ) : topItems.length === 0 ? (
              <Box style={{ textAlign: 'center', padding: '40px' }}>
                <Typography variant="body1" color="textSecondary">
                  No sales data available yet.
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow style={{ background: '#f5f7fa' }}>
                      <TableCell style={{ fontWeight: 600 }}>Rank</TableCell>
                      <TableCell style={{ fontWeight: 600 }}>Item Name</TableCell>
                      <TableCell style={{ fontWeight: 600 }} align="right">Total Quantity Sold</TableCell>
                      <TableCell style={{ fontWeight: 600 }} align="right">Times Ordered</TableCell>
                      <TableCell style={{ fontWeight: 600 }} align="right">Total Revenue</TableCell>
                      <TableCell style={{ fontWeight: 600 }} align="right">Avg. per Order</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topItems.map((item, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Box
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: index < 3 ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e0e0e0',
                              color: index < 3 ? '#fff' : '#666',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                            }}
                          >
                            {index + 1}
                          </Box>
                        </TableCell>
                        <TableCell style={{ fontWeight: 600, color: '#1a1a2e' }}>
                          {item.name}
                        </TableCell>
                        <TableCell align="right" style={{ fontWeight: 700, color: '#1976d2', fontSize: '16px' }}>
                          {item.totalQuantity}
                        </TableCell>
                        <TableCell align="right" style={{ color: '#666' }}>
                          {item.orderCount}
                        </TableCell>
                        <TableCell align="right" style={{ fontWeight: 600, color: '#4caf50' }}>
                          ₹{item.totalRevenue.toFixed(2)}
                        </TableCell>
                        <TableCell align="right" style={{ color: '#666' }}>
                          {(item.totalQuantity / item.orderCount).toFixed(1)}
                        </TableCell>
                      </TableRow>
                    ))}
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

export default Analytics;
