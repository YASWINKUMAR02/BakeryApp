import React, { useState, useEffect, useRef } from 'react';
import {
  Snackbar,
  Alert,
  Box,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import {
  ShoppingCart,
  Close,
  Visibility,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminOrderAlert = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [alert, setAlert] = useState(null);
  const audioRef = useRef(null);
  const lastNotificationIdRef = useRef(null);

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Create audio element for notification sound (using data URI for a simple beep)
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const playNotificationSound = () => {
      try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      } catch (err) {
        console.log('Audio error:', err);
      }
    };

    const checkForNewOrders = () => {
      if (!user?.id || user?.role !== 'ADMIN') return;
      
      const storageKey = `notifications_ADMIN_${user.id}`;
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        try {
          const notifications = JSON.parse(stored);
          const newOrderNotifications = notifications.filter(
            n => n.type === 'ORDER_PLACED' && !n.read
          );
          
          if (newOrderNotifications.length > 0) {
            const latestNotification = newOrderNotifications[0];
            
            // Only show alert if this is a new notification we haven't shown yet
            if (lastNotificationIdRef.current !== latestNotification.id) {
              lastNotificationIdRef.current = latestNotification.id;
              setAlert(latestNotification);
              
              // Play notification sound
              playNotificationSound();
              
              // Show browser notification if permitted
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('🎉 New Order Received!', {
                  body: latestNotification.message,
                  icon: '/FROST (4).png',
                  badge: '/FROST (4).png',
                  tag: 'new-order',
                  requireInteraction: false,
                });
              }
            }
          }
        } catch (e) {
          console.error('Error parsing notifications:', e);
        }
      }
    };
    
    // Listen for localStorage changes from other tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === 'newOrderNotification' && e.newValue) {
        // New order placed, check for notifications
        setTimeout(checkForNewOrders, 500);
      }
    };

    // Check immediately
    checkForNewOrders();

    // Listen for new notification events (same tab)
    const handleNewNotification = () => {
      checkForNewOrders();
    };

    window.addEventListener('notificationAdded', handleNewNotification);
    window.addEventListener('storage', handleStorageChange);

    // Poll every 3 seconds for real-time feel
    const interval = setInterval(checkForNewOrders, 3000);

    return () => {
      window.removeEventListener('notificationAdded', handleNewNotification);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [user?.id, user?.role]);

  const handleClose = () => {
    setAlert(null);
  };

  const handleViewOrder = () => {
    setAlert(null);
    navigate('/admin/orders');
  };

  if (!alert) return null;

  return (
    <Snackbar
      open={!!alert}
      autoHideDuration={10000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      style={{ marginTop: '70px' }}
    >
      <Alert
        severity="success"
        icon={<ShoppingCart style={{ fontSize: 28 }} />}
        action={
          <Box style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Button
              size="small"
              onClick={handleViewOrder}
              style={{
                color: '#fff',
                background: 'rgba(255,255,255,0.2)',
                textTransform: 'none',
                fontWeight: 600,
              }}
              startIcon={<Visibility />}
            >
              View
            </Button>
            <IconButton size="small" onClick={handleClose} style={{ color: '#fff' }}>
              <Close fontSize="small" />
            </IconButton>
          </Box>
        }
        style={{
          background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
          color: '#fff',
          fontSize: '16px',
          fontWeight: 600,
          minWidth: '400px',
          boxShadow: '0 8px 24px rgba(76, 175, 80, 0.4)',
          borderRadius: '12px',
          padding: '12px 16px',
        }}
      >
        <Box>
          <Typography variant="h6" style={{ fontWeight: 700, marginBottom: '4px' }}>
            🎉 New Order Received!
          </Typography>
          <Typography variant="body2" style={{ opacity: 0.95 }}>
            {alert.message}
          </Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default AdminOrderAlert;
