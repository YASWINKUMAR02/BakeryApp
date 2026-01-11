import React from 'react';
import { Box, Container, Typography, Grid, IconButton } from '@mui/material';
import { Instagram, FavoriteBorder, ChatBubbleOutline } from '@mui/icons-material';
import { motion } from 'framer-motion';

// Import sample images
import img1 from '../sample-images/570961690_18312117046219264_427735923425516223_n.webp';
import img2 from '../sample-images/572136977_18312086584219264_3234845735325165628_n.webp';
import img3 from '../sample-images/572720764_18311989669219264_1318692590944923299_n.webp';
import img4 from '../sample-images/572970496_18311990575219264_2197306569340814514_n.webp';
import img5 from '../sample-images/573598986_18311989333219264_6181450640736486889_n.webp';
import img6 from '../sample-images/573845599_18312400399219264_8377656131075075876_n.webp';

const InstagramFeed = () => {
  const instagramPosts = [
    { id: 1, image: img1, likes: '245', comments: '18' },
    { id: 2, image: img2, likes: '312', comments: '24' },
    { id: 3, image: img3, likes: '189', comments: '15' },
    { id: 4, image: img4, likes: '276', comments: '21' },
    { id: 5, image: img5, likes: '198', comments: '12' },
    { id: 6, image: img6, likes: '234', comments: '19' },
  ];

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, background: '#f9f9f9' }}>
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
              <Instagram sx={{ fontSize: '2rem', color: '#e91e63' }} />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: '#333',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                }}
              >
                Follow Us on Instagram
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                fontSize: { xs: '0.9rem', sm: '1rem' },
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
                mb: 2,
              }}
            >
              Stay updated with our latest creations, behind-the-scenes moments, and special offers
            </Typography>
            <motion.a
              href="https://www.instagram.com/frost_and_crinkle?igsh=bzVoaGVlMm1uaG1q"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 3,
                  py: 1.5,
                  background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                  color: '#fff',
                  borderRadius: '25px',
                  fontWeight: 600,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  boxShadow: '0 4px 12px rgba(233, 30, 99, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(233, 30, 99, 0.4)',
                  },
                }}
              >
                <Instagram />
                @frost_and_crinkle
              </Box>
            </motion.a>
          </motion.div>
        </Box>

        {/* Instagram Grid */}
        <Grid container spacing={{ xs: 1, sm: 2 }}>
          {instagramPosts.map((post, index) => (
            <Grid item xs={6} sm={4} md={2} key={post.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Box
                  component="a"
                  href="https://www.instagram.com/frost_and_crinkle?igsh=bzVoaGVlMm1uaG1q"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    position: 'relative',
                    display: 'block',
                    paddingTop: '100%',
                    overflow: 'hidden',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    '&:hover .overlay': {
                      opacity: 1,
                    },
                    '&:hover img': {
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={post.image}
                    alt={`Instagram post ${post.id}`}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                  <Box
                    className="overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(45deg, rgba(240,148,51,0.9) 0%, rgba(188,24,136,0.9) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 2,
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#fff' }}>
                      <FavoriteBorder sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                      <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                        {post.likes}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#fff' }}>
                      <ChatBubbleOutline sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                      <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                        {post.comments}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default InstagramFeed;
