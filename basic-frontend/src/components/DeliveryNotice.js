import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { LocalShipping, Info, Phone } from '@mui/icons-material';

const DeliveryNotice = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#fff8e1',
        borderTop: '1px solid #ffb300',
        borderBottom: '1px solid #ffb300',
        py: { xs: 0.3, md: 0.8 },
        px: { xs: 1, md: 0 },
        position: { xs: 'relative', md: 'fixed' },
        bottom: { xs: 'auto', md: 0 },
        left: 0,
        right: 0,
        zIndex: { xs: 1, md: 999 },
        boxShadow: { xs: '0 2px 4px rgba(0,0,0,0.08)', md: '0 -1px 6px rgba(0,0,0,0.1)' },
        width: '100%',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: { xs: 1, md: 1.5 },
            flexWrap: 'nowrap',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 0.8 }, flex: 1, minWidth: 0 }}>
            <LocalShipping sx={{ color: '#ff9800', fontSize: { xs: 16, md: 18 }, flexShrink: 0 }} />
            <Typography
              variant="body2"
              sx={{
                color: '#e65100',
                fontWeight: 600,
                fontSize: { xs: '0.7rem', md: '0.8rem' },
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
              }}
            >
              <Info sx={{ fontSize: { xs: 12, md: 14 }, mr: 0.3, flexShrink: 0 }} />
              Delivering within 10 km in Coimbatore
            </Typography>
          </Box>

          <Button
            component="a"
            href="tel:+918072156286"
            variant="contained"
            size="small"
            startIcon={<Phone sx={{ fontSize: { xs: 13, md: 16 } }} />}
            sx={{
              backgroundColor: '#ff9800',
              color: '#fff',
              fontWeight: 600,
              fontSize: { xs: '0.65rem', md: '0.75rem' },
              py: { xs: 0.25, md: 0.3 },
              px: { xs: 0.8, md: 1.2 },
              textTransform: 'none',
              boxShadow: '0 2px 4px rgba(255, 152, 0, 0.3)',
              flexShrink: 0,
              minWidth: { xs: 'auto', md: 'auto' },
              height: { xs: '26px', md: 'auto' },
              '&:hover': {
                backgroundColor: '#f57c00',
                boxShadow: '0 3px 6px rgba(255, 152, 0, 0.4)',
              },
            }}
          >
            Order Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default DeliveryNotice;
