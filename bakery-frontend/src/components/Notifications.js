import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Typography,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Circle,
  CheckCircle,
  Info,
  Warning,
  ShoppingCart,
  LocalShipping,
  Cancel,
  Delete,
} from '@mui/icons-material';
import { notificationAPI } from '../services/api';
import { showError } from '../utils/toast';
import { useAuth } from '../context/AuthContext';

const Notifications = ({ iconColor = '#4a5568', hoverColor = '#1a1a1a' }) => {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Get role-appropriate mock notifications
  const getMockNotifications = () => {
    if (user?.role === 'ADMIN') {
      return [];
    } else {
      // Customer notifications - will be populated when orders are placed
      return [];
    }
  };
  
  // Initialize from localStorage or use mock data
  const getInitialNotifications = () => {
    const storageKey = `notifications_${user?.role}_${user?.id}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return getMockNotifications();
      }
    }
    return getMockNotifications();
  };

  const [notifications, setNotifications] = useState(getInitialNotifications());
  const [unreadCount, setUnreadCount] = useState(() => getInitialNotifications().filter(n => !n.read).length);
  const [loading, setLoading] = useState(false);

  // Save to localStorage whenever notifications change
  useEffect(() => {
    if (user?.id) {
      const storageKey = `notifications_${user.role}_${user.id}`;
      localStorage.setItem(storageKey, JSON.stringify(notifications));
      setUnreadCount(notifications.filter(n => !n.read).length);
    }
  }, [notifications, user?.id, user?.role]);

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
      // Poll for new notifications - more frequently for admins (3 seconds vs 30 seconds)
      const pollInterval = user?.role === 'ADMIN' ? 3000 : 30000;
      const interval = setInterval(fetchNotifications, pollInterval);
      return () => clearInterval(interval);
    }
  }, [user?.id, user?.role]);

  // Listen for new notifications
  useEffect(() => {
    const handleNewNotification = () => {
      // Reload notifications from localStorage
      const storageKey = `notifications_${user?.role}_${user?.id}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const notifs = JSON.parse(stored);
          setNotifications(notifs);
        } catch (e) {
          // Ignore parse errors
        }
      }
    };

    window.addEventListener('notificationAdded', handleNewNotification);
    return () => window.removeEventListener('notificationAdded', handleNewNotification);
  }, [user?.id, user?.role]);

  const fetchNotifications = async () => {
    if (!user) return;
    
    // First, always load from localStorage
    const storageKey = `notifications_${user.role}_${user.id}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const localNotifs = JSON.parse(stored);
        setNotifications(localNotifs);
        setUnreadCount(localNotifs.filter(n => !n.read).length);
      } catch (e) {
        console.error('Error parsing localStorage notifications:', e);
      }
    }
    
    // Then try to fetch from API (optional, for future server-side notifications)
    try {
      const response = await notificationAPI.getAll(user.id);
      const notifs = response.data || [];
      // Only update if we got real data from API
      if (notifs.length > 0) {
        setNotifications(notifs);
        setUnreadCount(notifs.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Error fetching notifications from API:', error);
      // Already loaded from localStorage above
    }
  };

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (notificationId) => {
    // Update local state immediately
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    
    // Update localStorage
    if (user) {
      const storageKey = `notifications_${user.role}_${user.id}`;
      localStorage.setItem(storageKey, JSON.stringify(updatedNotifications));
    }
    
    try {
      await notificationAPI.markAsRead(notificationId);
    } catch (error) {
      // Already updated local state
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    
    setLoading(true);
    // Update local state immediately
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifications);
    
    // Update localStorage
    const storageKey = `notifications_${user.role}_${user.id}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedNotifications));
    
    try {
      await notificationAPI.markAllAsRead(user.id);
    } catch (error) {
      // Already updated local state
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (notificationId, event) => {
    event.stopPropagation();
    
    // Update local state immediately
    const updatedNotifications = notifications.filter(n => n.id !== notificationId);
    setNotifications(updatedNotifications);
    
    // Update localStorage
    if (user) {
      const storageKey = `notifications_${user.role}_${user.id}`;
      localStorage.setItem(storageKey, JSON.stringify(updatedNotifications));
    }
    
    try {
      await notificationAPI.delete(notificationId);
    } catch (error) {
      // Already updated local state
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ORDER_PLACED':
        return <ShoppingCart style={{ color: '#4caf50' }} />;
      case 'ORDER_CONFIRMED':
        return <CheckCircle style={{ color: '#2196f3' }} />;
      case 'ORDER_SHIPPED':
        return <LocalShipping style={{ color: '#ff9800' }} />;
      case 'ORDER_DELIVERED':
        return <CheckCircle style={{ color: '#4caf50' }} />;
      case 'ORDER_CANCELLED':
        return <Cancel style={{ color: '#f44336' }} />;
      case 'LOW_STOCK':
        return <Warning style={{ color: '#ff9800' }} />;
      case 'INFO':
        return <Info style={{ color: '#2196f3' }} />;
      default:
        return <Circle style={{ color: '#666' }} />;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Don't render if no user
  if (!user) {
    return null;
  }

  return (
    <>
      <IconButton
        onClick={handleOpen}
        style={{
          color: iconColor,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = hoverColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = iconColor;
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            marginTop: '8px',
            width: '400px',
            maxHeight: '500px',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          },
        }}
      >
        {/* Header */}
        <Box style={{ padding: '16px 20px', borderBottom: '1px solid #e0e0e0' }}>
          <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" style={{ fontWeight: 600 }}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Button
                size="small"
                onClick={handleMarkAllAsRead}
                disabled={loading}
                style={{ textTransform: 'none', fontSize: '12px' }}
              >
                Mark all as read
              </Button>
            )}
          </Box>
        </Box>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <Box style={{ padding: '40px 20px', textAlign: 'center' }}>
            <NotificationsIcon style={{ fontSize: 48, color: '#ccc', marginBottom: '8px' }} />
            <Typography variant="body2" color="textSecondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <List style={{ padding: 0, maxHeight: '400px', overflowY: 'auto' }}>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  button
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                  style={{
                    padding: '12px 20px',
                    background: notification.read ? '#fff' : '#f5f9ff',
                    borderLeft: notification.read ? 'none' : '3px solid #2196f3',
                  }}
                >
                  <ListItemIcon style={{ minWidth: '40px' }}>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography
                          variant="body2"
                          style={{
                            fontWeight: notification.read ? 400 : 600,
                            color: '#1a1a1a',
                            flex: 1,
                          }}
                        >
                          {notification.message}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => handleDelete(notification.id, e)}
                          style={{ marginLeft: '8px', padding: '4px' }}
                        >
                          <Delete style={{ fontSize: 16, color: '#999' }} />
                        </IconButton>
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="textSecondary">
                        {formatTime(notification.createdAt)}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <Divider />
            <Box style={{ padding: '12px 20px', textAlign: 'center' }}>
              <Button
                fullWidth
                onClick={handleClose}
                style={{
                  textTransform: 'none',
                  color: '#2196f3',
                  fontWeight: 600,
                }}
              >
                Close
              </Button>
            </Box>
          </>
        )}
      </Menu>
    </>
  );
};

export default Notifications;
