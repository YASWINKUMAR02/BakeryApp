import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import {
  Lock,
  ShoppingBag,
  ArrowForward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import designTokens from '../theme/designTokens';

const { colors, gradients } = designTokens;

/**
 * LoginPromptDialog - Shows a friendly login prompt for guest users
 * when they try to perform actions that require authentication
 */
const LoginPromptDialog = ({ open, onClose, action = 'add to cart', itemName = '', returnUrl = '' }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    // Navigate to login with return URL
    const loginPath = returnUrl ? `/login?returnUrl=${encodeURIComponent(returnUrl)}` : '/login';
    navigate(loginPath);
  };

  const handleRegister = () => {
    onClose();
    const registerPath = returnUrl ? `/register?returnUrl=${encodeURIComponent(returnUrl)}` : '/register';
    navigate(registerPath);
  };

  const getActionMessage = () => {
    switch (action) {
      case 'add to cart':
        return 'add items to your cart';
      case 'checkout':
        return 'proceed to checkout';
      case 'write review':
        return 'write a review';
      case 'view orders':
        return 'view your orders';
      case 'shop now':
        return 'start shopping';
      default:
        return action;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 0,
          overflow: 'hidden',
        },
      }}
    >
      {/* Header with gradient */}
      <Box
        sx={{
          background: gradients.primary,
          p: 3,
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            backdropFilter: 'blur(4px)',
          }}
        >
          <Lock sx={{ fontSize: 32, color: '#fff' }} />
        </Box>
        <Typography
          variant="h6"
          sx={{
            color: '#fff',
            fontWeight: 700,
            fontSize: '1.25rem',
          }}
        >
          Login Required
        </Typography>
      </Box>

      <DialogContent sx={{ p: 3, pt: 3 }}>
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            color: colors.brandInk,
            mb: 1,
            fontSize: '1rem',
            lineHeight: 1.6,
          }}
        >
          Please sign in to{' '}
          <Box component="span" sx={{ fontWeight: 700, color: colors.brandPink }}>
            {getActionMessage()}
          </Box>
        </Typography>

        {itemName && (
          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              color: colors.stone,
              fontStyle: 'italic',
              mt: 1,
            }}
          >
            &ldquo;{itemName}&rdquo;
          </Typography>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          pt: 0,
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleLogin}
          endIcon={<ArrowForward />}
          sx={{
            background: gradients.primary,
            color: '#fff',
            borderRadius: 0,
            textTransform: 'none',
            fontWeight: 700,
            py: 1.2,
            fontSize: '1rem',
            boxShadow: '0 4px 14px rgba(233, 30, 99, 0.3)',
            '&:hover': {
              background: colors.brandBurgundy,
              boxShadow: '0 6px 20px rgba(233, 30, 99, 0.4)',
            },
          }}
        >
          Sign In
        </Button>

        <Button
          fullWidth
          variant="outlined"
          size="large"
          onClick={handleRegister}
          sx={{
            borderColor: colors.brandPink,
            color: colors.brandPink,
            borderRadius: 0,
            textTransform: 'none',
            fontWeight: 600,
            py: 1.2,
            fontSize: '1rem',
            '&:hover': {
              borderColor: colors.brandBurgundy,
              backgroundColor: alpha(colors.brandPink, 0.05),
            },
          }}
        >
          Create Account
        </Button>

        <Button
          fullWidth
          onClick={onClose}
          sx={{
            color: colors.stone,
            textTransform: 'none',
            fontWeight: 500,
            mt: 0.5,
          }}
        >
          Continue Browsing
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginPromptDialog;
