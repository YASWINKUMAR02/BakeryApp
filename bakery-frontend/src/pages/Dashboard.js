import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fef6ee 0%, #fdecd7 100%)',
    paddingTop: '80px',
  };

  const paperStyle = {
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    marginTop: '40px',
  };

  return (
    <>
      <AppBar position="fixed" style={{ background: 'linear-gradient(135deg, #3e2723 0%, #4e342e 100%)', borderBottom: '1px solid rgba(255, 182, 193, 0.3)' }}>
        <Toolbar style={{ padding: '8px 24px', minHeight: '70px' }}>
          <img 
            src="/LOGOO.png" 
            alt="Frost and Crinkle Logo" 
            style={{
              height: '55px',
              width: '160px',
              objectFit: 'contain',
              borderRadius: '8px',
              marginRight: '16px',
              filter: 'drop-shadow(0 4px 12px rgba(255, 182, 193, 0.4))',
            }}
          />
          <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 600 }}>
            Frost and Crinkle
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<Logout />}
            style={{ textTransform: 'none' }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box style={{ ...containerStyle, background: '#f5f5f5' }}>
        <Container maxWidth="md">
          <Paper elevation={0} style={paperStyle}>
            <Typography variant="h4" gutterBottom style={{ fontWeight: 700, color: '#1a1a1a' }}>
              Welcome, {user?.name}! 🎉
            </Typography>
            
            <Typography variant="body1" style={{ color: '#666', marginTop: '20px' }}>
              Email: {user?.email}
            </Typography>
            
            <Typography variant="body1" style={{ color: '#666', marginBottom: '30px' }}>
              Phone: {user?.phone}
            </Typography>

            <Box style={{ marginTop: '40px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/home')}
                style={{
                  background: 'linear-gradient(135deg, #ff69b4 0%, #ffb6c1 100%)',
                  color: '#fff',
                  padding: '12px 32px',
                  fontSize: '16px',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: '8px',
                }}
              >
                Go to Home
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/orders')}
                style={{
                  borderColor: '#ff69b4',
                  color: '#ff69b4',
                  padding: '12px 32px',
                  fontSize: '16px',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: '8px',
                }}
              >
                My Orders
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;
