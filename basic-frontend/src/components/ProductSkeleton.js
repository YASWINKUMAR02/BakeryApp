import React from 'react';
import { Box, Card, Skeleton } from '@mui/material';

const ProductSkeleton = () => {
  return (
    <Card
      elevation={0}
      sx={{
        width: '100%',
        height: '380px',
        borderRadius: 0,
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
      }}
    >
      {/* Image Skeleton */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={200}
        animation="wave"
        sx={{ backgroundColor: '#f5f5f5' }}
      />

      {/* Content Skeleton */}
      <Box sx={{ padding: 2 }}>
        {/* Title */}
        <Skeleton
          variant="text"
          width="80%"
          height={28}
          animation="wave"
          sx={{ marginBottom: 1 }}
        />

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 1 }}>
          <Skeleton variant="circular" width={16} height={16} animation="wave" />
          <Skeleton variant="text" width={40} height={20} animation="wave" />
          <Skeleton variant="text" width={80} height={20} animation="wave" />
        </Box>

        {/* Description */}
        <Skeleton
          variant="text"
          width="100%"
          height={20}
          animation="wave"
          sx={{ marginBottom: 0.5 }}
        />
        <Skeleton
          variant="text"
          width="90%"
          height={20}
          animation="wave"
          sx={{ marginBottom: 2 }}
        />

        {/* Price */}
        <Skeleton
          variant="text"
          width={60}
          height={32}
          animation="wave"
        />
      </Box>
    </Card>
  );
};

export default ProductSkeleton;
