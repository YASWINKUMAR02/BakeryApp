import React from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Button,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Star, ShoppingBag, Cake } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { optimizeImageUrl } from '../utils/imageOptimization';
import PriceDisplay from './PriceDisplay';
import designTokens from '../theme/designTokens';

const { colors, gradients, radii, shadows, spacing, transitions } = designTokens;

const ProductCard = ({ item, ratingData, index, compact = false }) => {
    const { averageRating, reviewCount } = ratingData;

    // Handle navigation for sample items
    const getItemLink = () => {
        if (item.isSample) {
            return `/item/${item.id}`; // Use sample ID for proper routing
        }
        return `/item/${item.id || item._id}`;
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                delay: index * 0.05,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    const getWeightText = () => {
        if (item.pricePerKg) {
            try {
                const prices = JSON.parse(item.pricePerKg);
                const weights = Object.keys(prices).map(parseFloat).sort((a, b) => a - b);
                const minWeight = weights[0];
                return minWeight < 1 ? `${minWeight * 1000} g` : `${minWeight} kg`;
            } catch (e) {
                return '1 kg';
            }
        }
        if (item.category?.name?.toLowerCase().includes('cake')) {
            return '1 kg';
        }
        return item.weight ? `${item.weight} g` : '1 pc';
    };

    const getPriceValue = () => {
        const catName = item.category?.name?.toLowerCase() || '';
        const isWeightBased = catName.includes('occasional') || catName.includes('premium') || catName.includes('party');
        if (isWeightBased && item.pricePerKg) {
            try {
                const prices = JSON.parse(item.pricePerKg);
                const priceValues = Object.values(prices).filter(p => p && parseFloat(p) > 0).map(p => parseFloat(p));
                const minPrice = Math.min(...priceValues);
                return minPrice;
            } catch (e) {
                return item.price;
            }
        }
        return item.price;
    };

    const getOfferDetails = () => {
        if (item.isBestSeller) {
            return {
                label: "Chef's Pick",
                description: 'Save 15% today',
                gradient: 'linear-gradient(135deg, rgba(255, 193, 7, 0.2) 0%, rgba(255, 160, 0, 0.25) 100%)',
                textColor: '#bf360c'
            };
        }
        if (item.isNew) {
            return {
                label: 'Intro Offer',
                description: 'Flat ₹50 off launch',
                gradient: 'linear-gradient(135deg, rgba(129, 199, 132, 0.18) 0%, rgba(56, 142, 60, 0.25) 100%)',
                textColor: '#1b5e20'
            };
        }
        return {
            label: 'Sweet Deal',
            description: 'Combo offer available',
            gradient: 'linear-gradient(135deg, rgba(233, 30, 99, 0.12) 0%, rgba(173, 20, 87, 0.18) 100%)',
            textColor: '#ad1457'
        };
    };

    const offerDetails = getOfferDetails();

    return (
        <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            viewport={{ once: true, amount: 0.1 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            whileTap={{ scale: 0.98 }}
            style={{ height: '100%' }}
        >
            <Card
                component={Link}
                to={getItemLink()}
                sx={{
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 0,
                    border: `1px solid ${alpha(colors.brandInk, 0.06)}`,
                    transition: transitions.standard,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: compact ? shadows.subtle : shadows.resting,
                    height: '100%',
                    background: colors.paper,
                    position: 'relative',
                    willChange: 'transform',
                    '&:hover, &:focus-within': {
                        boxShadow: shadows.hover,
                        '& .product-image': { transform: 'scale(1.08)' },
                        '& .buy-button': {
                            background: gradients.primary,
                            color: colors.paper,
                            boxShadow: shadows.hover,
                        }
                    },
                    '&:focus-visible': {
                        outline: `2px solid ${alpha(colors.brandPink, 0.5)}`,
                        outlineOffset: '4px',
                    }
                }}
            >
                <Box sx={{
                    height: compact ? { xs: '130px', sm: '160px' } : { xs: '180px', sm: '220px' },
                    position: 'relative',
                    overflow: 'hidden',
                    background: gradients.softRose,
                }}>
                    {item.imageUrl ? (
                        <img
                            src={optimizeImageUrl(item.imageUrl, { width: 400, quality: 85 })}
                            alt={item.name}
                            className="product-image"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'center center',
                                transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                            }}
                        />
                    ) : (
                        <Box sx={{
                            height: '100%',
                            background: gradients.subtleCard,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Cake sx={{ fontSize: 60, color: '#e91e63', opacity: 0.5 }} />
                        </Box>
                    )}

                    {item.stock === 0 && (
                        <Box sx={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            background: 'rgba(0,0,0,0.55)',
                            backdropFilter: 'blur(3px)',
                            color: '#fff',
                            padding: '4px 10px',
                            fontSize: '0.72rem', fontWeight: 700,
                            textAlign: 'center',
                            letterSpacing: '0.05em',
                            zIndex: 2
                        }}>
                            OUT OF STOCK
                        </Box>
                    )}

                    {item.isBestSeller && (
                        <Box sx={{
                            position: 'absolute', top: 8, left: 8,
                            background: 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)',
                            color: '#000',
                            padding: '2px 8px',
                            borderRadius: 0,
                            fontSize: '0.6rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            boxShadow: '0 2px 8px rgba(255, 160, 0, 0.4)',
                            zIndex: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                        }}>
                            <Box component="span" sx={{ fontSize: '0.8rem' }}>🔥</Box>
                            Best
                        </Box>
                    )}

                    {item.isNew && !item.isBestSeller && (
                        <Box sx={{
                            position: 'absolute', top: 8, left: 8,
                            background: 'linear-gradient(135deg, #00c853 0%, #64dd17 100%)',
                            color: '#fff',
                            padding: '2px 8px',
                            borderRadius: 0,
                            fontSize: '0.6rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            boxShadow: '0 2px 8px rgba(100, 221, 23, 0.4)',
                            zIndex: 2,
                        }}>
                            New
                        </Box>
                    )}
                </Box>

                <CardContent sx={{
                    p: compact ? { xs: spacing(1.5), sm: spacing(3) } : { xs: spacing(2), sm: spacing(3.5) },
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="caption" sx={{ color: colors.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.65rem' }}>
                            {item.category?.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.stone, fontWeight: 500, fontStyle: 'italic' }}>
                            {getWeightText()}
                        </Typography>
                    </Box>

                    <Typography variant="h3" sx={{
                        fontWeight: 700, mb: 0.5, color: '#1a1a1a',
                        fontSize: compact ? { xs: '0.8rem', sm: '1.1rem' } : { xs: '0.9rem', sm: '1.25rem' },
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        overflow: 'hidden', minHeight: compact ? '2rem' : '2.4rem',
                        lineHeight: 1.2
                    }}>
                        {item.name}
                    </Typography>

                    <Box sx={{
                        mb: compact ? 1.5 : 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}>
                        <Chip
                            label={
                                <Typography variant="caption" sx={{ fontWeight: 700, color: offerDetails.textColor }}>
                                    {offerDetails.label}
                                </Typography>
                            }
                            size="small"
                            sx={{
                                background: offerDetails.gradient,
                                borderRadius: 0,
                                height: 24,
                                px: 1.2,
                                '& .MuiChip-label': {
                                    px: 0.4,
                                    fontSize: '0.65rem'
                                }
                            }}
                        />
                        <Typography variant="caption" sx={{ color: offerDetails.textColor, fontWeight: 600 }}>
                            {offerDetails.description}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: compact ? 1.5 : 2 }}>
                        {reviewCount > 0 ? (
                            <>
                                <Star sx={{ color: '#FFB300', fontSize: '1rem' }} />
                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a1a1a', ml: 0.5 }}>{averageRating}</Typography>
                                <Typography variant="body2" sx={{ color: '#999', fontSize: '0.8rem' }}>({reviewCount})</Typography>
                            </>
                        ) : (
                            <Typography variant="caption" sx={{ color: '#999', fontWeight: 500 }}>Newly Added ✨</Typography>
                        )}
                    </Box>

                    <Box sx={{ mb: compact ? 2 : 2.5 }}>
                        {item.stock === 0 ? (
                            <Typography variant="caption" sx={{
                                color: '#d32f2f',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                            }}>
                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#d32f2f' }} />
                                Out of Stock
                            </Typography>
                        ) : item.stock < 10 ? (
                            <Typography variant="caption" sx={{
                                color: '#ed6c02',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.7,
                                background: alpha('#ed6c02', 0.08),
                                px: 1.2,
                                py: 0.4,
                                borderRadius: 0,
                                width: 'fit-content'
                            }}>
                                <motion.span
                                    animate={{ opacity: [1, 0.4, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    style={{ width: 6, height: 6, borderRadius: 0, background: '#ed6c02', display: 'inline-block' }}
                                />
                                Limited: {item.stock} left
                            </Typography>
                        ) : (
                            <Typography variant="caption" sx={{
                                color: '#2e7d32',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                            }}>
                                <Box sx={{ width: 6, height: 6, borderRadius: 0, bgcolor: '#2e7d32' }} />
                                In Stock
                            </Typography>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto', pt: 1 }}>
                        <PriceDisplay
                            amount={getPriceValue()}
                            fontSize={compact ? '1.2rem' : '1.4rem'}
                            color="primary.main"
                        />
                        <Button
                            className="buy-button"
                            variant="contained"
                            size="small"
                            disabled={item.stock === 0}
                            sx={{
                                borderRadius: 0,
                                textTransform: 'none',
                                fontWeight: 700,
                                px: compact ? 1.5 : 2,
                                py: compact ? 0.6 : 0.8,
                                fontSize: compact ? '0.75rem' : '0.8rem',
                                boxShadow: '0 4px 12px rgba(233, 30, 99, 0.2)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.75,
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 6px 16px rgba(233, 30, 99, 0.3)',
                                }
                            }}
                        >
                            {item.stock === 0 ? 'Waitlist' : (
                                <>
                                    <ShoppingBag sx={{ fontSize: compact ? 16 : 18, mb: '-2px' }} />
                                    Buy Now
                                </>
                            )}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default ProductCard;
