import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Grid, Typography, IconButton } from '@mui/material';
import { Facebook, Instagram, Twitter, LocationOn, Phone, Email, Favorite } from '@mui/icons-material';
import footerImage from '../sample-images/afbb6beb2bc3e1cd789dd0117c0ee637-removebg-preview.png';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <Box sx={{
      background: '#1a1a1a',
      color: '#fff',
      padding: { xs: '12px 0 72px', sm: '16px 0 64px', lg: '24px 0 16px' },
      position: 'relative',
      zIndex: 1000,
      marginTop: 'auto',
    }}>
      <Container maxWidth="lg">
        {/* Mobile Compact Layout */}
        <Box sx={{ display: { xs: 'flex', lg: 'none' }, flexDirection: 'column', alignItems: 'center', gap: 2, textAlign: 'center' }}>
          {/* Mobile Logo and Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <img
              src={footerImage}
              alt="Frost & Crinkle"
              style={{
                width: 'auto',
                height: '40px',
                objectFit: 'contain',
              }}
            />
            <Typography variant="h6" sx={{ color: '#e91e63', fontWeight: 700, fontSize: '1rem' }}>
              Frost & Crinkle
            </Typography>
          </Box>

          {/* Mobile Navigation */}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Typography variant="body2" sx={{ color: '#999', cursor: 'pointer', '&:hover': { color: '#e91e63' }, fontSize: '0.875rem' }} onClick={() => navigate('/')}>Home</Typography>
            <Typography variant="body2" sx={{ color: '#999', cursor: 'pointer', '&:hover': { color: '#e91e63' }, fontSize: '0.875rem' }} onClick={() => navigate('/shop')}>Shop</Typography>
            <Typography variant="body2" sx={{ color: '#999', cursor: 'pointer', '&:hover': { color: '#e91e63' }, fontSize: '0.875rem' }} onClick={() => navigate('/about')}>About</Typography>
            <Typography variant="body2" sx={{ color: '#999', cursor: 'pointer', '&:hover': { color: '#e91e63' }, fontSize: '0.875rem' }} onClick={() => navigate('/contact')}>Contact</Typography>
            <Typography variant="body2" sx={{ color: '#999', cursor: 'pointer', '&:hover': { color: '#e91e63' }, fontSize: '0.875rem' }} onClick={() => navigate('/refund-policy')}>Refund Policy</Typography>
            <Typography variant="body2" sx={{ color: '#999', cursor: 'pointer', '&:hover': { color: '#e91e63' }, fontSize: '0.875rem' }} onClick={() => navigate('/delivery-policy')}>Delivery Policy</Typography>
          </Box>

          {/* Mobile Social Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton component="a" href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" sx={{ color: '#e91e63', '&:hover': { background: 'rgba(233, 30, 99, 0.1)' }, p: 0.5 }}>
              <Facebook fontSize="small" />
            </IconButton>
            <IconButton component="a" href="https://www.instagram.com/frost_and_crinkle?igsh=bzVoaGVlMm1uaG1q" target="_blank" rel="noopener noreferrer" sx={{ color: '#e91e63', '&:hover': { background: 'rgba(233, 30, 99, 0.1)' }, p: 0.5 }}>
              <Instagram fontSize="small" />
            </IconButton>
            <IconButton component="a" href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" sx={{ color: '#e91e63', '&:hover': { background: 'rgba(233, 30, 99, 0.1)' }, p: 0.5 }}>
              <Twitter fontSize="small" />
            </IconButton>
          </Box>

          <Typography variant="caption" sx={{ color: '#666', textAlign: 'center' }}>
            © {currentYear} Frost & Crinkle. All rights reserved.
          </Typography>
        </Box>

        {/* Desktop Full Layout */}
        <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
          <Grid container spacing={3} alignItems="flex-start">
            {/* Company Info */}
            <Grid item xs={12} lg={4}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <img
                  src={footerImage}
                  alt="Frost & Crinkle"
                  style={{
                    width: 'auto',
                    height: '60px',
                    objectFit: 'contain',
                    flexShrink: 0
                  }}
                />
                <Box>
                  <Typography variant="h6" sx={{ color: '#e91e63', fontWeight: 700, marginBottom: 1 }}>
                    Frost & Crinkle
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#999', lineHeight: 1.5, marginBottom: 1.5, fontSize: '0.875rem' }}>
                    Your premium online bakery for fresh cakes, pastries, and breads. Baked with love, delivered with care.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton
                      component="a"
                      href="https://www.facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: '#e91e63', '&:hover': { background: 'rgba(233, 30, 99, 0.1)' }, p: 0.5 }}
                    >
                      <Facebook fontSize="small" />
                    </IconButton>
                    <IconButton
                      component="a"
                      href="https://www.instagram.com/frost_and_crinkle?igsh=bzVoaGVlMm1uaG1q"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: '#e91e63', '&:hover': { background: 'rgba(233, 30, 99, 0.1)' }, p: 0.5 }}
                    >
                      <Instagram fontSize="small" />
                    </IconButton>
                    <IconButton
                      component="a"
                      href="https://www.twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: '#e91e63', '&:hover': { background: 'rgba(233, 30, 99, 0.1)' }, p: 0.5 }}
                    >
                      <Twitter fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Navigation Links */}
            <Grid item xs={12} sm={6} lg={2.5}>
              <Typography variant="h6" sx={{ color: '#e91e63', fontWeight: 700, marginBottom: 1.5, fontSize: '1rem' }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                <Typography variant="body2" sx={{ color: '#999', cursor: 'pointer', '&:hover': { color: '#e91e63' }, fontSize: '0.875rem' }} onClick={() => navigate('/')}>Home</Typography>
                <Typography variant="body2" sx={{ color: '#999', cursor: 'pointer', '&:hover': { color: '#e91e63' }, fontSize: '0.875rem' }} onClick={() => navigate('/shop')}>Shop</Typography>
                <Typography variant="body2" sx={{ color: '#999', cursor: 'pointer', '&:hover': { color: '#e91e63' }, fontSize: '0.875rem' }} onClick={() => navigate('/about')}>About Us</Typography>
                <Typography variant="body2" sx={{ color: '#999', cursor: 'pointer', '&:hover': { color: '#e91e63' }, fontSize: '0.875rem' }} onClick={() => navigate('/faq')}>FAQ</Typography>
                <Typography variant="body2" sx={{ color: '#999', cursor: 'pointer', '&:hover': { color: '#e91e63' }, fontSize: '0.875rem' }} onClick={() => navigate('/contact')}>Contact</Typography>
              </Box>
            </Grid>

            {/* Legal Links */}
            <Grid item xs={12} sm={6} lg={2.5}>
              <Typography variant="h6" sx={{ color: '#e91e63', fontWeight: 700, marginBottom: 1.5, fontSize: '1rem' }}>
                Legal
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                <Typography variant="body2" sx={{ color: '#999', cursor: 'pointer', '&:hover': { color: '#e91e63' }, fontSize: '0.875rem' }} onClick={() => navigate('/terms')}>Terms of Service</Typography>
                <Typography variant="body2" sx={{ color: '#999', cursor: 'pointer', '&:hover': { color: '#e91e63' }, fontSize: '0.875rem' }} onClick={() => navigate('/privacy')}>Privacy Policy</Typography>
                <Typography variant="body2" sx={{ color: '#999', cursor: 'pointer', '&:hover': { color: '#e91e63' }, fontSize: '0.875rem' }} onClick={() => navigate('/refund-policy')}>Refund Policy</Typography>
                <Typography variant="body2" sx={{ color: '#999', cursor: 'pointer', '&:hover': { color: '#e91e63' }, fontSize: '0.875rem' }} onClick={() => navigate('/delivery-policy')}>Delivery Policy</Typography>
              </Box>
            </Grid>

            {/* Contact Info */}
            <Grid item xs={12} lg={3}>
              <Typography variant="h6" sx={{ color: '#e91e63', fontWeight: 700, marginBottom: 1.5, fontSize: '1rem' }}>
                Contact Us
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <LocationOn sx={{ color: '#e91e63', fontSize: '18px', mt: 0.1 }} />
                  <Typography variant="body2" sx={{ color: '#999', lineHeight: 1.5, fontSize: '0.875rem' }}>
                    Lawly Road<br />
                    Coimbatore - 641003
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone sx={{ color: '#e91e63', fontSize: '18px' }} />
                  <Typography variant="body2" sx={{ color: '#999', fontSize: '0.875rem' }}>
                    +91 9629198467
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email sx={{ color: '#e91e63', fontSize: '18px' }} />
                  <Typography variant="body2" sx={{ color: '#999', fontSize: '0.875rem' }}>
                    frostandcrinkle@gmail.com
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Desktop Bottom Bar */}
          <Box sx={{ marginTop: 3, paddingTop: 2, borderTop: '1px solid #333', textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              © {currentYear} Frost & Crinkle. All rights reserved.
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
              Made with <Favorite sx={{ color: '#e91e63', fontSize: '16px' }} /> for bakery lovers
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
