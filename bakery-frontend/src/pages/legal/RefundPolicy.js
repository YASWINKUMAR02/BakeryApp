import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const RefundPolicy = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom>
          Refund & Cancellation Policy
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Last Updated: October 31, 2025
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            1. Order Cancellation
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Before Order Confirmation:</strong> You can cancel your order 
            free of charge before it is confirmed by our team.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>After Order Confirmation:</strong> Once confirmed, orders cannot 
            be cancelled as preparation has begun. However, exceptions may be made 
            on a case-by-case basis.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            2. Refund Eligibility
          </Typography>
          <Typography variant="body1" paragraph>
            You are eligible for a full refund in the following cases:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>Order cancelled before confirmation</li>
            <li>Damaged products received</li>
            <li>Wrong items delivered</li>
            <li>Quality issues with the product</li>
            <li>Non-delivery of order</li>
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            3. Refund Process
          </Typography>
          <Typography variant="body1" component="ol" sx={{ pl: 3 }}>
            <li>Contact us within 24 hours of delivery for quality issues</li>
            <li>Provide order details and photos (if applicable)</li>
            <li>Our team will review your request within 24-48 hours</li>
            <li>Approved refunds are processed within 5-7 business days</li>
            <li>Refund will be credited to the original payment method</li>
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            4. Non-Refundable Items
          </Typography>
          <Typography variant="body1" paragraph>
            The following are not eligible for refunds:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>Custom-made or personalized items</li>
            <li>Orders delivered and accepted without complaint</li>
            <li>Change of mind after order confirmation</li>
            <li>Perishable items consumed or partially consumed</li>
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            5. Replacement Option
          </Typography>
          <Typography variant="body1" paragraph>
            Instead of a refund, you may choose to receive a replacement for:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>Damaged items</li>
            <li>Wrong items delivered</li>
            <li>Quality issues</li>
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            6. Partial Refunds
          </Typography>
          <Typography variant="body1" paragraph>
            Partial refunds may be granted in cases where only some items in an 
            order are affected by quality or delivery issues.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            7. Refund Timeline
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li><strong>UPI/Wallet:</strong> 1-3 business days</li>
            <li><strong>Credit/Debit Card:</strong> 5-7 business days</li>
            <li><strong>Net Banking:</strong> 5-7 business days</li>
          </Typography>
          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            Note: Actual credit time may vary depending on your bank or payment provider.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            8. How to Request a Refund
          </Typography>
          <Typography variant="body1" paragraph>
            To request a refund:
          </Typography>
          <Typography variant="body1" component="ol" sx={{ pl: 3 }}>
            <li>Log in to your account</li>
            <li>Go to Order History</li>
            <li>Select the order and click "Request Refund"</li>
            <li>Or email us at refunds@frostcrinkle.com with order details</li>
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            9. Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            For refund-related queries:
          </Typography>
          <Typography variant="body1">
            Email: refunds@frostcrinkle.com<br />
            Phone: +91-XXXXXXXXXX<br />
            Hours: 9:00 AM - 6:00 PM (Mon-Sat)
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default RefundPolicy;
