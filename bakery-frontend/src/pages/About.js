import React from 'react';
import { Container, Box, Typography, Grid, Paper, Card, CardContent } from '@mui/material';
import { Cake, LocalShipping, Favorite, Star } from '@mui/icons-material';
import CustomerHeader from '../components/CustomerHeader';
import Footer from '../components/Footer';

const About = () => {
  const values = [
    {
      icon: <Cake style={{ fontSize: '48px', color: '#e91e63' }} />,
      title: 'Quality Ingredients',
      description: 'We use only the finest, freshest ingredients in all our baked goods.',
    },
    {
      icon: <LocalShipping style={{ fontSize: '48px', color: '#e91e63' }} />,
      title: 'Fast Delivery',
      description: 'Fresh products delivered to your doorstep with care and speed.',
    },
    {
      icon: <Favorite style={{ fontSize: '48px', color: '#e91e63' }} />,
      title: 'Made with Love',
      description: 'Every item is crafted with passion and attention to detail.',
    },
    {
      icon: <Star style={{ fontSize: '48px', color: '#e91e63' }} />,
      title: 'Customer Satisfaction',
      description: 'Your happiness is our priority. We strive for perfection in every order.',
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
              About Frost & Crinkle
            </Typography>
            <Typography
              variant="h5"
              style={{
                fontWeight: 400,
                opacity: 0.95,
              }}
            >
              Baking happiness since day one
            </Typography>
          </Container>
        </Box>

        {/* Story Section */}
        <Container maxWidth="lg" style={{ padding: '80px 20px' }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                style={{
                  fontWeight: 700,
                  marginBottom: '24px',
                  color: '#333',
                }}
              >
                Our Story
              </Typography>
              <Typography
                variant="body1"
                style={{
                  color: '#666',
                  fontSize: '18px',
                  lineHeight: 1.8,
                  marginBottom: '20px',
                }}
              >
                Frost & Crinkle was born from a simple passion: creating delicious, high-quality
                baked goods that bring joy to every occasion. What started as a small home bakery
                has grown into a beloved online destination for cake lovers everywhere.
              </Typography>
              <Typography
                variant="body1"
                style={{
                  color: '#666',
                  fontSize: '18px',
                  lineHeight: 1.8,
                }}
              >
                We believe that every celebration deserves the perfect cake, every morning deserves
                fresh bread, and every moment deserves a sweet treat. That's why we pour our hearts
                into every recipe, using only the finest ingredients and time-honored techniques.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                style={{
                  background: 'linear-gradient(135deg, #fef5f9 0%, #ffe8f0 100%)',
                  borderRadius: '16px',
                  padding: '40px',
                  textAlign: 'center',
                }}
              >
                <Typography
                  variant="h1"
                  style={{
                    fontWeight: 700,
                    color: '#e91e63',
                    marginBottom: '16px',
                  }}
                >
                  1000+
                </Typography>
                <Typography
                  variant="h6"
                  style={{
                    color: '#666',
                    marginBottom: '32px',
                  }}
                >
                  Happy Customers
                </Typography>
                <Typography
                  variant="h1"
                  style={{
                    fontWeight: 700,
                    color: '#e91e63',
                    marginBottom: '16px',
                  }}
                >
                  50+
                </Typography>
                <Typography
                  variant="h6"
                  style={{
                    color: '#666',
                  }}
                >
                  Delicious Products
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Values Section */}
        <Box style={{ background: '#f9f9f9', padding: '80px 0' }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              style={{
                fontWeight: 700,
                textAlign: 'center',
                marginBottom: '60px',
                color: '#333',
              }}
            >
              Our Values
            </Typography>
            <Grid container spacing={4}>
              {values.map((value, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card
                    style={{
                      height: '100%',
                      textAlign: 'center',
                      padding: '32px 20px',
                      borderRadius: '16px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                      transition: 'transform 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <CardContent>
                      <Box style={{ marginBottom: '20px' }}>{value.icon}</Box>
                      <Typography
                        variant="h6"
                        style={{
                          fontWeight: 600,
                          marginBottom: '12px',
                          color: '#333',
                        }}
                      >
                        {value.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{
                          color: '#666',
                          lineHeight: 1.6,
                        }}
                      >
                        {value.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Mission Section */}
        <Container maxWidth="md" style={{ padding: '80px 20px' }}>
          <Paper
            elevation={0}
            style={{
              padding: '60px 40px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #e91e63 0%, #ff6b9d 100%)',
              color: '#fff',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h4"
              style={{
                fontWeight: 700,
                marginBottom: '24px',
              }}
            >
              Our Mission
            </Typography>
            <Typography
              variant="h6"
              style={{
                fontWeight: 400,
                lineHeight: 1.8,
                opacity: 0.95,
              }}
            >
              To spread happiness through exceptional baked goods, one delicious creation at a time.
              We're committed to quality, sustainability, and making every customer's experience
              memorable.
            </Typography>
          </Paper>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default About;
