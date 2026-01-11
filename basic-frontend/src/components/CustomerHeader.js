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
} from '@mui/material';
import {
  Storefront,
  Menu as MenuIcon,
  Phone,
  Search,
} from '@mui/icons-material';

const CustomerHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const handleHomeClick = () => {
    if (location.pathname === '/') {
      window.location.reload();
    } else {
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
            src={`${process.env.PUBLIC_URL}/LOGOO.png`}
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
              '&:hover': {
                background: 'rgba(233, 30, 99, 0.15)',
              },
            }}
          >
            <Storefront sx={{ fontSize: '18px', marginRight: '4px' }} />
            Shop
          </Button>

          <Button
            onClick={() => navigate('/gallery')}
            sx={navButtonStyle}
          >
            Gallery
          </Button>

          <Button
            onClick={() => navigate('/faq')}
            sx={navButtonStyle}
          >
            FAQ
          </Button>

          <Button
            onClick={handleAboutClick}
            sx={navButtonStyle}
          >
            About
          </Button>

        </Box>

        {/* Desktop Icons - Hidden on mobile */}
        <Box 
          sx={{ 
            display: { xs: 'none', md: 'flex' },
            gap: 1,
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <IconButton
            onClick={handleShopClick}
            sx={{
              color: '#4a5568',
              padding: '8px',
              '&:hover': { color: '#e91e63', backgroundColor: 'rgba(233, 30, 99, 0.08)' },
            }}
            aria-label="search"
          >
            <Search sx={{ fontSize: '24px' }} />
          </IconButton>

          <IconButton
            component="a"
            href="tel:+918072156286"
            sx={{
              color: '#4a5568',
              padding: '8px',
              '&:hover': { color: '#e91e63', backgroundColor: 'rgba(233, 30, 99, 0.08)' },
            }}
            aria-label="call us"
          >
            <Phone sx={{ fontSize: '24px' }} />
          </IconButton>
        </Box>
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
          onClick={handleShopClick}
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
          Shop
        </MenuItem>
        <MenuItem 
          onClick={() => {
            navigate('/gallery');
            handleHamburgerMenuClose();
          }}
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
          Gallery
        </MenuItem>
        <MenuItem 
          onClick={() => {
            navigate('/faq');
            handleHamburgerMenuClose();
          }}
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
          FAQ
        </MenuItem>
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
