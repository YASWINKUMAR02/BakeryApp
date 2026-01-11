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
import { Star, ShoppingBag, Cake } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { optimizeImageUrl } from '../utils/imageOptimization';

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

    const getPriceText = () => {
        const catName = item.category?.name?.toLowerCase() || '';
        const isWeightBased = catName.includes('occasional') || catName.includes('premium') || catName.includes('party');
        if (isWeightBased && item.pricePerKg) {
            try {
                const prices = JSON.parse(item.pricePerKg);
                const priceValues = Object.values(prices).filter(p => p && parseFloat(p) > 0).map(p => parseFloat(p));
                const minPrice = Math.min(...priceValues);
                return `₹${minPrice.toFixed(0)}`;
            } catch (e) {
                return `₹${item.price?.toFixed(0)}`;
            }
        }
        return `₹${item.price?.toFixed(0)}`;
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
                            fontSize: '0.75rem', fontWeight: 600, backdropFilter: 'blur(4px)'
                        }}>
                            Out of Stock
                        </Box>
                    )}
                </Box>

                <CardContent sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="caption" sx={{ color: '#999', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {item.category?.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                            {getWeightText()}
                        </Typography>
                    </Box>

                    <Typography variant="h6" sx={{
                        fontWeight: 700, mb: 1, color: '#1a1a1a',
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        overflow: 'hidden', minHeight: '2.8rem'
                    }}>
                        {item.name}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                        {reviewCount > 0 ? (
                            <>
                                <Star sx={{ color: '#ffc107', fontSize: '1.1rem' }} />
                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a1a1a' }}>{averageRating}</Typography>
                                <Typography variant="body2" sx={{ color: '#999' }}>({reviewCount})</Typography>
                            </>
                        ) : (
                            <Typography variant="caption" sx={{ color: '#ccc' }}>New Arrival</Typography>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#e91e63' }}>
                            {getPriceText()}
                        </Typography>
                        <Button
                            className="buy-button"
                            variant="outlined"
                            size="small"
                            disabled={item.stock === 0}
                            startIcon={item.stock !== 0 && <ShoppingBag sx={{ fontSize: '1rem' }} />}
                            sx={{
                                borderRadius: '50px',
                                textTransform: 'none',
                                fontWeight: 700,
                                borderColor: 'rgba(233, 30, 99, 0.2)',
                                color: '#e91e63',
                                px: 2.5,
                                py: 0.8,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    borderColor: '#e91e63',
                                    background: '#e91e63',
                                    color: '#fff'
                                }
                            }}
                        >
                            {item.stock === 0 ? 'Restocking' : 'Order now'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default ProductCard;
