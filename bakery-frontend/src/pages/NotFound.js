import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button } from '@mui/material';
import { Home, ArrowBack, Search } from '@mui/icons-material';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fef5f9 0%, #fff 50%, #fef5f9 100%)',
      }}
    >
      <Container maxWidth="md">
        <Box style={{ textAlign: 'center' }}>
          {/* 404 Illustration */}
          <Box style={{ marginBottom: '32px' }}>
            <Typography
              variant="h1"
              style={{
                fontSize: '120px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #e91e63 0%, #ff6b9d 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '16px',
              }}
            >
              404
            </Typography>
            <Typography
              variant="h4"
              style={{
                fontWeight: 600,
                color: '#333',
                marginBottom: '16px',
              }}
            >
              Oops! Page Not Found
            </Typography>
            <Typography
              variant="body1"
              style={{
                color: '#666',
                fontSize: '18px',
                maxWidth: '500px',
                margin: '0 auto',
              }}
            >
              The page you're looking for doesn't exist or has been moved.
              Let's get you back to something delicious!
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: '40px',
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<Home />}
              onClick={() => navigate('/')}
              style={{
                background: 'linear-gradient(135deg, #e91e63 0%, #ff6b9d 100%)',
                color: '#fff',
                padding: '12px 32px',
                fontSize: '16px',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 14px rgba(233, 30, 99, 0.4)',
              }}
            >
              Go Home
            </Button>

            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              style={{
                borderColor: '#e91e63',
                color: '#e91e63',
                padding: '12px 32px',
                fontSize: '16px',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px',
              }}
            >
              Go Back
            </Button>

            <Button
              variant="outlined"
              size="large"
              startIcon={<Search />}
              onClick={() => navigate('/shop')}
              style={{
                borderColor: '#e91e63',
                color: '#e91e63',
                padding: '12px 32px',
                fontSize: '16px',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px',
              }}
            >
              Browse Shop
            </Button>
          </Box>

          {/* Decorative Element */}
          <Box style={{ marginTop: '60px', opacity: 0.6 }}>
            <Typography variant="body2" color="textSecondary">
              🧁 Looking for our delicious treats? Check out our shop! 🍰
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFound;
