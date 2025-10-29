import React from 'react';
import { Box, Card, CardContent, Grid, Skeleton } from '@mui/material';

// Product Card Skeleton
export const ProductCardSkeleton = () => {
  return (
    <Card style={{ borderRadius: '12px', height: '100%' }}>
      <Skeleton variant="rectangular" height={200} animation="wave" />
      <CardContent>
        <Skeleton variant="text" height={32} width="80%" animation="wave" />
        <Skeleton variant="text" height={24} width="60%" animation="wave" style={{ marginTop: '8px' }} />
        <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
          <Skeleton variant="text" height={28} width="40%" animation="wave" />
          <Skeleton variant="rectangular" height={36} width={100} animation="wave" style={{ borderRadius: '8px' }} />
        </Box>
      </CardContent>
    </Card>
  );
};

// Product Grid Skeleton
export const ProductGridSkeleton = ({ count = 6 }) => {
  return (
    <Grid container spacing={3}>
      {[...Array(count)].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <ProductCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
};

// Order Card Skeleton
export const OrderCardSkeleton = () => {
  return (
    <Card style={{ marginBottom: '16px', borderRadius: '12px' }}>
      <CardContent>
        <Box style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <Skeleton variant="text" height={28} width="30%" animation="wave" />
          <Skeleton variant="rectangular" height={24} width={80} animation="wave" style={{ borderRadius: '12px' }} />
        </Box>
        <Skeleton variant="text" height={20} width="50%" animation="wave" />
        <Skeleton variant="text" height={20} width="40%" animation="wave" style={{ marginTop: '8px' }} />
        <Box style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <Skeleton variant="rectangular" height={36} width={100} animation="wave" style={{ borderRadius: '8px' }} />
          <Skeleton variant="rectangular" height={36} width={100} animation="wave" style={{ borderRadius: '8px' }} />
        </Box>
      </CardContent>
    </Card>
  );
};

// Table Row Skeleton
export const TableRowSkeleton = ({ columns = 5 }) => {
  return (
    <tr>
      {[...Array(columns)].map((_, index) => (
        <td key={index} style={{ padding: '16px' }}>
          <Skeleton variant="text" height={20} animation="wave" />
        </td>
      ))}
    </tr>
  );
};

// Profile Skeleton
export const ProfileSkeleton = () => {
  return (
    <Box>
      <Box style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
        <Skeleton variant="circular" width={80} height={80} animation="wave" />
        <Box style={{ marginLeft: '24px', flex: 1 }}>
          <Skeleton variant="text" height={32} width="40%" animation="wave" />
          <Skeleton variant="text" height={20} width="30%" animation="wave" style={{ marginTop: '8px' }} />
        </Box>
      </Box>
      <Grid container spacing={3}>
        {[...Array(4)].map((_, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Skeleton variant="rectangular" height={56} animation="wave" style={{ borderRadius: '8px' }} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Dashboard Card Skeleton
export const DashboardCardSkeleton = () => {
  return (
    <Card style={{ padding: '24px', borderRadius: '12px' }}>
      <Skeleton variant="text" height={24} width="60%" animation="wave" />
      <Skeleton variant="text" height={48} width="40%" animation="wave" style={{ marginTop: '16px' }} />
      <Skeleton variant="text" height={20} width="50%" animation="wave" style={{ marginTop: '8px' }} />
    </Card>
  );
};

// List Skeleton
export const ListSkeleton = ({ items = 5 }) => {
  return (
    <Box>
      {[...Array(items)].map((_, index) => (
        <Box
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Skeleton variant="circular" width={48} height={48} animation="wave" />
          <Box style={{ marginLeft: '16px', flex: 1 }}>
            <Skeleton variant="text" height={20} width="70%" animation="wave" />
            <Skeleton variant="text" height={16} width="40%" animation="wave" style={{ marginTop: '4px' }} />
          </Box>
          <Skeleton variant="rectangular" height={32} width={80} animation="wave" style={{ borderRadius: '8px' }} />
        </Box>
      ))}
    </Box>
  );
};

// Page Skeleton (Full Page)
export const PageSkeleton = () => {
  return (
    <Box style={{ padding: '20px' }}>
      <Skeleton variant="text" height={48} width="40%" animation="wave" style={{ marginBottom: '32px' }} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Skeleton variant="rectangular" height={400} animation="wave" style={{ borderRadius: '12px', marginBottom: '24px' }} />
          <Skeleton variant="text" height={24} width="80%" animation="wave" />
          <Skeleton variant="text" height={20} width="90%" animation="wave" style={{ marginTop: '8px' }} />
          <Skeleton variant="text" height={20} width="85%" animation="wave" style={{ marginTop: '8px' }} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Skeleton variant="rectangular" height={200} animation="wave" style={{ borderRadius: '12px', marginBottom: '16px' }} />
          <Skeleton variant="rectangular" height={150} animation="wave" style={{ borderRadius: '12px' }} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default {
  ProductCardSkeleton,
  ProductGridSkeleton,
  OrderCardSkeleton,
  TableRowSkeleton,
  ProfileSkeleton,
  DashboardCardSkeleton,
  ListSkeleton,
  PageSkeleton,
};
