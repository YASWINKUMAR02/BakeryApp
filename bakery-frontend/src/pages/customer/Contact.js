import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  Phone,
  Email,
  LocationOn,
  Schedule,
  Send,
} from '@mui/icons-material';
import CustomerHeader from '../../components/CustomerHeader';
import { showSuccess, showError } from '../../utils/toast';
import { contactAPI } from '../../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      showError('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      // Send form data to backend
      const response = await contactAPI.send(formData);
      
      if (response.data.success) {
        showSuccess(response.data.message || 'Thank you for contacting us! We will get back to you soon.');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        showError(response.data.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showError('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone style={{ fontSize: 40, color: '#ff69b4' }} />,
      title: 'Phone',
      details: ['+91 98765 43210', '+91 87654 32109'],
    },
    {
      icon: <Email style={{ fontSize: 40, color: '#4caf50' }} />,
      title: 'Email',
      details: ['info@frostandcrinkle.com', 'orders@frostandcrinkle.com'],
    },
    {
      icon: <LocationOn style={{ fontSize: 40, color: '#ff9800' }} />,
      title: 'Address',
      details: ['123 Bakery Street', 'Sweet Town, ST 12345'],
    },
    {
      icon: <Schedule style={{ fontSize: 40, color: '#2196f3' }} />,
      title: 'Business Hours',
      details: ['Mon - Sat: 7:00 AM - 9:00 PM', 'Sunday: 8:00 AM - 8:00 PM'],
    },
  ];

  return (
    <>
      <CustomerHeader />
      
      <Box style={{ minHeight: '100vh', background: '#f5f5f5', paddingTop: '70px' }}>
        {/* Hero Section */}
        <Box
          style={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%), url("https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600&h=400&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay',
            color: '#fff',
            padding: '80px 0',
            textAlign: 'center',
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="h2" style={{ fontWeight: 800, marginBottom: '16px', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
              Get In Touch
            </Typography>
            <Typography variant="h5" style={{ opacity: 0.95, maxWidth: '800px', margin: '0 auto', textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </Typography>
          </Container>
        </Box>

        {/* Contact Info Cards */}
        <Container maxWidth="lg" style={{ padding: '60px 20px' }}>
          <Grid container spacing={4}>
            {contactInfo.map((info, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  style={{
                    height: '100%',
                    textAlign: 'center',
                    padding: '24px',
                    transition: 'all 0.3s ease',
                  }}
                  elevation={2}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                >
                  <CardContent>
                    <Box style={{ marginBottom: '16px' }}>
                      {info.icon}
                    </Box>
                    <Typography variant="h6" style={{ fontWeight: 600, marginBottom: '12px', color: '#1a1a1a' }}>
                      {info.title}
                    </Typography>
                    {info.details.map((detail, idx) => (
                      <Typography key={idx} variant="body2" color="textSecondary" style={{ marginBottom: '4px' }}>
                        {detail}
                      </Typography>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Contact Form Section */}
        <Box style={{ background: '#fff', padding: '60px 0' }}>
          <Container maxWidth="md">
            <Paper style={{ padding: '40px' }} elevation={2}>
              <Typography variant="h4" style={{ fontWeight: 700, marginBottom: '24px', color: '#1a1a1a' }}>
                Send Us a Message
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
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
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Your Message"
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
                      variant="contained"
                      size="large"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} style={{ color: '#fff' }} /> : <Send />}
                      style={{
                        background: loading ? '#ccc' : '#ff69b4',
                        color: '#fff',
                        padding: '12px 36px',
                        fontSize: '16px',
                        fontWeight: 600,
                        textTransform: 'none',
                      }}
                    >
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Container>
        </Box>

        {/* FAQ Section */}
        <Container maxWidth="lg" style={{ padding: '60px 20px' }}>
          <Typography variant="h3" style={{ fontWeight: 700, textAlign: 'center', marginBottom: '48px', color: '#1a1a1a' }}>
            Frequently Asked Questions
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper style={{ padding: '24px', height: '100%' }} elevation={2}>
                <Typography variant="h6" style={{ fontWeight: 600, marginBottom: '12px', color: '#ff69b4' }}>
                  Do you accept custom orders?
                </Typography>
                <Typography variant="body2" color="textSecondary" style={{ lineHeight: 1.7 }}>
                  Yes! We love creating custom cakes and pastries for special occasions. Please contact us at least 48 hours in advance to discuss your requirements.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper style={{ padding: '24px', height: '100%' }} elevation={2}>
                <Typography variant="h6" style={{ fontWeight: 600, marginBottom: '12px', color: '#4caf50' }}>
                  Do you offer delivery?
                </Typography>
                <Typography variant="body2" color="textSecondary" style={{ lineHeight: 1.7 }}>
                  Yes, we offer delivery within a 10km radius. Delivery charges apply based on distance. Orders above ₹500 qualify for free delivery.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper style={{ padding: '24px', height: '100%' }} elevation={2}>
                <Typography variant="h6" style={{ fontWeight: 600, marginBottom: '12px', color: '#ff9800' }}>
                  Are your products fresh?
                </Typography>
                <Typography variant="body2" color="textSecondary" style={{ lineHeight: 1.7 }}>
                  Absolutely! All our products are baked fresh daily using premium ingredients. We never sell day-old items.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper style={{ padding: '24px', height: '100%' }} elevation={2}>
                <Typography variant="h6" style={{ fontWeight: 600, marginBottom: '12px', color: '#2196f3' }}>
                  Do you have eggless options?
                </Typography>
                <Typography variant="body2" color="textSecondary" style={{ lineHeight: 1.7 }}>
                  Yes, we offer a wide range of eggless products. Look for the eggless tag on our menu or ask our staff for recommendations.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Contact;
