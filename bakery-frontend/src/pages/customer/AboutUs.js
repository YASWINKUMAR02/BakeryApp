import React from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Stack,
  Button,
  Divider,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Cake,
  LocalShipping,
  EmojiEvents,
  Favorite,
  Schedule,
  VerifiedUser,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import designTokens from '../../theme/designTokens';
import SectionHeader from '../../components/SectionHeader';

const { colors, gradients, shadows, transitions } = designTokens;

const featureIcons = {
  fresh: <Cake sx={{ fontSize: 40, color: colors.brandPink }} />,
  delivery: <LocalShipping sx={{ fontSize: 40, color: colors.success }} />,
  awards: <EmojiEvents sx={{ fontSize: 40, color: colors.warning }} />,
  love: <Favorite sx={{ fontSize: 40, color: colors.brandBurgundy }} />,
  schedule: <Schedule sx={{ fontSize: 40, color: colors.brandInk }} />,
  quality: <VerifiedUser sx={{ fontSize: 40, color: colors.brandPink }} />,
};

const team = [
  { name: 'Akira Dsouza', role: 'Executive Pastry Chef', specialty: 'Seasonal tasting menus', avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=280&h=280&fit=facearea&facepad=3' },
  { name: 'Mira Kapur', role: 'Head Chocolatier', specialty: 'Bean-to-bar couverture', avatar: 'https://images.unsplash.com/photo-1544723795-432537ff3e6b?w=280&h=280&fit=facearea&facepad=3' },
  { name: 'Daniel Fernandes', role: 'Production Lead', specialty: 'Sourdough & viennoiserie', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=280&h=280&fit=facearea&facepad=3' },
];

const testimonials = [
  {
    quote: '“Their Black Forest Gateau was the showstopper at our wedding—layers of nostalgia and perfection.”',
    name: 'Tanvi & Rahul',
    role: 'Couple, bespoke celebration',
  },
  {
    quote: '“Midnight drops for our product launches always arrive pristine. They’re our go-to for corporate gifting.”',
    name: 'Leena Sharma',
    role: 'Head of Events, Lumos Tech',
  },
  {
    quote: '“I’ve been celiac for 12 years: their seasonal gluten-free box is the highlight of every festival.”',
    name: 'Prateek Jain',
    role: 'Community Member',
  },
];

const featureList = [
  {
    key: 'fresh',
    title: 'Baked at dawn',
    description: 'Zero preservatives. Every batch baked between 3–6 am, plated by 7 am.',
  },
  {
    key: 'delivery',
    title: 'Citywide temperature control',
    description: 'Insulated logistics keep entremets pristine within 60 minutes door-to-door.',
  },
  {
    key: 'awards',
    title: 'SCA & ICA laurels',
    description: 'Recognised for best boutique bakery three years running with 4.9★ community rating.',
  },
  {
    key: 'love',
    title: 'Zero waste kitchens',
    description: 'Surplus pastries go to neighbourhood shelters daily via our Sweet Circles initiative.',
  },
  {
    key: 'schedule',
    title: 'Weeklong service',
    description: 'Walk-ins, catering, custom tastings—seven days a week, from breakfast to late nights.',
  },
  {
    key: 'quality',
    title: 'Traceable ingredients',
    description: 'Single-origin cacao, grass-fed dairy, native grains—fully traceable supply chains.',
  },
];

const timeline = [
  {
    year: '2010',
    title: 'Founding',
    description: 'Frost & Crinkle was founded by two passionate bakers who wanted to bring people together through the joy of handcrafted pastries.',
  },
  {
    year: '2012',
    title: 'First Bakery',
    description: 'We opened our first bakery in the heart of the city, offering a wide range of artisanal breads and pastries.',
  },
  {
    year: '2015',
    title: 'Expansion',
    description: 'We expanded our operations to include a second bakery and a team of skilled bakers.',
  },
  {
    year: '2018',
    title: 'Awards and Recognition',
    description: 'We were recognized as one of the best boutique bakeries in the city, with a 4.9★ community rating.',
  },
];

const AboutUs = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  return (
    <motion.div initial="hidden" animate="visible" style={{ background: colors.cloud, minHeight: '100vh', paddingTop: '100px' }}>
      <Box
        component={motion.section}
        variants={{ hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
        sx={{
          backgroundImage: `linear-gradient(110deg, ${gradients.primary}), url(https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=1600&h=600&fit=crop)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply',
          color: colors.paper,
          py: { xs: 8, md: 10 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={2} alignItems="center">
            <Chip label="Crafting Since 2010" sx={{ backgroundColor: alpha(colors.paper, 0.15), color: colors.paper, borderRadius: 0, letterSpacing: '0.12em', fontWeight: 700 }} />
            <Typography variant="h2" sx={{ fontWeight: 800, maxWidth: 680, lineHeight: 1.1 }}>
              Frost &amp; Crinkle • Bakers of Shared Memories
            </Typography>
            <Typography variant="h5" sx={{ maxWidth: 780, opacity: 0.92, lineHeight: 1.5 }}>
              From dawn bakes to midnight drops, we elevate every celebration with handcrafted layers 
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* Story Section */}
      <Box component={motion.section} variants={cardVariants} sx={{ py: 8, backgroundColor: colors.cloud }}>
        <Container maxWidth="lg">
          <SectionHeader title="Our Story" subtitle="From humble beginnings to a beloved bakery" />
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ opacity: 0.8, lineHeight: 1.7 }}>
                Frost & Crinkle was founded in 2010 by two passionate bakers who wanted to bring people together through the joy of handcrafted pastries. Today, we're proud to be a part of countless celebrations and everyday moments.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ opacity: 0.8, lineHeight: 1.7 }}>
                Our commitment to quality, community, and sustainability has earned us recognition as one of the best boutique bakeries in the city. We're grateful for the trust our customers have placed in us and look forward to many more years of baking memories together.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box component={motion.section} variants={cardVariants} sx={{ py: 8, backgroundColor: colors.cloud }}>
        <Container maxWidth="lg">
          <SectionHeader title="What Sets Us Apart" subtitle="Our features" />
          <Grid container spacing={4}>
            {featureList.map((feature, index) => (
              <Grid item key={feature.key} xs={12} md={4}>
                <Paper elevation={2} sx={{ p: 4, backgroundColor: colors.paper, borderRadius: 2 }}>
                  {featureIcons[feature.key]}
                  <Typography variant="h6" sx={{ fontWeight: 700, mt: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.8, lineHeight: 1.7 }}>
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Timeline Section */}
      <Box component={motion.section} variants={cardVariants} sx={{ py: 8, backgroundColor: colors.cloud }}>
        <Container maxWidth="lg">
          <SectionHeader title="Our Journey" subtitle="Milestones and achievements" />
          <Grid container spacing={4}>
            {timeline.map((event, index) => (
              <Grid item key={event.year} xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 4, backgroundColor: colors.paper, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {event.year}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, mt: 1 }}>
                    {event.title}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.8, lineHeight: 1.7, mt: 2 }}>
                    {event.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
      <Box component={motion.section} variants={cardVariants} sx={{ py: 8, backgroundColor: colors.cloud }}>
        <Container maxWidth="lg">
          <SectionHeader title="Meet Our Team" subtitle="The people behind the pastries" />
          <Grid container spacing={4}>
            {team.map((member, index) => (
              <Grid item key={member.name} xs={12} md={4}>
                <Paper elevation={2} sx={{ p: 4, backgroundColor: colors.paper, borderRadius: 2 }}>
                  <img src={member.avatar} alt={member.name} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, mt: 2 }}>
                    {member.name}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.8, lineHeight: 1.7 }}>
                    {member.role}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.8, lineHeight: 1.7, mt: 1 }}>
                    {member.specialty}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box component={motion.section} variants={cardVariants} sx={{ py: 8, backgroundColor: colors.cloud }}>
        <Container maxWidth="lg">
          <SectionHeader title="What Our Customers Say" subtitle="Testimonials" />
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item key={testimonial.quote} xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 4, backgroundColor: colors.paper, borderRadius: 2 }}>
                  <Typography variant="body1" sx={{ opacity: 0.8, lineHeight: 1.7, fontStyle: 'italic' }}>
                    {testimonial.quote}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.8, lineHeight: 1.7, mt: 2 }}>
                    {testimonial.name}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.8, lineHeight: 1.7 }}>
                    {testimonial.role}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </motion.div>
  );
};

export default AboutUs;
