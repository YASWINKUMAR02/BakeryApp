import React from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Cake,
  LocalShipping,
  EmojiEvents,
  Favorite,
  Schedule,
  VerifiedUser,
} from '@mui/icons-material';
import CustomerHeader from '../../components/CustomerHeader';

const AboutUs = () => {
  const features = [
    {
      icon: <Cake style={{ fontSize: 48, color: '#ff69b4' }} />,
      title: 'Fresh Daily',
      description: 'All our products are baked fresh every morning using the finest ingredients and traditional recipes.',
    },
    {
      icon: <LocalShipping style={{ fontSize: 48, color: '#4caf50' }} />,
      title: 'Fast Delivery',
      description: 'Quick and reliable delivery service to ensure your treats arrive fresh at your doorstep.',
    },
    {
      icon: <EmojiEvents style={{ fontSize: 48, color: '#ff9800' }} />,
      title: 'Award Winning',
      description: 'Recognized for excellence in baking with multiple awards for quality and taste.',
    },
    {
      icon: <Favorite style={{ fontSize: 48, color: '#e91e63' }} />,
      title: 'Made with Love',
      description: 'Every item is crafted with passion and attention to detail by our expert bakers.',
    },
    {
      icon: <Schedule style={{ fontSize: 48, color: '#2196f3' }} />,
      title: 'Open 7 Days',
      description: 'We are open every day to serve you the best baked goods whenever you need them.',
    },
    {
      icon: <VerifiedUser style={{ fontSize: 48, color: '#9c27b0' }} />,
      title: 'Quality Assured',
      description: 'We maintain the highest standards of hygiene and quality in all our products.',
    },
  ];

  return (
    <>
      <CustomerHeader />
      
      <Box style={{ minHeight: '100vh', background: '#f5f5f5', paddingTop: '70px' }}>
        {/* Hero Section */}
        <Box
          style={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%), url("https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=1600&h=400&fit=crop")',
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
              About Frost & Crinkle
            </Typography>
            <Typography variant="h5" style={{ opacity: 0.95, maxWidth: '800px', margin: '0 auto', textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>
              Crafting Sweet Memories Since Our Beginning
            </Typography>
          </Container>
        </Box>

        {/* Story Section */}
        <Container maxWidth="lg" style={{ padding: '60px 20px' }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                style={{
                  height: '400px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=800&h=600&fit=crop"
                  alt="Frost & Crinkle Bakery"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h3" style={{ fontWeight: 700, marginBottom: '24px', color: '#1a1a1a' }}>
                Our Story
              </Typography>
              <Typography variant="body1" style={{ fontSize: '18px', lineHeight: 1.8, color: '#666', marginBottom: '16px' }}>
                Frost & Crinkle was born from a passion for creating delightful baked goods that bring joy to every occasion. 
                What started as a small family bakery has grown into a beloved destination for quality pastries, cakes, and breads.
              </Typography>
              <Typography variant="body1" style={{ fontSize: '18px', lineHeight: 1.8, color: '#666', marginBottom: '16px' }}>
                Our commitment to using premium ingredients, time-honored techniques, and innovative recipes has made us 
                a trusted name in the community. Every product that leaves our kitchen is a testament to our dedication 
                to excellence and our love for the art of baking.
              </Typography>
              <Typography variant="body1" style={{ fontSize: '18px', lineHeight: 1.8, color: '#666' }}>
                We believe that great food brings people together, and we're honored to be part of your special moments, 
                celebrations, and everyday pleasures.
              </Typography>
            </Grid>
          </Grid>
        </Container>

        {/* Features Section */}
        <Box style={{ background: '#fff', padding: '60px 0' }}>
          <Container maxWidth="lg">
            <Typography variant="h3" style={{ fontWeight: 700, textAlign: 'center', marginBottom: '48px', color: '#1a1a1a' }}>
              Why Choose Us
            </Typography>
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    style={{
                      height: '100%',
                      textAlign: 'center',
                      padding: '24px',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
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
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" style={{ fontWeight: 600, marginBottom: '12px', color: '#1a1a1a' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" style={{ lineHeight: 1.6 }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Mission Section */}
        <Container maxWidth="lg" style={{ padding: '60px 20px' }}>
          <Paper style={{ padding: '48px', textAlign: 'center', background: 'linear-gradient(135deg, #fef6ee 0%, #fdecd7 100%)' }}>
            <Typography variant="h3" style={{ fontWeight: 700, marginBottom: '24px', color: '#1a1a1a' }}>
              Our Mission
            </Typography>
            <Typography variant="h6" style={{ lineHeight: 1.8, color: '#666', maxWidth: '900px', margin: '0 auto' }}>
              To create exceptional baked goods that delight our customers and bring sweetness to their lives. 
              We strive to maintain the highest standards of quality, freshness, and service while fostering a 
              warm and welcoming environment for our community.
            </Typography>
          </Paper>
        </Container>

        {/* Values Section */}
        <Box style={{ background: '#fff', padding: '60px 0' }}>
          <Container maxWidth="lg">
            <Typography variant="h3" style={{ fontWeight: 700, textAlign: 'center', marginBottom: '48px', color: '#1a1a1a' }}>
              Our Values
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Paper style={{ padding: '32px', textAlign: 'center', height: '100%' }} elevation={2}>
                  <Typography variant="h5" style={{ fontWeight: 600, marginBottom: '16px', color: '#ff69b4' }}>
                    Quality First
                  </Typography>
                  <Typography variant="body1" color="textSecondary" style={{ lineHeight: 1.7 }}>
                    We never compromise on the quality of our ingredients or the care we put into every product.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper style={{ padding: '32px', textAlign: 'center', height: '100%' }} elevation={2}>
                  <Typography variant="h5" style={{ fontWeight: 600, marginBottom: '16px', color: '#4caf50' }}>
                    Customer Satisfaction
                  </Typography>
                  <Typography variant="body1" color="textSecondary" style={{ lineHeight: 1.7 }}>
                    Your happiness is our priority. We go above and beyond to ensure every experience is memorable.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper style={{ padding: '32px', textAlign: 'center', height: '100%' }} elevation={2}>
                  <Typography variant="h5" style={{ fontWeight: 600, marginBottom: '16px', color: '#ff9800' }}>
                    Innovation
                  </Typography>
                  <Typography variant="body1" color="textSecondary" style={{ lineHeight: 1.7 }}>
                    While respecting tradition, we continuously innovate to bring you exciting new flavors and creations.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default AboutUs;
