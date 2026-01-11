import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography, Box } from '@mui/material';
import { NavigateNext, Home } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pathnames = location.pathname.split('/').filter((x) => x);

  // Don't show breadcrumbs on home page
  if (pathnames.length === 0) return null;

  const breadcrumbNameMap = {
    shop: 'Shop',
    about: 'About Us',
    contact: 'Contact',
    gallery: 'Gallery',
    faq: 'FAQ',
    cart: 'Shopping Cart',
    checkout: 'Checkout',
    orders: 'My Orders',
    profile: 'My Profile',
  };

  return (
    <Box
      sx={{
        py: 2,
        px: { xs: 2, sm: 3 },
        backgroundColor: '#f9f9f9',
        borderBottom: '1px solid #eee',
      }}
    >
      <MuiBreadcrumbs
        separator={<NavigateNext fontSize="small" sx={{ color: '#999' }} />}
        aria-label="breadcrumb"
        sx={{ maxWidth: '1200px', margin: '0 auto' }}
      >
        <Link
          underline="hover"
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: '#666',
            cursor: 'pointer',
            '&:hover': { color: '#e91e63' },
            transition: 'color 0.2s',
          }}
          onClick={() => navigate('/')}
        >
          <Home sx={{ mr: 0.5, fontSize: '1.2rem' }} />
          Home
        </Link>

        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const label = breadcrumbNameMap[value] || value.charAt(0).toUpperCase() + value.slice(1);

          return last ? (
            <Typography
              key={to}
              sx={{
                color: '#e91e63',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              {label}
            </Typography>
          ) : (
            <Link
              key={to}
              underline="hover"
              sx={{
                color: '#666',
                cursor: 'pointer',
                '&:hover': { color: '#e91e63' },
                transition: 'color 0.2s',
                fontSize: '0.9rem',
              }}
              onClick={() => navigate(to)}
            >
              {label}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;
