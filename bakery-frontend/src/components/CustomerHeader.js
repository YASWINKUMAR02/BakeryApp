import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  Divider,
  Typography,
} from '@mui/material';
import {
  Storefront,
  Menu as MenuIcon,
  ShoppingCart,
  Receipt,
  AccountCircle,
  Logout,
  Help,
  Info,
  Phone,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import Notifications from './Notifications';

const CustomerHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const [extraMenuAnchorEl, setExtraMenuAnchorEl] = useState(null);

  const handleHomeClick = () => {
    if (location.pathname === '/') {
      window.location.reload();
    } else {
      navigate('/');
    }
  };

  const handleShopClick = () => {
    navigate('/shop');
  };

  const handleLinkClick = (path) => {
    if (path === '/shop') {
      navigate('/shop');
    } else if (location.pathname === path) {
      window.location.reload();
    } else {
      navigate(path);
    }
    handleHamburgerMenuClose();
    handleExtraMenuClose();
  };

  const handleExtraMenuOpen = (event) => {
    setExtraMenuAnchorEl(event.currentTarget);
  };

  const handleExtraMenuClose = () => {
    setExtraMenuAnchorEl(null);
  };

  const handleHamburgerMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleHamburgerMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleUserMenuClose();
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
          display: 'flex',
          justifyContent: 'space-between',
          overflow: 'visible',
          '@media (min-width: 600px)': {
            padding: '8px 20px',
          },
          '@media (min-width: 960px)': {
            padding: '6px 20px',
            minHeight: '50px',
          },
        }}
      >
        {/* More Menu (Left Corner) - Dropdown for About, Contact, FAQ */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleExtraMenuOpen}
          sx={{
            color: '#4a5568',
            marginRight: { xs: '4px', sm: '12px' },
            padding: { xs: '8px', sm: '12px' },
            '&:hover': {
              background: 'rgba(0, 0, 0, 0.04)',
              color: '#e91e63',
            },
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo Section */}
        <Box
          onClick={handleHomeClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'opacity 0.2s ease',
            flexGrow: { xs: 1, md: 0 },
            justifyContent: { xs: 'center', md: 'flex-start' },
            marginRight: { xs: '40px', md: '4px' },
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

        {/* Navigation Links - Hidden on mobile */}
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: '8px',
            marginLeft: '24px',
          }}
        >
          <Button
            onClick={handleShopClick}
            sx={{
              ...navButtonStyle,
              marginLeft: 'auto',
              background: 'rgba(233, 30, 99, 0.08)',
              color: '#e91e63',
              fontWeight: 600,
              px: 2.5,
              py: 1,
              borderRadius: '50px',
              '&:hover': {
                background: 'rgba(233, 30, 99, 0.15)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            <Storefront sx={{ fontSize: '18px', marginRight: '6px' }} />
            Shop Now
          </Button>
        </Box>

        {/* Right Side Icons (Desktop & Mobile) */}
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 0.5, sm: 1 },
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          {/* Desktop Only Icons */}
          {/* Desktop Only Icons - Removed redundant Search */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0 }}>
          </Box>

          {/* Cart - Always Visible */}
          <IconButton
            onClick={() => handleLinkClick('/cart')}
            sx={{
              color: '#4a5568',
              padding: '8px',
              '&:hover': { color: '#e91e63', backgroundColor: 'rgba(233, 30, 99, 0.08)' },
            }}
          >
            <Badge badgeContent={user ? 0 : 0} color="error" variant="dot">
              {/* Badge count should ideally come from Context, kept 0/dot for now */}
              <ShoppingCart sx={{ fontSize: '24px' }} />
            </Badge>
          </IconButton>

          {/* Auth Section */}
          {user ? (
            <>
              <Notifications />
              <IconButton
                onClick={handleUserMenuOpen}
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
            </>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              variant="outlined"
              sx={{
                borderColor: '#e91e63',
                color: '#e91e63',
                textTransform: 'none',
                fontSize: { xs: '13px', sm: '14px' },
                fontWeight: 600,
                padding: { xs: '4px 10px', sm: '6px 16px' },
                borderRadius: '6px',
                ml: 1,
                '&:hover': {
                  background: 'rgba(233, 30, 99, 0.08)',
                },
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>

      {/* Extra Links Menu (Drop-in from Left) */}
      <Menu
        anchorEl={extraMenuAnchorEl}
        open={Boolean(extraMenuAnchorEl)}
        onClose={handleExtraMenuClose}
        PaperProps={{
          style: {
            marginTop: '8px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            minWidth: '220px',
          },
        }}
      >
        <MenuItem
          onClick={() => handleLinkClick('/about')}
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
          <Info sx={{ mr: 2, color: '#e91e63' }} /> About Us
        </MenuItem>
        <MenuItem
          onClick={() => handleLinkClick('/contact')}
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
          <Phone sx={{ mr: 2, color: '#e91e63' }} /> Contact Us
        </MenuItem>
        <MenuItem
          onClick={() => handleLinkClick('/faq')}
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
          <Help sx={{ mr: 2, color: '#e91e63' }} /> FAQ
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem
          onClick={handleShopClick}
          sx={{
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#e91e63',
          }}
        >
          <Storefront sx={{ mr: 2 }} /> Shop Now
        </MenuItem>
      </Menu>

      {/* User Menu Dropdown */}
      <Menu
        anchorEl={userMenuAnchorEl}
        open={Boolean(userMenuAnchorEl)}
        onClose={handleUserMenuClose}
        PaperProps={{
          style: {
            marginTop: '8px',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            minWidth: '200px',
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleLinkClick('/orders');
            handleUserMenuClose();
          }}
          style={{ padding: '12px 20px' }}
        >
          <Receipt style={{ marginRight: '12px', color: '#e91e63' }} />
          My Orders
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleLinkClick('/profile');
            handleUserMenuClose();
          }}
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
    </AppBar>
  );
};

export default CustomerHeader;
