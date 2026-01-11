export const pageTransitions = {
    // Professional easing: Quintic Out - very smooth deceleration
    ease: [0.22, 1, 0.36, 1],

    default: {
        initial: { opacity: 0, y: 15, scale: 0.98 },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
            }
        },
        exit: {
            opacity: 0,
            y: -15,
            scale: 1.02,
            transition: {
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    },

    // Specific variant for the home page for a grander entrance
    home: {
        initial: { opacity: 0, scale: 1.05 },
        animate: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1]
            }
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    },

    // Shop page transition (slide from side)
    shop: {
        initial: { opacity: 0, x: 20 },
        animate: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
            }
        },
        exit: {
            opacity: 0,
            x: -20,
            transition: {
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    },

    // Detail page (slide from bottom/expand)
    detail: {
        initial: { opacity: 0, y: 30 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1]
            }
        },
        exit: {
            opacity: 0,
            y: 30,
            transition: {
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    },

    faq: {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.3, ease: 'easeOut' }
    },

    gallery: {
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.98 },
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
};
