import React from 'react';
import { Box, Typography } from '@mui/material';
import { CheckCircle, Circle } from '@mui/icons-material';

const OrderStatusStepper = ({ currentStatus }) => {
  // Define order statuses in sequence
  const statuses = [
    { key: 'Pending', label: 'Order Placed' },
    { key: 'Confirmed', label: 'Confirmed' },
    { key: 'Packed', label: 'Packed' },
    { key: 'Out for Delivery', label: 'Out for Delivery' },
    { key: 'Delivered', label: 'Delivered' },
  ];

  // Get the index of current status
  const currentIndex = statuses.findIndex(s => s.key === currentStatus);

  return (
    <Box sx={{ padding: { xs: '16px 8px', md: '20px 16px' }, background: '#fafafa', borderRadius: '8px' }}>
      <Typography 
        variant="subtitle2" 
        sx={{ 
          fontWeight: 600, 
          marginBottom: { xs: '12px', md: '16px' },
          fontSize: { xs: '0.75rem', md: '0.875rem' },
          color: '#666'
        }}
      >
        Order Status
      </Typography>
      
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Progress Line */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: '12px', md: '16px' },
            left: { xs: '12px', md: '20px' },
            right: { xs: '12px', md: '20px' },
            height: '3px',
            background: '#e0e0e0',
            zIndex: 0,
          }}
        />
        
        {/* Active Progress Line */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: '12px', md: '16px' },
            left: { xs: '12px', md: '20px' },
            width: currentIndex >= 0 ? `${(currentIndex / (statuses.length - 1)) * 100}%` : '0%',
            height: '3px',
            background: 'linear-gradient(90deg, #e91e63 0%, #ff6b35 100%)',
            zIndex: 1,
            transition: 'width 0.5s ease',
          }}
        />

        {/* Status Steps */}
        {statuses.map((status, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <Box
              key={status.key}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                zIndex: 2,
                flex: 1,
              }}
            >
              {/* Circle */}
              <Box
                sx={{
                  width: { xs: '24px', md: '32px' },
                  height: { xs: '24px', md: '32px' },
                  borderRadius: '50%',
                  background: isCompleted ? 'linear-gradient(135deg, #e91e63 0%, #ff6b35 100%)' : '#fff',
                  border: isCompleted ? 'none' : '3px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  boxShadow: isCompleted ? '0 2px 8px rgba(233, 30, 99, 0.3)' : 'none',
                }}
              >
                {isCompleted ? (
                  <CheckCircle 
                    sx={{ 
                      color: '#fff', 
                      fontSize: { xs: '16px', md: '20px' } 
                    }} 
                  />
                ) : (
                  <Circle 
                    sx={{ 
                      color: '#e0e0e0', 
                      fontSize: { xs: '12px', md: '16px' } 
                    }} 
                  />
                )}
              </Box>

              {/* Label */}
              <Typography
                variant="caption"
                sx={{
                  marginTop: { xs: '6px', md: '8px' },
                  fontSize: { xs: '0.6rem', md: '0.7rem' },
                  fontWeight: isCurrent ? 600 : 400,
                  color: isCompleted ? '#e91e63' : '#999',
                  textAlign: 'center',
                  maxWidth: { xs: '60px', md: '80px' },
                  lineHeight: 1.2,
                }}
              >
                {status.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default OrderStatusStepper;
