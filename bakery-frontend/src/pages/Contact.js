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
} from '@mui/material';
import { Email, Phone, LocationOn, Send } from '@mui/icons-material';
import CustomerHeader from '../components/CustomerHeader';
import Footer from '../components/Footer';
import { showSuccess, showError } from '../utils/toast';

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
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      showSuccess('Thank you for contacting us! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setLoading(false);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: <LocationOn style={{ fontSize: '32px', color: '#e91e63' }} />,
      title: 'Visit Us',
      details: ['123 Bakery Street', 'Sweet City, SC 12345'],
    },
    {
      icon: <Phone style={{ fontSize: '32px', color: '#e91e63' }} />,
      title: 'Call Us',
      details: ['+91 1234567890', 'Mon-Sat: 9AM - 8PM'],
    },
    {
      icon: <Email style={{ fontSize: '32px', color: '#e91e63' }} />,
      title: 'Email Us',
      details: ['hello@frostandcrinkle.com', 'support@frostandcrinkle.com'],
    },
  ];

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CustomerHeader />

      <Box style={{ paddingTop: '80px', flex: 1 }}>
        {/* Hero Section */}
        <Box
          style={{
            background: 'linear-gradient(135deg, #e91e63 0%, #ff6b9d 100%)',
            color: '#fff',
            padding: '80px 0',
            textAlign: 'center',
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h2"
              style={{
                fontWeight: 700,
                marginBottom: '20px',
              }}
            >
              Get In Touch
            </Typography>
            <Typography
              variant="h5"
              style={{
                fontWeight: 400,
                opacity: 0.95,
              }}
            >
              We'd love to hear from you
            </Typography>
          </Container>
        </Box>

        {/* Contact Info Cards */}
        <Container maxWidth="lg" style={{ marginTop: '-40px', marginBottom: '60px' }}>
          <Grid container spacing={3}>
            {contactInfo.map((info, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  style={{
                    textAlign: 'center',
                    padding: '32px 20px',
                    borderRadius: '16px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                    height: '100%',
                  }}
                >
                  <CardContent>
                    <Box style={{ marginBottom: '16px' }}>{info.icon}</Box>
                    <Typography
                      variant="h6"
                      style={{
                        fontWeight: 600,
                        marginBottom: '12px',
                        color: '#333',
                      }}
                    >
                      {info.title}
                    </Typography>
                    {info.details.map((detail, idx) => (
                      <Typography
                        key={idx}
                        variant="body2"
                        style={{
                          color: '#666',
                          marginBottom: '4px',
                        }}
                      >
                        {detail}
                      </Typography>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Contact Form */}
        <Container maxWidth="md" style={{ padding: '60px 20px' }}>
          <Paper elevation={0} style={{ padding: '60px 40px', borderRadius: '16px' }}>
            <Typography
              variant="h4"
              style={{
                fontWeight: 700,
                marginBottom: '16px',
                color: '#333',
                textAlign: 'center',
              }}
            >
              Send Us a Message
            </Typography>
            <Typography
              variant="body1"
              style={{
                color: '#666',
                marginBottom: '40px',
                textAlign: 'center',
              }}
            >
              Fill out the form below and we'll get back to you as soon as possible
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
        </Container>

        {/* Map Section (Optional) */}
        <Box style={{ background: '#f9f9f9', padding: '60px 0' }}>
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
      </Box>

      <Footer />
    </Box>
  );
};

export default Contact;
