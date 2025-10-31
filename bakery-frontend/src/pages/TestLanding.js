import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TestLanding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: 3,
      }}
    >
      <Typography variant="h2" gutterBottom>
        🎉 Test Landing Page
      </Typography>
      
      <Typography variant="h5" gutterBottom>
        This is the ROOT path "/"
      </Typography>

      <Box sx={{ mt: 4, p: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
        <Typography variant="h6">Debug Info:</Typography>
        <Typography>Current Path: {window.location.pathname}</Typography>
        <Typography>User Logged In: {user ? 'Yes' : 'No'}</Typography>
        {user && <Typography>User Role: {user.role}</Typography>}
        {user && <Typography>User Name: {user.name}</Typography>}
      </Box>

      <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate('/home')}
        >
          Go to /home
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate('/shop')}
        >
          Go to /shop
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate('/login')}
        >
          Go to /login
        </Button>
      </Box>

      <Typography variant="body2" sx={{ mt: 4, opacity: 0.8 }}>
        If you're seeing this page, the routing is working correctly!
      </Typography>
    </Box>
  );
};

export default TestLanding;
