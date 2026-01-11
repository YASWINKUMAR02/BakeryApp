// Professional page transition variants for framer-motion

// Smooth fade with scale - Modern and elegant
export const fadeScale = {
  initial: { 
    opacity: 0, 
    scale: 0.95,
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1], // Custom easing curve
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    }
  }
};

// Slide from bottom with fade - Professional
export const slideUp = {
  initial: { 
    opacity: 0, 
    y: 40,
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1], // Smooth deceleration
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    }
  }
};

// Slide with direction awareness - Dynamic
export const slideDirection = (direction = 'left') => ({
  initial: { 
    opacity: 0, 
    x: direction === 'left' ? -50 : 50,
  },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    }
  },
  exit: { 
    opacity: 0, 
    x: direction === 'left' ? 50 : -50,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    }
  }
});

// Blur fade - Premium feel
export const blurFade = {
  initial: { 
    opacity: 0, 
    filter: 'blur(10px)',
  },
  animate: { 
    opacity: 1, 
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    }
  },
  exit: { 
    opacity: 0, 
    filter: 'blur(10px)',
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    }
  }
};

// Zoom with fade - Dramatic
export const zoomFade = {
  initial: { 
    opacity: 0, 
    scale: 0.8,
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1], // Slight bounce
    }
  },
  exit: { 
    opacity: 0, 
    scale: 1.1,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    }
  }
};

// Stagger children animation - For lists and grids
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    }
  }
};

export const staggerItem = {
  hidden: { 
    opacity: 0, 
    y: 20,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    }
  }
};

// Default professional transition - Recommended for most pages
export const defaultTransition = fadeScale;

// Page-specific recommendations
export const pageTransitions = {
  home: fadeScale,
  shop: slideUp,
  gallery: blurFade,
  about: slideUp,
  contact: slideUp,
  faq: slideUp,
  terms: slideUp,
  privacy: slideUp,
  notFound: zoomFade,
};
