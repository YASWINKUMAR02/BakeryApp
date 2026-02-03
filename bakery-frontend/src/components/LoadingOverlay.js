import React from 'react';
import { Box, CircularProgress, Typography, alpha } from '@mui/material';
import designTokens from '../theme/designTokens';

const { colors } = designTokens;

const LoadingOverlay = ({ 
  visible = false, 
  message = 'Loading...', 
  size = 40,
  backdrop = true,
  transparent = false 
}) => {
  if (!visible) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backgroundColor: backdrop 
          ? transparent 
            ? 'transparent' 
            : alpha(colors.brandInk, 0.3)
          : 'transparent',
        backdropFilter: backdrop && !transparent ? 'blur(4px)' : 'none',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          backgroundColor: colors.paper,
          padding: 3,
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <CircularProgress 
          size={size} 
          sx={{ 
            color: colors.brandPink,
            mb: 1
          }} 
        />
        {message && (
          <Typography 
            variant="body2" 
            sx={{ 
              color: colors.stone,
              fontWeight: 500,
              textAlign: 'center'
            }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default LoadingOverlay;
