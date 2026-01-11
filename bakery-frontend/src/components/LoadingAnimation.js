import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const LoadingAnimation = ({ message = 'Loading delicious treats...' }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                gap: 3,
            }}
        >
            {/* Spinning Progress */}
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                    size={60}
                    thickness={4}
                    sx={{
                        color: '#e91e63',
                        '& .MuiCircularProgress-circle': {
                            strokeLinecap: 'round',
                        },
                    }}
                />
            </Box>

            {/* Loading Message */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        color: '#666',
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        fontWeight: 500,
                        textAlign: 'center',
                    }}
                >
                    {message}
                </Typography>
            </motion.div>

            {/* Animated Dots */}
            <Box sx={{ display: 'flex', gap: 1 }}>
                {[0, 1, 2].map((index) => (
                    <motion.div
                        key={index}
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: index * 0.2,
                        }}
                    >
                        <Box
                            sx={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                backgroundColor: '#e91e63',
                            }}
                        />
                    </motion.div>
                ))}
            </Box>
        </Box>
    );
};

export default LoadingAnimation;
