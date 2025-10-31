import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SimpleHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  console.log('✅ SimpleHome loaded - User:', user);

  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Simple Header */}
      <Box sx={{ 
        background: 'white', 
        padding: 2, 
        boxShadow: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#e91e63' }}>
          🍰 Frost & Crinkle
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {!user && (
            <>
              <Button variant="outlined" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button variant="contained" onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          )}
          {user && (
            <Typography>Welcome, {user.name}!</Typography>
          )}
        </Box>
      </Box>

      {/* Content */}
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
          Welcome to Frost & Crinkle Bakery! 🎂
        </Typography>
        
        <Typography variant="h5" color="text.secondary" paragraph>
          Your destination for delicious cakes and pastries
        </Typography>

        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/shop')}
            sx={{ 
              background: '#e91e63',
              '&:hover': { background: '#c2185b' }
            }}
          >
            Shop Now
          </Button>
          <Button 
            variant="outlined" 
            size="large"
            onClick={() => navigate('/about-us')}
          >
            About Us
          </Button>
        </Box>

        <Box sx={{ mt: 6, p: 3, background: 'white', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Debug Information
          </Typography>
          <Typography>Current Path: {window.location.pathname}</Typography>
          <Typography>User Status: {user ? 'Logged In' : 'Guest'}</Typography>
          {user && <Typography>User: {user.name} ({user.role})</Typography>}
        </Box>
      </Container>
    </Box>
  );
};

export default SimpleHome;
