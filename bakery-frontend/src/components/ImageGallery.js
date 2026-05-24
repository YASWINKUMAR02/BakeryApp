import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Dialog,
    DialogContent,
    IconButton,
    Typography,
} from '@mui/material';
import {
    Close,
    ArrowBackIos,
    ArrowForwardIos,
    ZoomIn,
    FavoriteBorder,
    Share,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Curated fallback images by category keyword
const CATEGORY_IMAGES = {
    cake: [
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
        'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80',
        'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800&q=80',
        'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800&q=80',
    ],
    pastry: [
        'https://images.unsplash.com/photo-1559707953-8b1cba1b6b71?w=800&q=80',
        'https://images.unsplash.com/photo-1612203985729-70726954388c?w=800&q=80',
        'https://images.unsplash.com/photo-1609803384069-19f3bc5f16cc?w=800&q=80',
        'https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?w=800&q=80',
    ],
    dessert: [
        'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80',
        'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80',
        'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80',
        'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80',
    ],
    bread: [
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
        'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800&q=80',
        'https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=800&q=80',
        'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=800&q=80',
    ],
    cookie: [
        'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80',
        'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80',
        'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=800&q=80',
        'https://images.unsplash.com/photo-1611293388250-580b08c4a145?w=800&q=80',
    ],
    default: [
        'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800&q=80',
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
        'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80',
        'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80',
    ],
};

const getGalleryImages = (item) => {
    const primary = item?.imageUrl;
    const categoryName = (item?.category?.name || item?.category || '').toLowerCase();

    // Pick a category bucket
    let fallbacks = CATEGORY_IMAGES.default;
    for (const key of Object.keys(CATEGORY_IMAGES)) {
        if (key !== 'default' && categoryName.includes(key)) {
            fallbacks = CATEGORY_IMAGES[key];
            break;
        }
    }

    // Build gallery: primary first, then up to 3 unique fallbacks
    const images = [];
    if (primary) images.push(primary);
    for (const url of fallbacks) {
        if (url !== primary && images.length < 4) images.push(url);
    }
    return images;
};

const ImageGallery = ({ item }) => {
    const images = getGalleryImages(item);
    const [activeIndex, setActiveIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

    const goTo = useCallback((newIndex, dir = 1) => {
        setDirection(dir);
        setActiveIndex(newIndex);
    }, []);

    const openLightbox = (index) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    const lightboxNext = useCallback(() => {
        setDirection(1);
        setLightboxIndex((i) => (i + 1) % images.length);
    }, [images.length]);

    const lightboxPrev = useCallback(() => {
        setDirection(-1);
        setLightboxIndex((i) => (i - 1 + images.length) % images.length);
    }, [images.length]);

    // Keyboard navigation in lightbox
    useEffect(() => {
        if (!lightboxOpen) return;
        const handler = (e) => {
            if (e.key === 'ArrowRight') lightboxNext();
            if (e.key === 'ArrowLeft') lightboxPrev();
            if (e.key === 'Escape') setLightboxOpen(false);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [lightboxOpen, lightboxNext, lightboxPrev]);

    const variants = {
        enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
        center: { x: 0, opacity: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
        exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.3 } }),
    };

    return (
        <>
            {/* Main Image Container */}
            <Box sx={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.08)', cursor: 'zoom-in' }}>
                {/* Overlay Action Buttons */}
                <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <IconButton
                        size="small"
                        sx={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', '&:hover': { background: '#f5f5f5' } }}
                    >
                        <FavoriteBorder fontSize="small" />
                    </IconButton>
                </Box>
                <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <IconButton
                        size="small"
                        sx={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', '&:hover': { background: '#f5f5f5' } }}
                    >
                        <Share fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => openLightbox(activeIndex)}
                        sx={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', '&:hover': { background: '#f5f5f5' } }}
                    >
                        <ZoomIn fontSize="small" />
                    </IconButton>
                </Box>

                {/* Animated Main Image */}
                <Box
                    onClick={() => openLightbox(activeIndex)}
                    sx={{ position: 'relative', height: { xs: '250px', md: '380px' }, overflow: 'hidden', background: '#f8f8f8' }}
                >
                    <AnimatePresence custom={direction} mode="wait">
                        <motion.img
                            key={activeIndex}
                            src={images[activeIndex]}
                            alt={`${item?.name} — view ${activeIndex + 1}`}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block',
                                top: 0,
                                left: 0,
                            }}
                        />
                    </AnimatePresence>
                </Box>

                {/* Image Counter Badge */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 10,
                        right: 12,
                        background: 'rgba(0,0,0,0.55)',
                        color: '#fff',
                        borderRadius: '20px',
                        px: 1.2,
                        py: 0.2,
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                        zIndex: 5,
                    }}
                >
                    {activeIndex + 1} / {images.length}
                </Box>
            </Box>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
                <Box sx={{ display: 'flex', gap: 1.5, mt: 1.5, overflowX: 'auto', pb: 0.5, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
                    {images.map((src, i) => (
                        <Box
                            key={i}
                            onClick={() => goTo(i, i > activeIndex ? 1 : -1)}
                            component={motion.div}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            sx={{
                                width: { xs: 58, md: 68 },
                                height: { xs: 58, md: 68 },
                                flexShrink: 0,
                                borderRadius: '8px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                border: activeIndex === i ? '2px solid #e91e63' : '2px solid transparent',
                                boxShadow: activeIndex === i ? '0 0 0 1px #e91e63' : '0 2px 8px rgba(0,0,0,0.08)',
                                transition: 'border 0.2s, box-shadow 0.2s',
                                opacity: activeIndex === i ? 1 : 0.65,
                            }}
                        >
                            <Box
                                component="img"
                                src={src}
                                alt={`Thumbnail ${i + 1}`}
                                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                        </Box>
                    ))}
                </Box>
            )}

            {/* Lightbox Dialog */}
            <Dialog
                open={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                maxWidth={false}
                PaperProps={{
                    sx: {
                        background: 'rgba(10,10,10,0.97)',
                        boxShadow: 'none',
                        borderRadius: '12px',
                        m: 2,
                        overflow: 'hidden',
                    },
                }}
            >
                <DialogContent sx={{ p: 0, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: { xs: '90vw', md: '70vw' }, minHeight: { xs: '50vw', md: '75vh' } }}>
                    {/* Close */}
                    <IconButton
                        onClick={() => setLightboxOpen(false)}
                        sx={{ position: 'absolute', top: 10, right: 10, zIndex: 10, color: '#fff', background: 'rgba(255,255,255,0.1)', '&:hover': { background: 'rgba(255,255,255,0.2)' } }}
                    >
                        <Close />
                    </IconButton>

                    {/* Prev */}
                    {images.length > 1 && (
                        <IconButton
                            onClick={lightboxPrev}
                            sx={{ position: 'absolute', left: 10, zIndex: 10, color: '#fff', background: 'rgba(255,255,255,0.1)', '&:hover': { background: 'rgba(255,255,255,0.2)' } }}
                        >
                            <ArrowBackIos fontSize="small" />
                        </IconButton>
                    )}

                    {/* Main Lightbox Image */}
                    <AnimatePresence custom={direction} mode="wait">
                        <motion.img
                            key={lightboxIndex}
                            src={images[lightboxIndex]}
                            alt={`${item?.name} — fullscreen ${lightboxIndex + 1}`}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '80vh',
                                objectFit: 'contain',
                                display: 'block',
                                margin: '0 auto',
                                padding: '16px 56px',
                            }}
                        />
                    </AnimatePresence>

                    {/* Next */}
                    {images.length > 1 && (
                        <IconButton
                            onClick={lightboxNext}
                            sx={{ position: 'absolute', right: 10, zIndex: 10, color: '#fff', background: 'rgba(255,255,255,0.1)', '&:hover': { background: 'rgba(255,255,255,0.2)' } }}
                        >
                            <ArrowForwardIos fontSize="small" />
                        </IconButton>
                    )}

                    {/* Caption */}
                    <Box sx={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em' }}>
                            {lightboxIndex + 1} / {images.length}
                        </Typography>
                    </Box>
                </DialogContent>

                {/* Lightbox Thumbnail Strip */}
                {images.length > 1 && (
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', p: 1.5, background: 'rgba(0,0,0,0.6)' }}>
                        {images.map((src, i) => (
                            <Box
                                key={i}
                                onClick={() => { setDirection(i > lightboxIndex ? 1 : -1); setLightboxIndex(i); }}
                                sx={{
                                    width: 48, height: 48,
                                    borderRadius: '6px',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    border: lightboxIndex === i ? '2px solid #e91e63' : '2px solid rgba(255,255,255,0.15)',
                                    opacity: lightboxIndex === i ? 1 : 0.55,
                                    transition: 'all 0.2s',
                                    '&:hover': { opacity: 1 },
                                }}
                            >
                                <Box component="img" src={src} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </Box>
                        ))}
                    </Box>
                )}
            </Dialog>
        </>
    );
};

export default ImageGallery;
