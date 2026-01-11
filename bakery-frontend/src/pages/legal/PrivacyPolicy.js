import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Last Updated: October 31, 2025
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            1. Information We Collect
          </Typography>
          <Typography variant="body1" paragraph>
            We collect information you provide directly to us, including:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>Name, email address, and phone number</li>
            <li>Delivery address and contact information</li>
            <li>Order history and preferences</li>
            <li>Payment information (processed securely through Razorpay)</li>
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            2. How We Use Your Information
          </Typography>
          <Typography variant="body1" paragraph>
            We use the information we collect to:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>Process and fulfill your orders</li>
            <li>Send order confirmations and updates</li>
            <li>Respond to your comments and questions</li>
            <li>Improve our products and services</li>
            <li>Send promotional communications (with your consent)</li>
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            3. Information Sharing
          </Typography>
          <Typography variant="body1" paragraph>
            We do not sell, trade, or rent your personal information to third parties. 
            We may share your information with:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>Payment processors (Razorpay) to process transactions</li>
            <li>Delivery partners to fulfill orders</li>
            <li>Service providers who assist in our operations</li>
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            4. Data Security
          </Typography>
          <Typography variant="body1" paragraph>
            We implement appropriate security measures to protect your personal information. 
            However, no method of transmission over the Internet is 100% secure.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            5. Your Rights
          </Typography>
          <Typography variant="body1" paragraph>
            You have the right to:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt-out of marketing communications</li>
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            6. Cookies
          </Typography>
          <Typography variant="body1" paragraph>
            We use cookies and similar technologies to enhance your experience, 
            analyze usage, and assist in our marketing efforts.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            7. Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            If you have questions about this Privacy Policy, please contact us at:
          </Typography>
          <Typography variant="body1">
            Email: privacy@frostcrinkle.com<br />
            Phone: +91-XXXXXXXXXX
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicy;
