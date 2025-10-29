import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button } from '@mui/material';
import { Refresh, Home, ErrorOutline } from '@mui/icons-material';

const ErrorPage = ({ error, resetError }) => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    if (resetError) resetError();
    window.location.reload();
  };

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
          {/* Error Icon */}
          <ErrorOutline
            style={{
              fontSize: '100px',
              color: '#e91e63',
              marginBottom: '24px',
            }}
          />

          <Typography
            variant="h3"
            style={{
              fontWeight: 700,
              color: '#333',
              marginBottom: '16px',
            }}
          >
            Something Went Wrong
          </Typography>

          <Typography
            variant="body1"
            style={{
              color: '#666',
              fontSize: '18px',
              maxWidth: '600px',
              margin: '0 auto 32px',
            }}
          >
            We're sorry for the inconvenience. An unexpected error occurred.
            Please try refreshing the page or go back to the home page.
          </Typography>

          {/* Error Details (for development) */}
          {error && process.env.NODE_ENV === 'development' && (
            <Box
              style={{
                background: '#f5f5f5',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '32px',
                textAlign: 'left',
                maxWidth: '600px',
                margin: '0 auto 32px',
              }}
            >
              <Typography
                variant="body2"
                style={{
                  fontFamily: 'monospace',
                  color: '#d32f2f',
                  fontSize: '14px',
                }}
              >
                {error.toString()}
              </Typography>
            </Box>
          )}

          {/* Action Buttons */}
          <Box
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<Refresh />}
              onClick={handleRefresh}
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
              Refresh Page
            </Button>

            <Button
              variant="outlined"
              size="large"
              startIcon={<Home />}
              onClick={() => navigate('/')}
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
              Go Home
            </Button>
          </Box>

          {/* Support Info */}
          <Box style={{ marginTop: '60px' }}>
            <Typography variant="body2" color="textSecondary">
              If the problem persists, please contact our support team.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ErrorPage;
