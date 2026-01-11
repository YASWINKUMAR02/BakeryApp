import React, { useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Chip,
} from '@mui/material';
import {
  Cake,
  AdminPanelSettings,
  Lock,
  ArrowBack,
} from '@mui/icons-material';

const AdminRegister = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login after 5 seconds
    const timer = setTimeout(() => {
      navigate('/admin/login');
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    padding: '20px',
  };

  const paperStyle = {
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    maxWidth: '500px',
    width: '100%',
    background: '#fff',
  };

  const logoContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  };

  const logoStyle = {
    fontSize: '48px',
    color: '#f0701f',
    marginRight: '10px',
  };

  const adminBadgeStyle = {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center',
  };

  return (
    <Box style={containerStyle}>
      <Container maxWidth="sm">
        <Paper elevation={0} style={paperStyle}>
          <Box style={logoContainerStyle}>
            <Cake style={logoStyle} />
            <Typography variant="h4" style={{ fontWeight: 700, color: '#1a1a2e' }}>
              Fronst & Crinkle
            </Typography>
          </Box>

          <Box style={adminBadgeStyle}>
            <Chip
              icon={<AdminPanelSettings />}
              label="Admin Portal"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                fontWeight: 600,
                padding: '20px 10px',
                fontSize: '14px',
              }}
            />
          </Box>

          <Box style={{ textAlign: 'center', marginBottom: '30px' }}>
            <Lock style={{ fontSize: '80px', color: '#e91e63', marginBottom: '20px' }} />
            <Typography 
              variant="h5" 
              gutterBottom
              style={{ fontWeight: 600, color: '#1a1a2e', marginBottom: '15px' }}
            >
              Admin Registration Disabled
            </Typography>
            
            <Typography 
              variant="body1" 
              style={{ color: '#666', marginBottom: '20px', lineHeight: 1.6 }}
            >
              For security reasons, admin accounts can only be created by database administrators.
            </Typography>

            <Paper 
              elevation={0}
              style={{ 
                padding: '20px', 
                background: '#f8f9fa', 
                borderRadius: '8px',
                marginBottom: '30px'
              }}
            >
              <Typography 
                variant="body2" 
                style={{ color: '#555', marginBottom: '10px', fontWeight: 600 }}
              >
                To create an admin account:
              </Typography>
              <Typography 
                variant="body2" 
                style={{ color: '#666', textAlign: 'left', lineHeight: 1.8 }}
              >
                1. Contact your database administrator<br/>
                2. Admin will add your account via MySQL<br/>
                3. You'll receive login credentials<br/>
                4. Use the credentials to sign in
              </Typography>
            </Paper>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => navigate('/admin/login')}
              startIcon={<ArrowBack />}
              style={{
                padding: '14px',
                fontSize: '16px',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px',
                marginBottom: '16px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
              }}
            >
              Go to Admin Login
            </Button>

            <Typography variant="body2" style={{ color: '#999', fontSize: '12px' }}>
              Redirecting to login in 5 seconds...
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminRegister;
