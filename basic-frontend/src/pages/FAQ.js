import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Grid,
} from '@mui/material';
import { ExpandMore, LocalShipping, Cake, Payment, Help, Restaurant, Star, Email, Phone } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import { pageTransitions } from '../utils/pageTransitions';

const FAQ = () => {
  const [expanded, setExpanded] = useState('panel1');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const categories = [
    { name: 'All', icon: <Help />, color: '#e91e63' },
    { name: 'Delivery', icon: <LocalShipping />, color: '#2196f3' },
    { name: 'Products', icon: <Cake />, color: '#ff9800' },
    { name: 'Orders', icon: <Restaurant />, color: '#4caf50' },
    { name: 'Payment', icon: <Payment />, color: '#9c27b0' },
    { name: 'Quality', icon: <Star />, color: '#f44336' },
  ];

  const faqs = [
    {
      id: 'panel1',
      category: 'Delivery',
      question: 'What are your delivery areas?',
      answer: 'We currently deliver across major cities in India. Delivery charges may vary based on your location. Free delivery is available on orders above ₹500 within city limits.'
    },
    {
      id: 'panel2',
      category: 'Quality',
      question: 'How fresh are your products?',
      answer: 'All our products are baked fresh daily using premium quality ingredients. We ensure that every order is prepared fresh and delivered within 24 hours of baking for maximum freshness and taste.'
    },
    {
      id: 'panel3',
      category: 'Products',
      question: 'Can I customize my cake?',
      answer: 'Yes! We offer fully customized cakes for birthdays, anniversaries, and special occasions. You can choose the flavor, design, size, and add personalized messages. Contact us at least 48 hours in advance for custom orders.'
    },
    {
      id: 'panel4',
      category: 'Orders',
      question: 'What is your cancellation policy?',
      answer: 'Orders can be cancelled up to 12 hours before the scheduled delivery time for a full refund. Cancellations made within 12 hours of delivery will incur a 50% cancellation fee as the product preparation may have already begun.'
    },
    {
      id: 'panel5',
      category: 'Quality',
      question: 'Do you use preservatives?',
      answer: 'No, we do not use any artificial preservatives in our products. All our brownies, cakes, and desserts are made with natural, high-quality ingredients. This is why we recommend consuming them within 2-3 days for the best taste and freshness.'
    },
    {
      id: 'panel6',
      category: 'Payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major payment methods including credit/debit cards, UPI, net banking, and digital wallets. Cash on delivery is also available for select locations.'
    },
    {
      id: 'panel7',
      category: 'Products',
      question: 'How should I store the products?',
      answer: 'Store brownies and cookies in an airtight container at room temperature for up to 3 days. Cakes with cream or frosting should be refrigerated and consumed within 2 days. Bring refrigerated items to room temperature 30 minutes before serving for the best taste.'
    },
    {
      id: 'panel8',
      category: 'Products',
      question: 'Do you cater to dietary restrictions?',
      answer: 'Yes, we offer eggless options for most of our products. Please specify your requirements while placing the order. We are also working on introducing vegan and sugar-free options soon.'
    },
    {
      id: 'panel9',
      category: 'Orders',
      question: 'What is the minimum order value?',
      answer: 'The minimum order value is ₹200. However, we recommend ordering at least ₹500 to avail free delivery within city limits.'
    },
    {
      id: 'panel10',
      category: 'Delivery',
      question: 'How can I track my order?',
      answer: 'Once your order is confirmed, you will receive a tracking link via SMS and email. You can use this link to track your order in real-time and get updates on the delivery status.'
    },
    {
      id: 'panel11',
      category: 'Delivery',
      question: 'What are your delivery timings?',
      answer: 'We deliver between 10 AM to 9 PM on all days. You can choose your preferred delivery slot while placing the order. Same-day delivery is available for orders placed before 2 PM.'
    },
    {
      id: 'panel12',
      category: 'Payment',
      question: 'Is my payment information secure?',
      answer: 'Yes, absolutely! We use industry-standard encryption and secure payment gateways. We never store your complete card details on our servers. All transactions are processed through PCI-DSS compliant payment partners.'
    },
    {
      id: 'panel13',
      category: 'Orders',
      question: 'Can I modify my order after placing it?',
      answer: 'Yes, you can modify your order within 2 hours of placing it by contacting our customer support. After that, modifications may not be possible as we begin preparing your order.'
    },
    {
      id: 'panel14',
      category: 'Quality',
      question: 'Are your products FSSAI certified?',
      answer: 'Yes, we are FSSAI certified and follow all food safety standards. Our kitchen maintains the highest hygiene standards and our staff is trained in food safety protocols.'
    },
  ];

  const filteredFaqs = selectedCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransitions.faq}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box sx={{ paddingTop: { xs: '80px', sm: '100px' }, paddingBottom: { xs: '40px', sm: '60px' }, flex: 1 }}>
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
                  FAQ
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '0.875rem', sm: '0.95rem' },
                    opacity: 0.9,
                    marginTop: 1,
                  }}
                >
                  Find answers to common questions
                </Typography>
              </motion.div>
            </Container>
          </Box>

          {/* FAQ Section */}
          <Container maxWidth="md" sx={{ marginTop: { xs: 4, sm: 6 }, paddingX: { xs: 2, sm: 3 } }}>
            
            {/* Category Filter */}
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 600, 
                  color: '#333',
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}
              >
                Browse by Category
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 1.5, 
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'center', sm: 'flex-start' }
                }}
              >
                {categories.map((category) => (
                  <motion.div
                    key={category.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Chip
                      icon={category.icon}
                      label={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      sx={{
                        px: 1,
                        py: 2.5,
                        fontSize: { xs: '0.85rem', sm: '0.9rem' },
                        fontWeight: 600,
                        backgroundColor: selectedCategory === category.name ? category.color : '#f5f5f5',
                        color: selectedCategory === category.name ? '#fff' : '#666',
                        border: `2px solid ${selectedCategory === category.name ? category.color : 'transparent'}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: selectedCategory === category.name ? category.color : '#e0e0e0',
                          transform: 'translateY(-2px)',
                        },
                        '& .MuiChip-icon': {
                          color: selectedCategory === category.name ? '#fff' : category.color,
                        },
                      }}
                    />
                  </motion.div>
                ))}
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  mt: 2, 
                  color: '#666',
                  fontSize: { xs: '0.85rem', sm: '0.9rem' }
                }}
              >
                Showing {filteredFaqs.length} question{filteredFaqs.length !== 1 ? 's' : ''}
              </Typography>
            </Box>

            <Box sx={{ marginBottom: 6 }}>
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Accordion
                    expanded={expanded === faq.id}
                    onChange={handleChange(faq.id)}
                    sx={{
                      marginBottom: 2,
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      overflow: 'hidden',
                      '&:before': {
                        display: 'none',
                      },
                      '&.Mui-expanded': {
                        margin: '0 0 16px 0',
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore sx={{ color: '#e91e63' }} />}
                      sx={{
                        backgroundColor: expanded === faq.id ? '#fef5f9' : '#fff',
                        borderLeft: expanded === faq.id ? '4px solid #e91e63' : '4px solid transparent',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#fef5f9',
                        },
                        '& .MuiAccordionSummary-content': {
                          margin: '16px 0',
                        },
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: '#333',
                          fontSize: { xs: '1rem', sm: '1.1rem' },
                        }}
                      >
                        {faq.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{
                        padding: { xs: 2, sm: 3 },
                        backgroundColor: '#fff',
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#666',
                          lineHeight: 1.8,
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                        }}
                      >
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </motion.div>
              ))}
            </Box>

            {/* Contact Section */}
            <Box
              sx={{
                padding: { xs: 3, sm: 4 },
                background: 'linear-gradient(135deg, #fef5f9 0%, #ffe8f0 100%)',
                textAlign: 'center',
                marginBottom: 6,
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  marginBottom: 2,
                  color: '#333',
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                }}
              >
                Still have questions?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#666',
                  marginBottom: 3,
                  lineHeight: 1.6,
                }}
              >
                Can't find the answer you're looking for? Please reach out to our customer support team.
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email sx={{ color: '#e91e63' }} />
                  <Typography variant="body1" sx={{ color: '#e91e63', fontWeight: 600 }}>
                    frostandcrinkle@gmail.com
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone sx={{ color: '#e91e63' }} />
                  <Typography variant="body1" sx={{ color: '#e91e63', fontWeight: 600 }}>
                    +91 9629198467
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Footer */}
        <Footer />
      </Box>
    </motion.div>
  );
};

export default FAQ;
