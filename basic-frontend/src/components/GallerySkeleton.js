import React from 'react';
import { Box, Card, Skeleton, Container } from '@mui/material';

const GallerySkeleton = () => {
  return (
    <Container maxWidth="lg" sx={{ paddingX: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { 
            xs: 'repeat(2, 1fr)', 
            sm: 'repeat(3, 1fr)', 
            md: 'repeat(4, 1fr)',
            lg: 'repeat(4, 1fr)'
          },
          gap: { xs: 2, sm: 2.5, md: 3 },
        }}
      >
        {[...Array(8)].map((_, index) => (
          <Card
            key={index}
            sx={{
              borderRadius: '8px',
              boxShadow: 'none',
              border: '1px solid #e0e0e0',
              aspectRatio: '1 / 1',
              overflow: 'hidden',
            }}
          >
            <Skeleton 
              variant="rectangular" 
              width="100%" 
              height="100%" 
              animation="wave"
              sx={{ bgcolor: '#f5f5f5' }}
            />
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default GallerySkeleton;
