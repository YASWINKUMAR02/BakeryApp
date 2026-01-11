import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import usePullToRefresh from '../hooks/usePullToRefresh';

const PullToRefresh = ({ onRefresh, children, threshold = 80 }) => {
    const { isPulling, pullDistance, isRefreshing } = usePullToRefresh(onRefresh, threshold);

    return (
        <Box sx={{ position: 'relative' }}>
            {/* Pull to Refresh Indicator */}
            <AnimatePresence>
                {isPulling && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                            height: pullDistance,
                            opacity: Math.min(pullDistance / threshold, 1)
                        }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'white',
                            zIndex: 1100,
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            {isRefreshing ? (
                                <CircularProgress size={28} thickness={5} sx={{ color: '#e91e63' }} />
                            ) : (
                                <motion.div
                                    animate={{
                                        rotate: pullDistance * 2,
                                        scale: Math.min(0.5 + pullDistance / threshold, 1.2)
                                    }}
                                >
                                    <Refresh sx={{ color: '#e91e63', fontSize: '2.5rem' }} />
                                </motion.div>
                            )}
                            <Typography
                                variant="caption"
                                sx={{
                                    color: '#e91e63',
                                    fontWeight: 700,
                                    fontSize: '0.75rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}
                            >
                                {isRefreshing ? 'Releasing...' : 'Pull to Bake Fresh'}
                            </Typography>
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content */}
            {children}
        </Box>
    );
};

export default PullToRefresh;
