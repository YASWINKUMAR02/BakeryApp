import React, { useState, useEffect } from 'react';
import { Fab, Zoom } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Zoom in={isVisible}>
      <Fab
        onClick={scrollToTop}
        sx={{
          position: 'fixed',
          bottom: { xs: 80, sm: 24 },
          right: { xs: 16, sm: 24 },
          backgroundColor: '#e91e63',
          color: '#fff',
          zIndex: 9999,
          '&:hover': {
            backgroundColor: '#c2185b',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(233, 30, 99, 0.4)',
        }}
        size="medium"
        aria-label="scroll back to top"
      >
        <KeyboardArrowUp />
      </Fab>
    </Zoom>
  );
};

export default BackToTop;
