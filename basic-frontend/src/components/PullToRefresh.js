import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import usePullToRefresh from '../hooks/usePullToRefresh';

const PullToRefresh = ({ onRefresh, children }) => {
  const { isPulling, pullDistance, isRefreshing } = usePullToRefresh(onRefresh);

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Pull to Refresh Indicator */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: pullDistance,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fef5f9',
          zIndex: 1100,
          transition: isPulling ? 'none' : 'height 0.3s ease',
          overflow: 'hidden',
        }}
      >
        {isPulling && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {isRefreshing ? (
              <CircularProgress size={24} sx={{ color: '#e91e63' }} />
            ) : (
              <Refresh
                sx={{
                  color: '#e91e63',
                  fontSize: '2rem',
                  transform: `rotate(${pullDistance * 3}deg)`,
                  transition: 'transform 0.1s',
                }}
              />
            )}
            <Typography
              variant="caption"
              sx={{
                color: '#e91e63',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            >
              {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Content */}
      {children}
    </Box>
  );
};

export default PullToRefresh;
