import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const ProgressiveImage = ({ 
  src, 
  alt, 
  placeholder, 
  sx = {},
  aspectRatio = '1/1',
  objectFit = 'cover',
  ...props 
}) => {
  const [imgSrc, setImgSrc] = useState(placeholder || src);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImgSrc(src);
      setIsLoading(false);
    };

    return () => {
      img.onload = null;
    };
  }, [src]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        aspectRatio: aspectRatio,
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
        ...sx,
      }}
    >
      {/* Blur placeholder */}
      <motion.img
        src={imgSrc}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: objectFit,
          filter: isLoading ? 'blur(20px)' : 'blur(0px)',
          transform: isLoading ? 'scale(1.1)' : 'scale(1)',
          transition: 'filter 0.5s ease, transform 0.5s ease',
        }}
        {...props}
      />

      {/* Loading overlay */}
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: '3px solid #e91e63',
                borderTopColor: 'transparent',
                animation: 'spin 1s linear infinite',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            />
          </motion.div>
        </Box>
      )}

      {/* Fade-in animation when loaded */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
          }}
        />
      )}
    </Box>
  );
};

export default ProgressiveImage;
