import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

const PageLoader = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        zIndex: 9999,
      }}
    >
      {/* Animated Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: { xs: '120px', sm: '150px' },
            height: { xs: '120px', sm: '150px' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Logo Image */}
          <motion.img
            src={`${process.env.PUBLIC_URL}/LOGOO.png`}
            alt="Frost and Crinkle"
            style={{
              width: '100%',
              height: 'auto',
              maxWidth: '140px',
              objectFit: 'contain',
              zIndex: 2,
            }}
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Rotating Circle */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1,
            }}
          >
            <CircularProgress
              size={180}
              thickness={2}
              sx={{
                color: '#e91e63',
                opacity: 0.3,
              }}
            />
          </Box>
        </Box>
      </motion.div>

      {/* Loading Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.5,
        }}
      >
        <Box
          sx={{
            marginTop: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: index * 0.15,
                ease: 'easeInOut',
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#e91e63',
                }}
              />
            </motion.div>
          ))}
        </Box>
      </motion.div>
    </Box>
  );
};

export default PageLoader;
