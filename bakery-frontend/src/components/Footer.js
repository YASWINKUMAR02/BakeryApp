import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import {
  Facebook,
  Instagram,
  Twitter,
  Email,
  Phone,
  LocationOn,
  Favorite,
} from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        color: '#fff',
        marginTop: 'auto',
      }}
    >
      <Container maxWidth="lg" sx={{ padding: { xs: '30px 16px 16px', sm: '40px 20px 20px', md: '60px 20px 20px' } }}>
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {/* About Section */}
          <Grid item xs={12} sm={6} md={3} sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography
              variant="h6"
              style={{
                fontWeight: 700,
                marginBottom: '20px',
                color: '#ff69b4',
              }}
            >
              Frost & Crinkle
            </Typography>
            <Typography
              variant="body2"
              style={{
                color: '#b0b0b0',
                lineHeight: 1.8,
                marginBottom: '20px',
              }}
            >
              Your premium online bakery for fresh cakes, pastries, and breads.
              Baked with love, delivered with care.
            </Typography>
            {/* Social Media Icons */}
            <Box style={{ display: 'flex', gap: '12px' }}>
              <IconButton
                size="small"
                style={{ color: '#ff69b4', background: 'rgba(255, 105, 180, 0.1)' }}
                href="https://facebook.com"
                target="_blank"
              >
                <Facebook />
              </IconButton>
              <IconButton
                size="small"
                style={{ color: '#ff69b4', background: 'rgba(255, 105, 180, 0.1)' }}
                href="https://instagram.com"
                target="_blank"
              >
                <Instagram />
              </IconButton>
              <IconButton
                size="small"
                style={{ color: '#ff69b4', background: 'rgba(255, 105, 180, 0.1)' }}
                href="https://twitter.com"
                target="_blank"
              >
                <Twitter />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} sm={6} md={3}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                marginBottom: { xs: '12px', sm: '20px' },
                color: '#ff69b4',
                fontSize: { xs: '1rem', sm: '1.25rem' },
              }}
            >
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: '8px', sm: '12px' } }}>
              <Link
                component={RouterLink}
                to="/"
                style={{
                  color: '#b0b0b0',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.3s',
                }}
                onMouseEnter={(e) => (e.target.style.color = '#ff69b4')}
                onMouseLeave={(e) => (e.target.style.color = '#b0b0b0')}
              >
                Home
              </Link>
              <Link
                component={RouterLink}
                to="/shop"
                style={{
                  color: '#b0b0b0',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.3s',
                }}
                onMouseEnter={(e) => (e.target.style.color = '#ff69b4')}
                onMouseLeave={(e) => (e.target.style.color = '#b0b0b0')}
              >
                Shop
              </Link>
              <Link
                component={RouterLink}
                to="/about"
                style={{
                  color: '#b0b0b0',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.3s',
                }}
                onMouseEnter={(e) => (e.target.style.color = '#ff69b4')}
                onMouseLeave={(e) => (e.target.style.color = '#b0b0b0')}
              >
                About Us
              </Link>
              <Link
                component={RouterLink}
                to="/contact"
                style={{
                  color: '#b0b0b0',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.3s',
                }}
                onMouseEnter={(e) => (e.target.style.color = '#ff69b4')}
                onMouseLeave={(e) => (e.target.style.color = '#b0b0b0')}
              >
                Contact
              </Link>
            </Box>
          </Grid>

          {/* Social Media on Mobile / Legal on Desktop */}
          <Grid item xs={6} sm={6} md={3}>
            {/* Social Media - Mobile Only */}
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  marginBottom: '12px',
                  color: '#ff69b4',
                  fontSize: '1rem',
                }}
              >
                Follow Us
              </Typography>
              <Box sx={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <IconButton
                  size="small"
                  style={{ color: '#ff69b4', background: 'rgba(255, 105, 180, 0.1)' }}
                  href="https://facebook.com"
                  target="_blank"
                >
                  <Facebook />
                </IconButton>
                <IconButton
                  size="small"
                  style={{ color: '#ff69b4', background: 'rgba(255, 105, 180, 0.1)' }}
                  href="https://instagram.com"
                  target="_blank"
                >
                  <Instagram />
                </IconButton>
                <IconButton
                  size="small"
                  style={{ color: '#ff69b4', background: 'rgba(255, 105, 180, 0.1)' }}
                  href="https://twitter.com"
                  target="_blank"
                >
                  <Twitter />
                </IconButton>
              </Box>
            </Box>

            {/* Legal - Tablet & Desktop */}
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  marginBottom: { xs: '12px', sm: '20px' },
                  color: '#ff69b4',
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                }}
              >
                Legal
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: '8px', sm: '12px' } }}>
                <Link
                  component={RouterLink}
                  to="/terms"
                  style={{
                    color: '#b0b0b0',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'color 0.3s',
                  }}
                  onMouseEnter={(e) => (e.target.style.color = '#ff69b4')}
                  onMouseLeave={(e) => (e.target.style.color = '#b0b0b0')}
                >
                  Terms of Service
                </Link>
                <Link
                  component={RouterLink}
                  to="/privacy"
                  style={{
                    color: '#b0b0b0',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'color 0.3s',
                  }}
                  onMouseEnter={(e) => (e.target.style.color = '#ff69b4')}
                  onMouseLeave={(e) => (e.target.style.color = '#b0b0b0')}
                >
                  Privacy Policy
                </Link>
                <Link
                  component={RouterLink}
                  to="/refund"
                  style={{
                    color: '#b0b0b0',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'color 0.3s',
                  }}
                  onMouseEnter={(e) => (e.target.style.color = '#ff69b4')}
                  onMouseLeave={(e) => (e.target.style.color = '#b0b0b0')}
                >
                  Refund Policy
                </Link>
              </Box>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Typography
              variant="h6"
              style={{
                fontWeight: 700,
                marginBottom: '20px',
                color: '#ff69b4',
              }}
            >
              Contact Us
            </Typography>
            <Box style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Box style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <LocationOn style={{ color: '#ff69b4', fontSize: '20px' }} />
                <Typography variant="body2" style={{ color: '#b0b0b0', fontSize: '14px' }}>
                  123 Bakery Street,
                  <br />
                  Sweet City, SC 12345
                </Typography>
              </Box>
              <Box style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Phone style={{ color: '#ff69b4', fontSize: '20px' }} />
                <Typography variant="body2" style={{ color: '#b0b0b0', fontSize: '14px' }}>
                  +91 1234567890
                </Typography>
              </Box>
              <Box style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Email style={{ color: '#ff69b4', fontSize: '20px' }} />
                <Typography variant="body2" style={{ color: '#b0b0b0', fontSize: '14px' }}>
                  hello@frostandcrinkle.com
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Divider */}
        <Divider sx={{ background: 'rgba(255, 255, 255, 0.1)', margin: { xs: '20px 0 12px', sm: '30px 0 16px', md: '40px 0 20px' } }} />

        {/* Bottom Bar */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: { xs: 'center', sm: 'space-between' },
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: { xs: '8px', sm: '16px' },
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          <Typography variant="body2" sx={{ color: '#b0b0b0', fontSize: { xs: '12px', sm: '14px' } }}>
            © {currentYear} Frost & Crinkle. All rights reserved.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#b0b0b0',
              fontSize: { xs: '12px', sm: '14px' },
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Made with <Favorite style={{ color: '#ff69b4', fontSize: '16px' }} /> for bakery lovers
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
