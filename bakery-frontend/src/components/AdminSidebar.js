import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Collapse,
  Divider,
  IconButton,
  Badge,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Dashboard,
  Category,
  Inventory,
  ShoppingCart,
  People,
  History,
  ExpandLess,
  ExpandMore,
  ChevronLeft,
  ChevronRight,
  LocalOffer,
  RateReview,
  TrendingUp,
  Storefront,
  ViewCarousel,
} from '@mui/icons-material';

const drawerWidth = 260;

const AdminSidebar = ({ open, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expandedSections, setExpandedSections] = useState({
    'Categories': false,
    'Items': false,
    'Orders': false,
  });
  const [newOrdersCount, setNewOrdersCount] = useState(0);

  // Collapse all sections when sidebar is collapsed
  useEffect(() => {
    if (!open) {
      setExpandedSections({
        'Categories': false,
        'Items': false,
        'Orders': false,
      });
    }
  }, [open]);

  useEffect(() => {
    const checkNewOrders = () => {
      const storageKey = 'notifications_ADMIN_1';
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        try {
          const notifications = JSON.parse(stored);
          const unreadOrderNotifications = notifications.filter(
            n => n.type === 'ORDER_PLACED' && !n.read
          );
          setNewOrdersCount(unreadOrderNotifications.length);
        } catch (e) {
          setNewOrdersCount(0);
        }
      } else {
        setNewOrdersCount(0);
      }
    };

    checkNewOrders();
    
    // Listen for notification updates
    window.addEventListener('notificationAdded', checkNewOrders);
    window.addEventListener('storage', checkNewOrders);
    
    // Poll every 5 seconds
    const interval = setInterval(checkNewOrders, 5000);

    return () => {
      window.removeEventListener('notificationAdded', checkNewOrders);
      window.removeEventListener('storage', checkNewOrders);
      clearInterval(interval);
    };
  }, []);

  const handleToggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <Dashboard />,
      path: '/admin/dashboard',
      color: '#ff6b9d',
    },
    {
      title: 'Product Catalog',
      icon: <Storefront />,
      path: '/admin/home',
      color: '#4caf50',
    },
    {
      title: 'Categories',
      icon: <Category />,
      path: '/admin/categories',
      color: '#ff9800',
      subItems: [
        { title: 'View All', path: '/admin/categories' },
        { title: 'Add Category', action: 'add-category' },
      ]
    },
    {
      title: 'Items',
      icon: <Inventory />,
      path: '/admin/items',
      color: '#2196f3',
      subItems: [
        { title: 'View All', path: '/admin/items' },
        { title: 'Add Item', action: 'add-item' },
        { title: 'Manage Stock', path: '/admin/items' },
      ]
    },
    {
      title: 'Orders',
      icon: <ShoppingCart />,
      path: '/admin/orders',
      color: '#9c27b0',
      subItems: [
        { title: 'Pending Orders', path: '/admin/orders' },
        { title: 'Order History', path: '/admin/order-history' },
        { title: 'Analytics', path: '/admin/analytics' },
        { title: 'Analytics Dashboard', path: '/admin/analytics-dashboard' },
      ]
    },
    {
      title: 'Customers',
      icon: <People />,
      path: '/admin/customers',
      color: '#00bcd4',
    },
    {
      title: 'Manage Carousel',
      icon: <ViewCarousel />,
      path: '/admin/carousel-management',
      color: '#e91e63',
    },
  ];

  const handleNavigation = (item, subItem = null) => {
    if (subItem) {
      // Navigate to sub-item without closing the dropdown
      if (subItem.action) {
        // Handle actions like opening dialogs
        // You can emit events or use context here
        if (location.pathname === item.path) {
          window.location.reload();
        } else {
          navigate(item.path);
        }
      } else {
        // Check if already on the target page
        if (location.pathname === subItem.path) {
          window.location.reload();
        } else {
          navigate(subItem.path);
        }
      }
      // Keep the section expanded
    } else {
      if (item.subItems) {
        // Toggle the section when clicking on parent
        handleToggleSection(item.title);
      } else {
        // Navigate to page without sub-items or refresh if already there
        if (location.pathname === item.path) {
          window.location.reload();
        } else {
          navigate(item.path);
        }
      }
    }
  };

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? open : true}
      onClose={isMobile ? onToggle : undefined}
      ModalProps={{
        keepMounted: true, // Better mobile performance
      }}
      sx={{
        width: isMobile ? 0 : (open ? drawerWidth : 70),
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isMobile ? drawerWidth : (open ? drawerWidth : 70),
          boxSizing: 'border-box',
          background: '#fff',
          color: '#333',
          borderRight: '1px solid #e0e0e0',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
          marginTop: { xs: 0, md: '70px' },
          height: { xs: '100%', md: 'calc(100% - 70px)' },
        },
      }}
    >
      <Box sx={{ overflow: 'auto', height: '100%' }}>
        {/* Toggle Button - Only on Desktop */}
        {!isMobile && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: open ? 'flex-end' : 'center',
              padding: '12px',
              borderBottom: '1px solid #e0e0e0',
              background: '#f8f9fa',
            }}
          >
            <IconButton
              onClick={onToggle}
              sx={{
                color: '#333',
                background: '#fff',
                border: '1px solid #e0e0e0',
                '&:hover': {
                  background: '#e91e63',
                  color: '#fff',
                },
              }}
            >
              {open ? <ChevronLeft /> : <ChevronRight />}
            </IconButton>
          </Box>
        )}

        <List sx={{ padding: '12px 8px' }}>
          {menuItems.map((item, index) => (
            <Box key={index}>
              <ListItem
                button
                onClick={() => handleNavigation(item)}
                sx={{
                  borderRadius: '12px',
                  marginBottom: '8px',
                  padding: open ? '12px 16px' : '12px',
                  background: (isActive(item.path) && !item.subItems) || expandedSections[item.title]
                    ? '#f5f5f5'
                    : 'transparent',
                  '&:hover': {
                    background: '#f5f5f5',
                  },
                  transition: 'all 0.2s ease',
                  justifyContent: open ? 'flex-start' : 'center',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: item.color,
                    minWidth: open ? '40px' : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.title === 'Orders' && newOrdersCount > 0 ? (
                    <Badge 
                      badgeContent={newOrdersCount} 
                      color="error"
                      sx={{
                        '& .MuiBadge-badge': {
                          animation: 'pulse 2s infinite',
                          '@keyframes pulse': {
                            '0%': {
                              transform: 'scale(1)',
                              opacity: 1,
                            },
                            '50%': {
                              transform: 'scale(1.1)',
                              opacity: 0.8,
                            },
                            '100%': {
                              transform: 'scale(1)',
                              opacity: 1,
                            },
                          },
                        },
                      }}
                    >
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                {open && (
                  <>
                    <ListItemText
                      primary={item.title}
                      sx={{
                        '& .MuiTypography-root': {
                          fontWeight: isActive(item.path) && !item.subItems ? 600 : 500,
                          fontSize: '15px',
                        },
                      }}
                    />
                    {item.subItems && (
                      expandedSections[item.title] ? <ExpandLess /> : <ExpandMore />
                    )}
                  </>
                )}
              </ListItem>

              {/* Sub Items */}
              {item.subItems && open && (
                <Collapse in={expandedSections[item.title]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem, subIndex) => (
                      <ListItem
                        button
                        key={subIndex}
                        onClick={() => handleNavigation(item, subItem)}
                        sx={{
                          paddingLeft: '56px',
                          borderRadius: '8px',
                          marginBottom: '4px',
                          padding: '8px 16px 8px 56px',
                          background: isActive(subItem.path)
                            ? '#f0f0f0'
                            : 'transparent',
                          '&:hover': {
                            background: '#f5f5f5',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: isActive(subItem.path) ? item.color : '#999',
                            marginRight: '12px',
                          }}
                        />
                        <ListItemText
                          primary={subItem.title}
                          sx={{
                            '& .MuiTypography-root': {
                              fontSize: '14px',
                              color: isActive(subItem.path) ? '#333' : '#666',
                              fontWeight: isActive(subItem.path) ? 600 : 400,
                            },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </Box>
          ))}
        </List>

        {/* Footer */}
        {open && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '16px',
              borderTop: '1px solid #e0e0e0',
              background: '#f9f9f9',
            }}
          >
            <Typography variant="caption" sx={{ color: '#333', display: 'block', textAlign: 'center', fontWeight: 600 }}>
              Frost & Crinkle
            </Typography>
            <Typography variant="caption" sx={{ color: '#666', display: 'block', textAlign: 'center' }}>
              Admin Panel v1.0
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default AdminSidebar;
