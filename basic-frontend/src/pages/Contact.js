import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import { Email, Phone, LocationOn, Send } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { pageTransitions } from '../utils/pageTransitions';
import ScrollReveal from '../components/ScrollReveal';
import Footer from '../components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setShowSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setLoading(false);
      
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: <LocationOn style={{ fontSize: '32px', color: '#e91e63' }} />,
      title: 'Visit Us',
      details: ['Lawly Road, Coimbatore - 641003', 'Online Store - Delivering Across India'],
    },
    {
      icon: <Phone style={{ fontSize: '32px', color: '#e91e63' }} />,
      title: 'Call Us',
      details: ['+91 9629198467', 'Mon-Sun: 9:00 AM - 9:00 PM'],
    },
    {
      icon: <Email style={{ fontSize: '32px', color: '#e91e63' }} />,
      title: 'Email Us',
      details: ['frostandcrinkle@gmail.com'],
    },
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransitions.contact}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box sx={{ paddingTop: { xs: '70px', sm: '80px' }, flex: 1 }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #e91e63 0%, #ff6b9d 100%)',
            color: '#fff',
            padding: { xs: '24px 0', sm: '32px 0' },
            marginBottom: { xs: 2, sm: 3 },
          }}
        >
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                  color: '#fff',
                }}
              >
                Contact Us
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '0.875rem', sm: '0.95rem' },
                  opacity: 0.9,
                  marginTop: 1,
                }}
              >
                Have questions? We're here to help!
              </Typography>
            </motion.div>
          </Container>
        </Box>

        {/* Contact Info Cards */}
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 }, px: { xs: 2, sm: 3 } }}>
          <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
            {contactInfo.map((info, index) => (
              <Grid item xs={12} md={4} key={index}>
                <ScrollReveal animation="slideUp" delay={index * 0.1}>
                <Card 
                  sx={{ 
                    textAlign: 'center', 
                    p: { xs: 3, sm: 4 }, 
                    borderRadius: '8px', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)', 
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      transform: 'translateY(-4px)',
                    }
                  }}
                >
                  <Box sx={{ mb: 2 }}>{info.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333', fontSize: '1.1rem' }}>
                    {info.title}
                  </Typography>
                  {info.details.map((detail, idx) => (
                    <Typography key={idx} variant="body2" sx={{ color: '#666', mb: 0.5, lineHeight: 1.6 }}>
                      {detail}
                    </Typography>
                  ))}
                </Card>
                </ScrollReveal>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Contact Form */}
        <Container maxWidth="md" sx={{ pb: { xs: 6, md: 10 }, px: { xs: 2, sm: 3 } }}>
          <ScrollReveal animation="slideUp">
          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 4, sm: 6 }, 
              borderRadius: '8px', 
              background: '#fff',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                marginBottom: { xs: '12px', sm: '16px' },
                color: '#333',
                textAlign: 'center',
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              }}
            >
              Send Us a Message
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                marginBottom: { xs: '30px', sm: '40px' },
                textAlign: 'center',
                fontSize: { xs: '0.9rem', sm: '1rem' },
                paddingX: { xs: 1, sm: 0 },
              }}
            >
              Whether you have questions about our products, need help with an order, or want to discuss custom cakes, we're here to assist you
            </Typography>

            {showSuccess && (
              <Alert 
                severity="success" 
                style={{ 
                  marginBottom: '24px',
                  borderRadius: '8px',
                }}
              >
                Thank you for contacting us! We will get back to you soon.
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    multiline
                    rows={6}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    startIcon={<Send />}
                    style={{
                      background: 'linear-gradient(135deg, #e91e63 0%, #ff6b9d 100%)',
                      color: '#fff',
                      padding: '14px',
                      fontSize: '16px',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 14px rgba(233, 30, 99, 0.4)',
                    }}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
          </ScrollReveal>
        </Container>

        {/* Map Section (Optional) */}
        <Box sx={{ background: '#f9f9f9', padding: { xs: '40px 0', sm: '60px 0' }, display: 'none' }}>
          <Container maxWidth="lg">
            <Typography
              variant="h4"
              style={{
                fontWeight: 700,
                textAlign: 'center',
                marginBottom: '40px',
                color: '#333',
              }}
            >
              Find Us Here
            </Typography>
            <Box
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                height: '400px',
                background: '#e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="body1" color="textSecondary">
                Map integration coming soon
              </Typography>
            </Box>
          </Container>
        </Box>
        
        {/* Footer */}
        <Footer />
      </Box>
      </Box>
    </motion.div>
  );
};

export default Contact;
