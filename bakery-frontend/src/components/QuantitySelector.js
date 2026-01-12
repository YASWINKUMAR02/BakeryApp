import React from 'react';
import { Box, IconButton, Typography, CircularProgress } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Add, Remove } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * A High-End, Professional Quantity Selector.
 * Design Philosophy: Modern Minimalism, Glassmorphism, and Fluid Motion.
 */
const QuantitySelector = ({
    value,
    onIncrement,
    onDecrement,
    loading = false,
    min = 1,
    max = 100,
    size = 'medium'
}) => {
    const isSmall = size === 'small';
    const brandColor = '#e91e63';

    return (
        <Box
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
                padding: '3px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)',
                minWidth: isSmall ? '105px' : '135px',
                height: isSmall ? '38px' : '46px',
                justifyContent: 'space-between',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                '&:hover': {
                    border: `1px solid ${alpha(brandColor, 0.3)}`,
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
                    transform: 'translateY(-2px)',
                }
            }}
        >
            {/* Decrement Area */}
            <IconButton
                onClick={(e) => {
                    e.stopPropagation();
                    onDecrement();
                }}
                disabled={loading || value <= min}
                sx={{
                    borderRadius: '8px',
                    width: isSmall ? '32px' : '38px',
                    height: isSmall ? '32px' : '38px',
                    color: value <= min ? alpha('#000', 0.2) : '#1a1a1a',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        background: alpha(brandColor, 0.05),
                        color: brandColor,
                    },
                    '&.Mui-disabled': {
                        background: 'transparent',
                        color: alpha('#000', 0.1),
                    }
                }}
            >
                <Remove sx={{ fontSize: isSmall ? '1.1rem' : '1.3rem' }} />
            </IconButton>

            {/* Value Display */}
            <Box sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                height: '100%',
                px: 1,
                borderLeft: '1px solid rgba(0, 0, 0, 0.03)',
                borderRight: '1px solid rgba(0, 0, 0, 0.03)'
            }}>
                <AnimatePresence mode="popLayout" initial={false}>
                    {loading ? (
                        <motion.div
                            key="loader"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                        >
                            <CircularProgress size={18} thickness={6} sx={{ color: brandColor }} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key={value}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 30,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 600, // Refined weight
                                    fontSize: isSmall ? '1rem' : '1.15rem',
                                    color: '#121212',
                                    letterSpacing: '-0.01em'
                                }}
                            >
                                {value}
                            </Typography>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Box>

            {/* Increment Area */}
            <IconButton
                onClick={(e) => {
                    e.stopPropagation();
                    onIncrement();
                }}
                disabled={loading || (max && value >= max)}
                sx={{
                    borderRadius: '8px',
                    width: isSmall ? '32px' : '38px',
                    height: isSmall ? '32px' : '38px',
                    color: (max && value >= max) ? alpha('#000', 0.2) : '#1a1a1a',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        background: alpha(brandColor, 0.05),
                        color: brandColor,
                    },
                    '&.Mui-disabled': {
                        background: 'transparent',
                        color: alpha('#000', 0.1),
                    }
                }}
            >
                <Add sx={{ fontSize: isSmall ? '1.1rem' : '1.3rem' }} />
            </IconButton>

            {/* Background Micro-Glow Effect */}
            {loading && (
                <Box
                    component={motion.div}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        background: `linear-gradient(90deg, transparent, ${alpha(brandColor, 0.03)}, transparent)`,
                        zIndex: 0,
                        pointerEvents: 'none'
                    }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                />
            )}
        </Box>
    );
};

export default QuantitySelector;
