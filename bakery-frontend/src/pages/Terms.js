import React from 'react';
import { Container, Box, Typography, Paper, Divider } from '@mui/material';
import CustomerHeader from '../components/CustomerHeader';
import Footer from '../components/Footer';

const Terms = () => {
  return (
    <Box style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CustomerHeader />
      
      <Box style={{ paddingTop: '80px', flex: 1, background: '#f9f9f9' }}>
        <Container maxWidth="md" style={{ padding: '60px 20px' }}>
          <Paper elevation={0} style={{ padding: '60px 40px', borderRadius: '16px' }}>
            <Typography
              variant="h3"
              style={{
                fontWeight: 700,
                marginBottom: '16px',
                color: '#333',
              }}
            >
              Terms of Service
            </Typography>
            <Typography
              variant="body2"
              style={{
                color: '#999',
                marginBottom: '40px',
              }}
            >
              Last updated: {new Date().toLocaleDateString()}
            </Typography>

            <Divider style={{ marginBottom: '32px' }} />

            {/* Section 1 */}
            <Typography variant="h5" style={{ fontWeight: 600, marginBottom: '16px', color: '#333' }}>
              1. Acceptance of Terms
            </Typography>
            <Typography variant="body1" style={{ color: '#666', lineHeight: 1.8, marginBottom: '32px' }}>
              By accessing and using Frost & Crinkle's website and services, you accept and agree to be bound by
              the terms and provision of this agreement. If you do not agree to these terms, please do not use our
              services.
            </Typography>

            {/* Section 2 */}
            <Typography variant="h5" style={{ fontWeight: 600, marginBottom: '16px', color: '#333' }}>
              2. Use of Service
            </Typography>
            <Typography variant="body1" style={{ color: '#666', lineHeight: 1.8, marginBottom: '16px' }}>
              You agree to use our service only for lawful purposes and in accordance with these Terms. You agree
              not to:
            </Typography>
            <Box component="ul" style={{ color: '#666', lineHeight: 1.8, marginBottom: '32px', paddingLeft: '24px' }}>
              <li>Use the service in any way that violates any applicable law or regulation</li>
              <li>Engage in any conduct that restricts or inhibits anyone's use of the service</li>
              <li>Impersonate or attempt to impersonate the company or another user</li>
              <li>Use any automated system to access the service</li>
            </Box>

            {/* Section 3 */}
            <Typography variant="h5" style={{ fontWeight: 600, marginBottom: '16px', color: '#333' }}>
              3. Orders and Payment
            </Typography>
            <Typography variant="body1" style={{ color: '#666', lineHeight: 1.8, marginBottom: '32px' }}>
              All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any
              order for any reason. Prices are subject to change without notice. Payment must be made at the time
              of order placement through our secure payment gateway.
            </Typography>

            {/* Section 4 */}
            <Typography variant="h5" style={{ fontWeight: 600, marginBottom: '16px', color: '#333' }}>
              4. Delivery
            </Typography>
            <Typography variant="body1" style={{ color: '#666', lineHeight: 1.8, marginBottom: '32px' }}>
              We strive to deliver your orders on time. However, delivery times are estimates and not guaranteed.
              We are not liable for any delays caused by circumstances beyond our control. You must provide
              accurate delivery information.
            </Typography>

            {/* Section 5 */}
            <Typography variant="h5" style={{ fontWeight: 600, marginBottom: '16px', color: '#333' }}>
              5. Cancellation and Refunds
            </Typography>
            <Typography variant="body1" style={{ color: '#666', lineHeight: 1.8, marginBottom: '32px' }}>
              Orders can be cancelled within 2 hours of placement for a full refund. After this period,
              cancellations may not be possible as preparation may have begun. Refunds will be processed within
              5-7 business days. Custom orders are non-refundable once production has started.
            </Typography>

            {/* Section 6 */}
            <Typography variant="h5" style={{ fontWeight: 600, marginBottom: '16px', color: '#333' }}>
              6. Product Quality
            </Typography>
            <Typography variant="body1" style={{ color: '#666', lineHeight: 1.8, marginBottom: '32px' }}>
              We take pride in the quality of our products. If you receive a damaged or defective product, please
              contact us within 24 hours of delivery with photos. We will replace the product or issue a refund at
              our discretion.
            </Typography>

            {/* Section 7 */}
            <Typography variant="h5" style={{ fontWeight: 600, marginBottom: '16px', color: '#333' }}>
              7. Intellectual Property
            </Typography>
            <Typography variant="body1" style={{ color: '#666', lineHeight: 1.8, marginBottom: '32px' }}>
              All content on this website, including text, graphics, logos, images, and software, is the property
              of Frost & Crinkle and protected by copyright laws. You may not reproduce, distribute, or create
              derivative works without our written permission.
            </Typography>

            {/* Section 8 */}
            <Typography variant="h5" style={{ fontWeight: 600, marginBottom: '16px', color: '#333' }}>
              8. Limitation of Liability
            </Typography>
            <Typography variant="body1" style={{ color: '#666', lineHeight: 1.8, marginBottom: '32px' }}>
              Frost & Crinkle shall not be liable for any indirect, incidental, special, consequential, or punitive
              damages resulting from your use of or inability to use the service. Our total liability shall not
              exceed the amount paid by you for the product or service.
            </Typography>

            {/* Section 9 */}
            <Typography variant="h5" style={{ fontWeight: 600, marginBottom: '16px', color: '#333' }}>
              9. Changes to Terms
            </Typography>
            <Typography variant="body1" style={{ color: '#666', lineHeight: 1.8, marginBottom: '32px' }}>
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon
              posting to the website. Your continued use of the service after changes constitutes acceptance of the
              new terms.
            </Typography>

            {/* Section 10 */}
            <Typography variant="h5" style={{ fontWeight: 600, marginBottom: '16px', color: '#333' }}>
              10. Contact Information
            </Typography>
            <Typography variant="body1" style={{ color: '#666', lineHeight: 1.8 }}>
              If you have any questions about these Terms, please contact us at:
              <br />
              Email: legal@frostandcrinkle.com
              <br />
              Phone: +91 1234567890
            </Typography>
          </Paper>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Terms;
