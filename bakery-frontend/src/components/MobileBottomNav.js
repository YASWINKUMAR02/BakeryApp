import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, IconButton, Badge } from '@mui/material';
import { Home, Storefront, ShoppingCart, Person } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useGuestCart } from '../context/GuestCartContext';
import designTokens from '../theme/designTokens';

const { colors, shadows } = designTokens;

/**
 * MobileBottomNav - Fixed bottom navigation for mobile devices
 * Provides quick access to main app sections
 */
const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { totalItems: guestCartCount } = useGuestCart();

  const cartBadge = user ? 0 : guestCartCount;

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Storefront, label: 'Shop', path: '/shop' },
    { icon: ShoppingCart, label: 'Cart', path: '/cart', badge: cartBadge },
    { icon: Person, label: 'Account', path: user ? '/profile' : '/login' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <Box
      sx={{
        display: { xs: 'flex', md: 'none' },
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: colors.paper,
        borderTop: `1px solid rgba(0,0,0,0.08)`,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
        zIndex: 1000,
        justifyContent: 'space-around',
        alignItems: 'center',
        px: 2,
      }}
    >
      {navItems.map((item) => {
        const active = isActive(item.path);
        const Icon = item.icon;
        
        return (
          <IconButton
            key={item.path}
            onClick={() => navigate(item.path)}
            sx={{
              flexDirection: 'column',
              color: active ? colors.brandPink : '#666',
              padding: '8px 16px',
              borderRadius: 0,
              position: 'relative',
              '&::after': active ? {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '24px',
                height: '3px',
                backgroundColor: colors.brandPink,
              } : {},
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <Badge
              badgeContent={item.badge ?? null}
              color="error"
              invisible={!item.badge}
              sx={{
                '& .MuiBadge-badge': {
                  fontWeight: 700,
                  fontSize: '0.6rem',
                  minWidth: 16,
                  height: 16,
                  borderRadius: '8px',
                },
              }}
            >
              <Icon sx={{ fontSize: 24 }} />
            </Badge>
            <Box
              component="span"
              sx={{
                fontSize: '0.65rem',
                fontWeight: active ? 700 : 500,
                mt: 0.5,
              }}
            >
              {item.label}
            </Box>
          </IconButton>
        );
      })}
    </Box>
  );
};

export default MobileBottomNav;
