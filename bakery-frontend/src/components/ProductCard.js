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
import { formatCurrency } from '../utils/currencyUtils';
import PriceDisplay from './PriceDisplay';

const ProductCard = ({ item, ratingData, index }) => {
    const { averageRating, reviewCount } = ratingData;

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

    return (
        <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            whileTap={{ scale: 0.98 }}
            style={{ height: '100%' }}
        >
            <Card
                component={Link}
                to={`/item/${item.id || item._id}`}
                sx={{
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '16px',
                    border: '1px solid rgba(0,0,0,0.06)',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                    height: '100%',
                    background: '#fff',
                    position: 'relative',
                    '&:hover': {
                        boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                        '& .product-image': { transform: 'scale(1.08)' },
                        '& .buy-button': { background: '#e91e63', color: '#fff' }
                    }
                }}
            >
                <Box sx={{
                    height: { xs: '140px', sm: '200px' },
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: '#f8f8f8',
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
                                transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                            }}
                        />
                    ) : (
                        <Box sx={{
                            height: '100%',
                            background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Cake sx={{ fontSize: 60, color: '#e91e63', opacity: 0.5 }} />
                        </Box>
                    )}

                    {item.stock === 0 && (
                        <Box sx={{
                            position: 'absolute', top: 12, right: 12,
                            background: 'rgba(0,0,0,0.7)', color: '#fff',
                            padding: '4px 12px', borderRadius: '20px',
                            fontSize: '0.75rem', fontWeight: 600, backdropFilter: 'blur(4px)',
                            zIndex: 2
                        }}>
                            Out of Stock
                        </Box>
                    )}

                    {item.isBestSeller && (
                        <Box sx={{
                            position: 'absolute', top: 12, left: 12,
                            background: 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)',
                            color: '#000',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            boxShadow: '0 4px 12px rgba(255, 160, 0, 0.4)',
                            zIndex: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                        }}>
                            <Box component="span" sx={{ fontSize: '1rem' }}>🔥</Box>
                            Best Seller
                        </Box>
                    )}

                    {item.isNew && !item.isBestSeller && (
                        <Box sx={{
                            position: 'absolute', top: 12, left: 12,
                            background: 'linear-gradient(135deg, #00c853 0%, #64dd17 100%)',
                            color: '#fff',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            boxShadow: '0 4px 12px rgba(100, 221, 23, 0.4)',
                            zIndex: 2,
                        }}>
                            New
                        </Box>
                    )}
                </Box>

                <CardContent sx={{ p: { xs: 2, sm: 2.5 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="caption" sx={{ color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.65rem' }}>
                            {item.category?.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666', fontWeight: 500, fontStyle: 'italic' }}>
                            {getWeightText()}
                        </Typography>
                    </Box>

                    <Typography variant="h3" sx={{
                        fontWeight: 700, mb: 1, color: '#1a1a1a',
                        fontSize: { xs: '1rem', sm: '1.25rem' },
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        overflow: 'hidden', minHeight: '3rem',
                        lineHeight: 1.3
                    }}>
                        {item.name}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
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

                    {/* Professional Stock Indicator */}
                    <Box sx={{ mb: 2.5 }}>
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
                                borderRadius: '6px',
                                width: 'fit-content'
                            }}>
                                <motion.span
                                    animate={{ opacity: [1, 0.4, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    style={{ width: 6, height: 6, borderRadius: '50%', background: '#ed6c02', display: 'inline-block' }}
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
                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#2e7d32' }} />
                                In Stock
                            </Typography>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto', pt: 1 }}>
                        <PriceDisplay
                            amount={getPriceValue()}
                            fontSize="1.4rem"
                            color="primary.main"
                        />
                        <Button
                            className="buy-button"
                            variant="contained"
                            size="small"
                            disabled={item.stock === 0}
                            sx={{
                                borderRadius: '50px',
                                textTransform: 'none',
                                fontWeight: 700,
                                px: 2,
                                py: 0.8,
                                fontSize: '0.8rem',
                                boxShadow: '0 4px 12px rgba(233, 30, 99, 0.2)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 6px 16px rgba(233, 30, 99, 0.3)',
                                }
                            }}
                        >
                            {item.stock === 0 ? 'Waitlist' : 'Add'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default ProductCard;
