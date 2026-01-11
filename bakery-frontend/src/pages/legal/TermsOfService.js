import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const TermsOfService = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom>
          Terms of Service
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Last Updated: October 31, 2025
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body1" paragraph>
            By accessing and using Frost & Crinkle Bakery's website and services, 
            you accept and agree to be bound by these Terms of Service.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            2. Products and Services
          </Typography>
          <Typography variant="body1" paragraph>
            We offer bakery products for sale through our website. All products are 
            subject to availability. We reserve the right to limit quantities or 
            discontinue products at any time.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            3. Orders and Payment
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>All orders are subject to acceptance and availability</li>
            <li>Prices are in Indian Rupees (₹) and include applicable taxes</li>
            <li>Payment must be made at the time of order placement</li>
            <li>We accept payments through Razorpay (UPI, Cards, Net Banking)</li>
            <li>Order confirmation will be sent via email</li>
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            4. Delivery
          </Typography>
          <Typography variant="body1" paragraph>
            We deliver within specified areas. Delivery times are estimates and not 
            guaranteed. You must provide accurate delivery information.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            5. Cancellation and Refunds
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>Orders can be cancelled before they are confirmed</li>
            <li>Refunds for cancelled orders will be processed within 5-7 business days</li>
            <li>Custom orders may not be eligible for cancellation</li>
            <li>Damaged or incorrect items will be replaced or refunded</li>
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            6. Product Quality
          </Typography>
          <Typography variant="body1" paragraph>
            We strive to provide high-quality products. If you receive a damaged or 
            defective product, please contact us within 24 hours of delivery.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            7. User Accounts
          </Typography>
          <Typography variant="body1" paragraph>
            You are responsible for maintaining the confidentiality of your account 
            credentials. You agree to notify us immediately of any unauthorized use.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            8. Intellectual Property
          </Typography>
          <Typography variant="body1" paragraph>
            All content on this website, including text, images, logos, and designs, 
            is the property of Frost & Crinkle Bakery and protected by copyright laws.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            9. Limitation of Liability
          </Typography>
          <Typography variant="body1" paragraph>
            We are not liable for any indirect, incidental, or consequential damages 
            arising from the use of our services or products.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            10. Changes to Terms
          </Typography>
          <Typography variant="body1" paragraph>
            We reserve the right to modify these terms at any time. Continued use of 
            our services constitutes acceptance of modified terms.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            11. Contact Information
          </Typography>
          <Typography variant="body1">
            For questions about these Terms of Service:<br />
            Email: support@frostcrinkle.com<br />
            Phone: +91-XXXXXXXXXX
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default TermsOfService;
