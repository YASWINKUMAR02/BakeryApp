import React from 'react';
import { Container, Box, Typography, Paper, Divider } from '@mui/material';
import CustomerHeader from '../components/CustomerHeader';
import Footer from '../components/Footer';

const Privacy = () => {
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
              Privacy Policy
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

            {/* Introduction */}
            <Typography variant="body1" style={{ color: '#666', lineHeight: 1.8, marginBottom: '32px' }}>
              At Frost & Crinkle, we are committed to protecting your privacy. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you visit our website and use our
              services.
            </Typography>

            {/* Section 1 */}
            <Typography variant="h5" style={{ fontWeight: 600, marginBottom: '16px', color: '#333' }}>
              1. Information We Collect
            </Typography>
            <Typography variant="body1" style={{ color: '#666', lineHeight: 1.8, marginBottom: '16px' }}>
              We collect information that you provide directly to us, including:
            </Typography>
            <Box component="ul" style={{ color: '#666', lineHeight: 1.8, marginBottom: '32px', paddingLeft: '24px' }}>
              <li>Name, email address, and phone number</li>
              <li>Delivery address and location information</li>
              <li>Payment information (processed securely through Razorpay)</li>
              <li>Order history and preferences</li>
              <li>Communications with customer support</li>
            </Box>

            {/* Section 2 */}
            <Typography variant="h5" style={{ fontWeight: 600, marginBottom: '16px', color: '#333' }}>
              2. How We Use Your Information
            </Typography>
            <Typography variant="body1" style={{ color: '#666', lineHeight: 1.8, marginBottom: '16px' }}>
              We use the information we collect to:
            </Typography>
            <Box component="ul" style={{ color: '#666', lineHeight: 1.8, marginBottom: '32px', paddingLeft: '24px' }}>
              <li>Process and fulfill your orders</li>
              <li>Send order confirmations and delivery updates</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Improve our products and services</li>
              <li>Send promotional communications (with your consent)</li>
              <li>Detect and prevent fraud</li>
            </Box>

            {/* Section 3 */}
            <Typography variant="h5" style={{ fontWeight: 600, marginBottom: '16px', color: '#333' }}>
              3. Information Sharing
            </Typography>
            <Typography variant="body1" style={{ color: '#666', lineHeight: 1.8, marginBottom: '32px' }}>
              We do not sell your personal information. We may share your information with:
              <br />
              <br />
              • <strong>Service Providers:</strong> Third-party vendors who help us operate our business (payment
              processors, delivery services)
              <br />
              • <strong>Legal Requirements:</strong> When required by law or to protect our rights
              <br />
              • <strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition
            </Typography>

            {/* Section 4 */}
            <Typography variant="h5" style={{ fontWeight: 600, marginBottom: '16px', color: '#333' }}>
              4. Data Security
            </Typography>
            <Typography variant="body1" style={{ color: '#666', lineHeight: 1.8, marginBottom: '32px' }}>
              We implement appropriate technical and organizational measures to protect your personal information.
              However, no method of transmission over the internet is 100% secure. We use industry-standard
              encryption for sensitive data and regularly update our security practices.
            </Typography>

            {/* Section 5 */}
            <Typography variant="h5" style={{ fontWeight: 600, marginBottom: '16px', color: '#333' }}>
              5. Cookies and Tracking
            </Typography>
            <Typography variant="body1" style={{ color: '#666', lineHeight: 1.8, marginBottom: '32px' }}>
              We use cookies and similar tracking technologies to enhance your experience. Cookies help us remember
              your preferences, analyze site traffic, and personalize content. You can control cookies through your
              browser settings.
            </Typography>

            {/* Section 6 */}
            <Typography variant="h5" style={{ fontWeight: 600, marginBottom: '16px', color: '#333' }}>
              6. Your Rights
            </Typography>
            <Typography variant="body1" style={{ color: '#666', lineHeight: 1.8, marginBottom: '16px' }}>
              You have the right to:
            </Typography>
            <Box component="ul" style={{ color: '#666', lineHeight: 1.8, marginBottom: '32px', paddingLeft: '24px' }}>
              <li>Access and receive a copy of your personal data</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your personal data</li>
              <li>Object to or restrict processing of your data</li>
              <li>Withdraw consent for marketing communications</li>
            </Box>

            {/* Section 7 */}
            <Typography variant="h5" style={{ fontWeight: 600, marginBottom: '16px', color: '#333' }}>
              7. Children's Privacy
            </Typography>
            <Typography variant="body1" style={{ color: '#666', lineHeight: 1.8, marginBottom: '32px' }}>
              Our services are not directed to children under 13. We do not knowingly collect personal information
              from children. If you believe we have collected information from a child, please contact us
              immediately.
            </Typography>

            {/* Section 8 */}
            <Typography variant="h5" style={{ fontWeight: 600, marginBottom: '16px', color: '#333' }}>
              8. Data Retention
            </Typography>
            <Typography variant="body1" style={{ color: '#666', lineHeight: 1.8, marginBottom: '32px' }}>
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this
              policy, unless a longer retention period is required by law. Order information is retained for
              accounting and legal purposes.
            </Typography>

            {/* Section 9 */}
            <Typography variant="h5" style={{ fontWeight: 600, marginBottom: '16px', color: '#333' }}>
              9. Changes to Privacy Policy
            </Typography>
            <Typography variant="body1" style={{ color: '#666', lineHeight: 1.8, marginBottom: '32px' }}>
              We may update this Privacy Policy from time to time. We will notify you of significant changes by
              posting the new policy on this page and updating the "Last updated" date.
            </Typography>

            {/* Section 10 */}
            <Typography variant="h5" style={{ fontWeight: 600, marginBottom: '16px', color: '#333' }}>
              10. Contact Us
            </Typography>
            <Typography variant="body1" style={{ color: '#666', lineHeight: 1.8 }}>
              If you have questions about this Privacy Policy or our data practices, please contact us at:
              <br />
              <br />
              Email: privacy@frostandcrinkle.com
              <br />
              Phone: +91 1234567890
              <br />
              Address: 123 Bakery Street, Sweet City, SC 12345
            </Typography>
          </Paper>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Privacy;
