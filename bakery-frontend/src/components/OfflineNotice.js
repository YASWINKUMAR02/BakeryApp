import React from 'react';
import { Box, Typography, Container, Button, AppBar, Toolbar } from '@mui/material';
import { Schedule, Refresh, WifiOff } from '@mui/icons-material';

const OfflineNotice = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Simple Header with Logo */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          background: '#ffffff',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Toolbar sx={{ minHeight: '60px', justifyContent: 'center' }}>
          <img 
            src="/LOGOO.png" 
            alt="Frost and Crinkle Logo" 
            style={{
              height: '55px',
              width: 'auto',
              maxWidth: '180px',
              objectFit: 'contain',
            }}
          />
        </Toolbar>
      </AppBar>
      
      <Box
        sx={{
          flex: 1,
          background: '#f5f5f5',
          paddingTop: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >

        <Container
          maxWidth="xs"
          sx={{
            padding: { xs: '20px 16px', md: '30px 20px' },
            textAlign: 'center',
          }}
        >
          {/* Offline Icon */}
          <Box
            sx={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px',
              boxShadow: '0 3px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <WifiOff
              sx={{
                fontSize: '30px',
                color: '#e91e63',
              }}
            />
          </Box>

          {/* Main Message */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: '#1a1a1a',
              marginBottom: '10px',
              fontSize: { xs: '1.25rem', md: '1.5rem' },
            }}
          >
            We're Currently Closed
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: '#666',
              marginBottom: '20px',
              fontSize: { xs: '0.9rem', md: '1rem' },
              lineHeight: 1.5,
            }}
          >
            Online ordering available during business hours.
          </Typography>

          {/* Business Hours Card */}
          <Box
            sx={{
              background: '#fff',
              borderRadius: '0',
              padding: { xs: '20px', md: '25px' },
              marginBottom: '20px',
              boxShadow: '0 3px 12px rgba(0, 0, 0, 0.08)',
            }}
          >
            <Schedule
              sx={{
                fontSize: '35px',
                color: '#e91e63',
                marginBottom: '10px',
              }}
            />
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                color: '#1a1a1a',
                marginBottom: '8px',
                fontSize: '1.1rem',
              }}
            >
              Business Hours
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#e91e63',
                marginBottom: '5px',
              }}
            >
              9:00 AM - 9:00 PM
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#666',
                fontSize: '0.9rem',
              }}
            >
              Open Daily
            </Typography>
          </Box>

          {/* Try Again Button */}
          <Button
            variant="contained"
            size="medium"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            sx={{
              background: '#e91e63',
              color: '#fff',
              padding: { xs: '8px 24px', sm: '10px 32px' },
              fontSize: { xs: '14px', sm: '15px' },
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '0',
              boxShadow: '0 3px 12px rgba(233, 30, 99, 0.4)',
              '&:hover': {
                background: '#d81b60',
                boxShadow: '0 4px 16px rgba(233, 30, 99, 0.5)',
              },
            }}
          >
            Check Again
          </Button>

          <Typography
            variant="body2"
            sx={{
              color: '#999',
              marginTop: '12px',
              fontSize: '0.8rem',
            }}
          >
            Auto-checking every 30 seconds
          </Typography>
        </Container>
      </Box>
      
      {/* Simple Footer */}
      <Box
        sx={{
          background: '#1a1a1a',
          color: '#fff',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" sx={{ color: '#999' }}>
          © 2024 Frost & Crinkle. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default OfflineNotice;
