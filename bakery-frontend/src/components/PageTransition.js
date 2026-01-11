import React from 'react';
import { motion } from 'framer-motion';
import { pageTransitions } from '../utils/pageTransitions';

const PageTransition = ({ children, variant = 'default' }) => {
  const selectedVariant = pageTransitions[variant] || pageTransitions.default;

  return (
    <motion.div
      initial={selectedVariant.initial}
      animate={selectedVariant.animate}
      exit={selectedVariant.exit}
      transition={selectedVariant.transition}
      style={{
        width: '100%',
        minHeight: '100vh',
        position: 'relative',
        overflowX: 'hidden'
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
