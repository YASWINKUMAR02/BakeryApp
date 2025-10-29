import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  Button,
  Tabs,
  Tab,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  People,
  Inventory,
  AttachMoney,
  Warning,
  Star,
  Download,
  CalendarToday,
  CurrencyRupee,
  Dashboard,
  ShowChart,
} from '@mui/icons-material';
import AdminHeader from '../../components/AdminHeader';
import AdminSidebar from '../../components/AdminSidebar';
import { analyticsAPI } from '../../services/api';
import { showError, showSuccess } from '../../utils/toast';

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [revenueTab, setRevenueTab] = useState(0); // 0=daily, 1=weekly, 2=monthly

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      showError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    showSuccess('PDF export feature coming soon!');
  };

  const exportToExcel = () => {
    if (!analytics) return;
    
    // Create CSV rows
    const rows = [];
    
    // Sales Overview Section
    rows.push(['SALES OVERVIEW']);
    rows.push(['']);
    rows.push(['Metric', 'Value']);
    rows.push(['Total Orders', analytics.salesOverview.totalOrders]);
    rows.push(['Today Orders', analytics.salesOverview.todayOrders]);
    rows.push(['Week Orders', analytics.salesOverview.weekOrders]);
    rows.push(['Month Orders', analytics.salesOverview.monthOrders]);
    rows.push(['Total Revenue', `Rs ${analytics.salesOverview.totalRevenue.toFixed(2)}`]);
    rows.push(['Today Revenue', `Rs ${analytics.salesOverview.todayRevenue.toFixed(2)}`]);
    rows.push(['Week Revenue', `Rs ${analytics.salesOverview.weekRevenue.toFixed(2)}`]);
    rows.push(['Month Revenue', `Rs ${analytics.salesOverview.monthRevenue.toFixed(2)}`]);
    rows.push(['Average Order Value', `Rs ${analytics.salesOverview.averageOrderValue.toFixed(2)}`]);
    rows.push(['']);
    
    // Popular Items Section
    rows.push(['POPULAR ITEMS']);
    rows.push(['']);
    rows.push(['Rank', 'Item Name', 'Quantity Sold', 'Revenue', 'Order Count']);
    analytics.popularItems.forEach((item, index) => {
      rows.push([
        index + 1,
        item.itemName,
        item.totalQuantitySold,
        `Rs ${item.totalRevenue.toFixed(2)}`,
        item.orderCount
      ]);
    });
    rows.push(['']);
    
    // Customer Insights Section
    rows.push(['CUSTOMER INSIGHTS']);
    rows.push(['']);
    rows.push(['Metric', 'Value']);
    rows.push(['Total Customers', analytics.customerInsights.totalCustomers]);
    rows.push(['Repeat Customers', analytics.customerInsights.repeatCustomers]);
    rows.push(['Repeat Customer Rate', `${analytics.customerInsights.repeatCustomerRate.toFixed(2)}%`]);
    rows.push(['New Customers This Month', analytics.customerInsights.newCustomersThisMonth]);
    rows.push(['']);
    
    // Top Customers Section
    rows.push(['TOP CUSTOMERS']);
    rows.push(['']);
    rows.push(['Rank', 'Customer Name', 'Email', 'Total Orders', 'Total Spent']);
    analytics.customerInsights.topCustomers.forEach((customer, index) => {
      rows.push([
        index + 1,
        customer.customerName,
        customer.email || 'N/A',
        customer.totalOrders,
        `Rs ${customer.totalSpent.toFixed(2)}`
      ]);
    });
    rows.push(['']);
    
    // Low Stock Items Section
    if (analytics.lowStockItems.length > 0) {
      rows.push(['LOW STOCK ALERT']);
      rows.push(['']);
      rows.push(['Item Name', 'Category', 'Current Stock', 'Threshold']);
      analytics.lowStockItems.forEach(item => {
        rows.push([
          item.itemName,
          item.category,
          item.currentStock,
          item.threshold
        ]);
      });
    }
    
    // Convert to CSV format
    const csvContent = rows.map(row => 
      row.map(cell => {
        // Escape quotes and wrap in quotes if contains comma
        const cellStr = String(cell);
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(',')
    ).join('\n');
    
    // Create and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `bakery_analytics_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showSuccess('Analytics exported to CSV successfully!');
  };

  if (loading) {
    return (
      <>
        <AdminHeader title="Analytics Dashboard" onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <AdminSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <Box sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          marginLeft: { xs: 0, md: sidebarOpen ? '260px' : '70px' },
          transition: 'margin-left 0.3s ease'
        }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (!analytics) {
    return (
      <>
        <AdminHeader title="Analytics Dashboard" onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <AdminSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <Box sx={{ 
          minHeight: '100vh', 
          paddingTop: { xs: '70px', sm: '100px' },
          paddingBottom: { xs: '20px', sm: '40px' },
          paddingLeft: { xs: '8px', sm: '20px' },
          paddingRight: { xs: '8px', sm: '20px' },
          marginLeft: { xs: 0, md: sidebarOpen ? '260px' : '70px' },
          transition: 'margin-left 0.3s ease'
        }}>
          <Alert severity="error">Failed to load analytics data</Alert>
        </Box>
      </>
    );
  }

  const { salesOverview, revenueData, popularItems, customerInsights, lowStockItems } = analytics;

  return (
    <>
      <AdminHeader title="Analytics Dashboard" onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
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
        <Container maxWidth="xl">
          {/* Header with Export Buttons */}
          <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <Typography variant="h4" style={{ fontWeight: 700, color: '#1976d2', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Dashboard style={{ fontSize: '36px' }} />
              Analytics Dashboard
            </Typography>
            <Box style={{ display: 'flex', gap: '12px' }}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={exportToPDF}
                style={{ textTransform: 'none' }}
              >
                Export PDF
              </Button>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={exportToExcel}
                style={{ textTransform: 'none', background: '#1976d2' }}
              >
                Export Excel
              </Button>
            </Box>
          </Box>

          {/* Sales Overview Cards */}
          <Grid container spacing={3} style={{ marginBottom: '24px' }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}>
                <CardContent>
                  <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" style={{ opacity: 0.9 }}>Total Orders</Typography>
                      <Typography variant="h4" style={{ fontWeight: 700, marginTop: '8px' }}>
                        {salesOverview.totalOrders}
                      </Typography>
                      <Typography variant="caption" style={{ opacity: 0.8 }}>
                        Today: {salesOverview.todayOrders}
                      </Typography>
                    </Box>
                    <ShoppingCart style={{ fontSize: 48, opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: '#fff' }}>
                <CardContent>
                  <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" style={{ opacity: 0.9 }}>Total Revenue</Typography>
                      <Typography variant="h4" style={{ fontWeight: 700, marginTop: '8px' }}>
                        ₹{salesOverview.totalRevenue.toFixed(0)}
                      </Typography>
                      <Typography variant="caption" style={{ opacity: 0.8 }}>
                        Today: ₹{salesOverview.todayRevenue.toFixed(0)}
                      </Typography>
                    </Box>
                    <CurrencyRupee style={{ fontSize: 48, opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: '#fff' }}>
                <CardContent>
                  <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" style={{ opacity: 0.9 }}>Avg Order Value</Typography>
                      <Typography variant="h4" style={{ fontWeight: 700, marginTop: '8px' }}>
                        ₹{salesOverview.averageOrderValue.toFixed(0)}
                      </Typography>
                      <Typography variant="caption" style={{ opacity: 0.8 }}>
                        Per order
                      </Typography>
                    </Box>
                    <TrendingUp style={{ fontSize: 48, opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: '#fff' }}>
                <CardContent>
                  <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" style={{ opacity: 0.9 }}>Total Customers</Typography>
                      <Typography variant="h4" style={{ fontWeight: 700, marginTop: '8px' }}>
                        {customerInsights.totalCustomers}
                      </Typography>
                      <Typography variant="caption" style={{ opacity: 0.8 }}>
                        Repeat: {customerInsights.repeatCustomerRate.toFixed(1)}%
                      </Typography>
                    </Box>
                    <People style={{ fontSize: 48, opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Revenue Chart */}
          <Paper style={{ padding: '24px', marginBottom: '24px', borderRadius: '12px' }}>
            <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <Typography variant="h6" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShowChart style={{ fontSize: '28px', color: '#1976d2' }} />
                Revenue Trends
              </Typography>
              <Tabs value={revenueTab} onChange={(e, v) => setRevenueTab(v)}>
                <Tab label="Daily" style={{ textTransform: 'none' }} />
                <Tab label="Weekly" style={{ textTransform: 'none' }} />
                <Tab label="Monthly" style={{ textTransform: 'none' }} />
              </Tabs>
            </Box>

            {/* Simple Bar Chart Visualization */}
            <Box style={{ overflowX: 'auto' }}>
              {revenueTab === 0 && (
                <Box style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', minWidth: '800px', height: '300px' }}>
                  {revenueData.daily.map((day, index) => {
                    const maxRevenue = Math.max(...revenueData.daily.map(d => d.revenue));
                    const height = maxRevenue > 0 ? (day.revenue / maxRevenue) * 250 : 0;
                    return (
                      <Box key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="caption" style={{ marginBottom: '4px', fontWeight: 600 }}>
                          ₹{day.revenue.toFixed(0)}
                        </Typography>
                        <Box 
                          style={{ 
                            width: '100%', 
                            height: `${height}px`, 
                            background: 'linear-gradient(180deg, #1976d2 0%, #42a5f5 100%)',
                            borderRadius: '4px 4px 0 0',
                            minHeight: day.revenue > 0 ? '20px' : '2px',
                            transition: 'all 0.3s ease'
                          }}
                          title={`${day.date}: ₹${day.revenue.toFixed(2)} (${day.orders} orders)`}
                        />
                        <Typography variant="caption" style={{ marginTop: '8px', fontSize: '10px' }}>
                          {day.date}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              )}

              {revenueTab === 1 && (
                <Box style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', minWidth: '600px', height: '300px' }}>
                  {revenueData.weekly.map((week, index) => {
                    const maxRevenue = Math.max(...revenueData.weekly.map(w => w.revenue));
                    const height = maxRevenue > 0 ? (week.revenue / maxRevenue) * 250 : 0;
                    return (
                      <Box key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="caption" style={{ marginBottom: '4px', fontWeight: 600 }}>
                          ₹{week.revenue.toFixed(0)}
                        </Typography>
                        <Box 
                          style={{ 
                            width: '100%', 
                            height: `${height}px`, 
                            background: 'linear-gradient(180deg, #4caf50 0%, #66bb6a 100%)',
                            borderRadius: '4px 4px 0 0',
                            minHeight: week.revenue > 0 ? '20px' : '2px'
                          }}
                          title={`${week.week}: ₹${week.revenue.toFixed(2)} (${week.orders} orders)`}
                        />
                        <Typography variant="caption" style={{ marginTop: '8px', fontSize: '10px' }}>
                          {week.week}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              )}

              {revenueTab === 2 && (
                <Box style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', minWidth: '600px', height: '300px' }}>
                  {revenueData.monthly.map((month, index) => {
                    const maxRevenue = Math.max(...revenueData.monthly.map(m => m.revenue));
                    const height = maxRevenue > 0 ? (month.revenue / maxRevenue) * 250 : 0;
                    return (
                      <Box key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="caption" style={{ marginBottom: '4px', fontWeight: 600 }}>
                          ₹{month.revenue.toFixed(0)}
                        </Typography>
                        <Box 
                          style={{ 
                            width: '100%', 
                            height: `${height}px`, 
                            background: 'linear-gradient(180deg, #ff9800 0%, #ffb74d 100%)',
                            borderRadius: '4px 4px 0 0',
                            minHeight: month.revenue > 0 ? '20px' : '2px'
                          }}
                          title={`${month.month}: ₹${month.revenue.toFixed(2)} (${month.orders} orders)`}
                        />
                        <Typography variant="caption" style={{ marginTop: '8px', fontSize: '10px', transform: 'rotate(-45deg)', transformOrigin: 'top left' }}>
                          {month.month}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
          </Paper>

          <Grid container spacing={3}>
            {/* Popular Items */}
            <Grid item xs={12} md={6}>
              <Paper style={{ padding: '24px', borderRadius: '12px', height: '100%' }}>
                <Typography variant="h6" style={{ fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                  <Star style={{ color: '#ffc107', marginRight: '8px' }} />
                  Top 10 Popular Items
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow style={{ background: '#f5f5f5' }}>
                        <TableCell style={{ fontWeight: 600 }}>Rank</TableCell>
                        <TableCell style={{ fontWeight: 600 }}>Item</TableCell>
                        <TableCell style={{ fontWeight: 600 }} align="right">Sold</TableCell>
                        <TableCell style={{ fontWeight: 600 }} align="right">Revenue</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {popularItems.map((item, index) => (
                        <TableRow key={item.itemId} hover>
                          <TableCell>
                            <Chip 
                              label={`#${index + 1}`} 
                              size="small" 
                              color={index < 3 ? 'primary' : 'default'}
                              style={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell style={{ fontWeight: 500 }}>{item.itemName}</TableCell>
                          <TableCell align="right">{item.totalQuantitySold}</TableCell>
                          <TableCell align="right" style={{ color: '#1976d2', fontWeight: 600 }}>
                            ₹{item.totalRevenue.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            {/* Top Customers */}
            <Grid item xs={12} md={6}>
              <Paper style={{ padding: '24px', borderRadius: '12px', height: '100%' }}>
                <Typography variant="h6" style={{ fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                  <People style={{ color: '#4caf50', marginRight: '8px' }} />
                  Top 10 Customers
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow style={{ background: '#f5f5f5' }}>
                        <TableCell style={{ fontWeight: 600 }}>Rank</TableCell>
                        <TableCell style={{ fontWeight: 600 }}>Customer</TableCell>
                        <TableCell style={{ fontWeight: 600 }} align="right">Orders</TableCell>
                        <TableCell style={{ fontWeight: 600 }} align="right">Spent</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {customerInsights.topCustomers.map((customer, index) => (
                        <TableRow key={customer.customerId} hover>
                          <TableCell>
                            <Chip 
                              label={`#${index + 1}`} 
                              size="small" 
                              color={index < 3 ? 'success' : 'default'}
                              style={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" style={{ fontWeight: 500 }}>{customer.customerName}</Typography>
                            <Typography variant="caption" color="textSecondary">{customer.email}</Typography>
                          </TableCell>
                          <TableCell align="right">{customer.totalOrders}</TableCell>
                          <TableCell align="right" style={{ color: '#4caf50', fontWeight: 600 }}>
                            ₹{customer.totalSpent.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            {/* Low Stock Alert */}
            {lowStockItems.length > 0 && (
              <Grid item xs={12}>
                <Paper style={{ padding: '24px', borderRadius: '12px', background: '#fff3e0', border: '2px solid #ff9800' }}>
                  <Typography variant="h6" style={{ fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', color: '#e65100' }}>
                    <Warning style={{ marginRight: '8px' }} />
                    Low Stock Alert ({lowStockItems.length} items)
                  </Typography>
                  <Grid container spacing={2}>
                    {lowStockItems.map((item) => (
                      <Grid item xs={12} sm={6} md={4} key={item.itemId}>
                        <Box style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #ffb74d' }}>
                          <Typography variant="body1" style={{ fontWeight: 600, marginBottom: '8px' }}>
                            {item.itemName}
                          </Typography>
                          <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="textSecondary">
                              Category: {item.category}
                            </Typography>
                            <Chip 
                              label={`${item.currentStock} left`} 
                              size="small" 
                              color="warning"
                              style={{ fontWeight: 600 }}
                            />
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={(item.currentStock / item.threshold) * 100} 
                            style={{ marginTop: '12px', height: '8px', borderRadius: '4px' }}
                            color="warning"
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default AnalyticsDashboard;
