import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Logout,
  ShoppingCart,
  Receipt,
  Storefront,
  Home,
  AccountCircle,
  KeyboardArrowDown,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import Notifications from './Notifications';

const CustomerHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    handleMenuClose();
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleHomeClick = () => {
    if (location.pathname === '/') {
      // If already on home page, refresh it
      window.location.reload();
    } else {
      // Navigate to home page
      navigate('/');
    }
  };

  const handleShopClick = () => {
    if (location.pathname === '/shop') {
      window.location.reload();
    } else {
      navigate('/shop');
    }
  };

  const handleOrdersClick = () => {
    if (location.pathname === '/orders') {
      window.location.reload();
    } else {
      navigate('/orders');
    }
  };

  const handleCartClick = () => {
    if (location.pathname === '/cart') {
      window.location.reload();
    } else {
      navigate('/cart');
    }
  };

  const handleProfileClick = () => {
    if (location.pathname === '/profile') {
      window.location.reload();
    } else {
      navigate('/profile');
      handleMenuClose();
    }
  };

  const handleAboutClick = () => {
    if (location.pathname === '/about') {
      window.location.reload();
    } else {
      navigate('/about');
    }
    handleHamburgerMenuClose();
  };

  const handleContactClick = () => {
    if (location.pathname === '/contact') {
      window.location.reload();
    } else {
      navigate('/contact');
    }
    handleHamburgerMenuClose();
  };

  const handleHamburgerMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleHamburgerMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const navButtonStyle = {
    color: '#4a5568',
    textTransform: 'none',
    fontSize: '14px',
    fontWeight: 500,
    padding: '6px 12px',
    marginRight: '2px',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'rgba(0, 0, 0, 0.04)',
      color: '#1a1a1a',
    },
  };

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      style={{ 
        background: '#ffffff',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Toolbar 
        style={{ 
          padding: '8px 12px', 
          minHeight: '60px', 
          maxWidth: '1400px', 
          width: '100%', 
          margin: '0 auto',
        }}
        sx={{
          '@media (min-width: 600px)': {
            padding: '8px 20px',
          },
          '@media (min-width: 960px)': {
            padding: '6px 20px',
            minHeight: '50px',
          },
        }}
      >
        {/* Hamburger Menu (Left Corner) */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleHamburgerMenuOpen}
          sx={{
            color: '#4a5568',
            marginRight: { xs: '4px', sm: '12px' },
            padding: { xs: '8px', sm: '12px' },
            '&:hover': {
              background: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo Section */}
        <Box 
          onClick={handleHomeClick} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            marginRight: '4px',
            transition: 'opacity 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <img 
            src="/LOGOO.png" 
            alt="Frost and Crinkle Logo" 
            style={{
              height: window.innerWidth >= 960 ? '55px' : (window.innerWidth >= 600 ? '55px' : '45px'),
              width: 'auto',
              maxWidth: window.innerWidth >= 960 ? '180px' : (window.innerWidth >= 600 ? '165px' : '140px'),
              objectFit: 'contain',
              borderRadius: '6px',
            }}
          />
        </Box>
        
        {/* Navigation Links */}
        <Box 
          sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: '4px', sm: '8px' }, 
            marginLeft: { xs: 'auto', sm: '24px' },
          }}
        >
          {user && (
            <>
              <Button
                onClick={handleOrdersClick}
                sx={{
                  ...navButtonStyle,
                  marginLeft: 'auto',
                  background: 'rgba(233, 30, 99, 0.08)',
                  color: '#e91e63',
                  fontWeight: 600,
                  padding: { xs: '6px 8px', sm: '6px 12px' },
                  fontSize: { xs: '12px', sm: '14px' },
                  '&:hover': {
                    background: 'rgba(233, 30, 99, 0.15)',
                  },
                }}
              >
                My Orders
              </Button>
              
              {/* Cart Button */}
              <IconButton 
                onClick={handleCartClick}
                sx={{ 
                  marginLeft: { xs: '4px', sm: '8px' },
                  padding: { xs: '8px', sm: '12px' },
                }}
              >
                <Badge badgeContent={0} color="error">
                  <ShoppingCart sx={{ color: '#4a5568', fontSize: { xs: '20px', sm: '24px' } }} />
                </Badge>
              </IconButton>
            </>
          )}
        </Box>
        
        {/* Right Side Actions */}
        {user ? (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: '4px', sm: '16px' },
              marginLeft: { xs: '4px', sm: '8px' },
            }}
          >
            {/* Notifications */}
            <Notifications />
            
            {/* User Menu */}
            <IconButton 
              onClick={handleMenuOpen}
              sx={{ padding: { xs: '4px', sm: '8px' } }}
            >
              <Avatar 
                sx={{ 
                  width: { xs: 28, sm: 32 }, 
                  height: { xs: 28, sm: 32 }, 
                  background: '#e91e63',
                  fontSize: { xs: '12px', sm: '14px' },
                  fontWeight: 600,
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>

            {/* Old button code - remove */}
            <Button
              onClick={handleMenuOpen}
              endIcon={<KeyboardArrowDown />}
              sx={{
                display: 'none', // Hide this, using avatar instead
                color: '#4a5568',
                textTransform: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'transparent',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)';
                e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.1)';
              }}
            >
              <Avatar 
                style={{ 
                  width: 28, 
                  height: 28, 
                  marginRight: '8px',
                  background: '#e2e8f0',
                  color: '#4a5568',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body2" style={{ fontWeight: 500, fontSize: '14px' }}>
                {user?.name}
              </Typography>
            </Button>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                style: {
                  marginTop: '8px',
                  minWidth: '200px',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                },
              }}
            >
              <MenuItem 
                onClick={handleProfileClick}
                style={{ padding: '12px 20px' }}
              >
                <AccountCircle style={{ marginRight: '12px', color: '#ff69b4' }} />
                My Profile
              </MenuItem>
              <Divider />
              <MenuItem 
                onClick={handleLogout}
                style={{ padding: '12px 20px', color: '#d32f2f' }}
              >
                <Logout style={{ marginRight: '12px' }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box 
            sx={{ 
              display: 'flex', 
              gap: { xs: '6px', sm: '12px' }, 
              marginLeft: 'auto',
            }}
          >
            <Button
              onClick={() => navigate('/login')}
              variant="outlined"
              sx={{
                borderColor: '#e91e63',
                color: '#e91e63',
                textTransform: 'none',
                fontSize: { xs: '13px', sm: '15px' },
                fontWeight: 600,
                padding: { xs: '6px 12px', sm: '8px 24px' },
                borderRadius: '6px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'rgba(233, 30, 99, 0.08)',
                },
              }}
            >
              Login
            </Button>
            
            <Button
              onClick={() => navigate('/register')}
              variant="contained"
              sx={{
                background: '#0066ff',
                color: '#fff',
                textTransform: 'none',
                fontSize: { xs: '13px', sm: '15px' },
                fontWeight: 600,
                padding: { xs: '6px 12px', sm: '8px 24px' },
                borderRadius: '6px',
                boxShadow: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: '#0052cc',
                },
              }}
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>

      {/* Hamburger Menu Dropdown */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleHamburgerMenuClose}
        PaperProps={{
          style: {
            marginTop: '8px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            minWidth: '200px',
          },
        }}
      >
        <MenuItem 
          onClick={handleAboutClick}
          sx={{
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#4a5568',
            '&:hover': {
              background: 'rgba(233, 30, 99, 0.08)',
              color: '#e91e63',
            },
          }}
        >
          About Us
        </MenuItem>
        <MenuItem 
          onClick={handleContactClick}
          sx={{
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#4a5568',
            '&:hover': {
              background: 'rgba(233, 30, 99, 0.08)',
              color: '#e91e63',
            },
          }}
        >
          Contact
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default CustomerHeader;
