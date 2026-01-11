import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { Close, Favorite, FavoriteBorder, Star, Share } from '@mui/icons-material';

const ProductModal = ({ open, onClose, product }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState('250g');

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} - ₹${getCurrentPrice()}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };
  
  // Set default weight when product changes
  useEffect(() => {
    if (product) {
      const isBirthdayCake = product.name.toLowerCase().includes('birthday cake') || product.name.toLowerCase().includes('customized');
      const isBrownie = product.category === 'Brownies';
      const isKunafa = product.name.toLowerCase().includes('kunafa');
      const isChocolateDreamCake = product.name.toLowerCase().includes('chocolate dream cake');
      
      if (isKunafa) {
        setSelectedWeight('100g'); // Minimum weight for Kunafa
      } else if (isBrownie) {
        setSelectedWeight('250g'); // Minimum weight for Brownies
      } else if (isBirthdayCake) {
        setSelectedWeight('500g'); // Minimum weight for Birthday Cakes (₹400)
      } else if (isChocolateDreamCake) {
        setSelectedWeight('250g'); // Minimum weight for Chocolate Dream Cake
      }
    }
  }, [product]);
  
  if (!product) return null;

  // Check if product is a birthday cake, brownie, kunafa, or chocolate dream cake
  const isBirthdayCake = product.name.toLowerCase().includes('birthday cake') || product.name.toLowerCase().includes('customized');
  const isBrownie = product.category === 'Brownies';
  const isKunafa = product.name.toLowerCase().includes('kunafa');
  const isChocolateDreamCake = product.name.toLowerCase().includes('chocolate dream cake');
  
  // Weight options for birthday cakes
  const cakeWeightOptions = [
    { value: '500g', label: '500g', price: 400 },
    { value: '1kg', label: '1 kg', price: 800 },
    { value: '1.5kg', label: '1.5 kg', price: 1200 },
    { value: '2kg', label: '2 kg', price: 1600 },
  ];

  // Weight options for brownies
  const brownieWeightOptions = [
    { value: '250g', label: '250g', price: product.price },
    { value: '500g', label: '500g', price: product.price * 2 },
    { value: '1kg', label: '1 kg', price: product.price * 4 },
    { value: '1.5kg', label: '1.5 kg', price: product.price * 6 },
    { value: '2kg', label: '2 kg', price: product.price * 8 },
  ];

  // Weight options for kunafa (base price for 200g)
  const kunafaWeightOptions = [
    { value: '100g', label: '100g', price: Math.round(product.price * 0.5) },
    { value: '200g', label: '200g', price: product.price },
    { value: '250g', label: '250g', price: Math.round(product.price * 1.25) },
    { value: '500g', label: '500g', price: Math.round(product.price * 2.5) },
  ];

  // Weight options for Chocolate Dream Cake (base price for 250g)
  const chocolateDreamCakeWeightOptions = [
    { value: '250g', label: '250g', price: 250 },
    { value: '500g', label: '500g', price: 500 },
    { value: '1kg', label: '1 KG', price: 1000 },
  ];

  const weightOptions = isChocolateDreamCake ? chocolateDreamCakeWeightOptions : (isKunafa ? kunafaWeightOptions : (isBirthdayCake ? cakeWeightOptions : brownieWeightOptions));

  const handleWeightChange = (event, newWeight) => {
    if (newWeight !== null) {
      setSelectedWeight(newWeight);
    }
  };

  const getCurrentPrice = () => {
    if (isBirthdayCake || isBrownie || isKunafa || isChocolateDreamCake) {
      const selected = weightOptions.find(opt => opt.value === selectedWeight);
      return selected ? selected.price : product.price;
    }
    return product.price;
  };

  const getCurrentWeight = () => {
    if (isBirthdayCake || isBrownie || isKunafa || isChocolateDreamCake) {
      // Convert selected weight to grams
      if (selectedWeight === '100g') return '100g';
      if (selectedWeight === '200g') return '200g';
      if (selectedWeight === '250g') return '250g';
      if (selectedWeight === '500g') return '500g';
      if (selectedWeight === '1kg') return '1000g';
      if (selectedWeight === '1.5kg') return '1500g';
      if (selectedWeight === '2kg') return '2000g';
    }
    return `${product.grams}g`;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-container': {
          alignItems: { xs: 'flex-end', md: 'center' },
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: { xs: '12px', md: 0 },
          maxHeight: { xs: '85vh', md: '90vh' },
          margin: { xs: 2, md: 2 },
          width: { xs: 'calc(100% - 32px)', md: 'auto' },
          maxWidth: { xs: 'calc(100% - 32px)', md: '900px' },
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          zIndex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          '&:hover': {
            backgroundColor: '#fff',
          },
        }}
      >
        <Close />
      </IconButton>

      <DialogContent sx={{ padding: 0 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            minHeight: { xs: 'auto', md: '500px' },
            maxHeight: { xs: '85vh', md: 'auto' },
          }}
        >
          {/* Left Side - Image */}
          <Box
            sx={{
              width: { xs: '45%', md: '50%' },
              position: 'relative',
              height: { xs: 'auto', md: 'auto' },
              minHeight: { xs: '100%', md: '500px' },
              maxHeight: { xs: 'none', md: '500px' },
              backgroundColor: '#f5f5f5',
              flexShrink: 0,
              overflow: 'hidden',
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              loading="eager"
              decoding="async"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                backgroundColor: '#f5f5f5',
              }}
            />

            {/* Favorite Button */}
            <IconButton
              onClick={() => setIsFavorite(!isFavorite)}
              sx={{
                position: 'absolute',
                top: { xs: 8, md: 16 },
                left: { xs: 8, md: 16 },
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                padding: { xs: '6px', md: '8px' },
                '&:hover': {
                  backgroundColor: '#fff',
                },
              }}
            >
              {isFavorite ? (
                <Favorite sx={{ color: '#e91e63', fontSize: { xs: '18px', md: '24px' } }} />
              ) : (
                <FavoriteBorder sx={{ fontSize: { xs: '18px', md: '24px' } }} />
              )}
            </IconButton>

            {/* Share Button */}
            <IconButton
              onClick={handleShare}
              sx={{
                position: 'absolute',
                top: { xs: 8, md: 16 },
                right: { xs: 8, md: 16 },
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                padding: { xs: '6px', md: '8px' },
                '&:hover': {
                  backgroundColor: '#fff',
                },
              }}
            >
              <Share sx={{ fontSize: { xs: '18px', md: '24px' } }} />
            </IconButton>
          </Box>

          {/* Right Side - Details */}
          <Box
            sx={{
              width: { xs: '55%', md: '50%' },
              padding: { xs: '16px', md: '32px' },
              overflowY: 'auto',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Category Badge */}
            <Typography
              sx={{
                color: '#e91e63',
                fontWeight: 600,
                marginBottom: { xs: 0.5, md: 1.5 },
                fontSize: { xs: '0.65rem', md: '0.875rem' },
                textTransform: 'capitalize',
              }}
            >
              {product.category}
            </Typography>

            {/* Product Name */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                marginBottom: { xs: 0.5, md: 1.5 },
                color: '#333',
                fontSize: { xs: '1rem', md: '2rem' },
                lineHeight: 1.2,
              }}
            >
              {product.name}
            </Typography>

            {/* Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 0.8 }, marginBottom: { xs: 0.8, md: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                <Star sx={{ color: '#ffa726', fontSize: { xs: '14px', md: '20px' } }} />
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#333', fontSize: { xs: '0.75rem', md: '1.1rem' } }}>
                  {product.rating}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', md: '0.95rem' } }}>
                ({product.reviews} reviews)
              </Typography>
            </Box>

            {/* Weight Selection for Birthday Cakes, Brownies, Kunafa, and Chocolate Dream Cake */}
            {(isBirthdayCake || isBrownie || isKunafa || isChocolateDreamCake) && (
              <Box sx={{ marginBottom: { xs: 1.5, md: 2 } }}>
                <Typography variant="body2" sx={{ marginBottom: 1, fontWeight: 600, color: '#333', fontSize: { xs: '0.75rem', md: '0.9rem' } }}>
                  Select Weight:
                </Typography>
                <ToggleButtonGroup
                  value={selectedWeight}
                  exclusive
                  onChange={handleWeightChange}
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: { xs: 0.5, md: 1 },
                    '& .MuiToggleButtonGroup-grouped': {
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px !important',
                      margin: 0,
                      padding: { xs: '6px 12px', md: '8px 16px' },
                      fontSize: { xs: '0.7rem', md: '0.875rem' },
                      '&.Mui-selected': {
                        backgroundColor: '#e91e63',
                        color: '#fff',
                        borderColor: '#e91e63',
                        '&:hover': {
                          backgroundColor: '#d81b60',
                        },
                      },
                    },
                  }}
                >
                  {weightOptions.map((option) => (
                    <ToggleButton key={option.value} value={option.value}>
                      {option.label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>
            )}

            {/* Price */}
            <Typography
              variant="h3"
              sx={{
                color: '#e91e63',
                fontWeight: 700,
                marginBottom: { xs: 1, md: 2.5 },
                fontSize: { xs: '1.5rem', md: '2.5rem' },
              }}
            >
              ₹{getCurrentPrice()}
            </Typography>

            {/* Description */}
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                lineHeight: 1.5,
                marginBottom: { xs: 1, md: 2.5 },
                fontSize: { xs: '0.7rem', md: '0.95rem' },
              }}
            >
              Crafted with premium ingredients and baked fresh daily. Perfect for any occasion!
            </Typography>

            {/* Product Info */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: { xs: 0.5, md: 3 },
                marginBottom: { xs: 1, md: 2.5 },
                flexWrap: 'wrap',
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', md: '0.95rem' } }}>
                <strong>Weight:</strong> {getCurrentWeight()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', md: '0.95rem' } }}>
                <strong>Pieces:</strong> {product.pieces}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', md: '0.95rem' } }}>
                <strong>Category:</strong> {product.category}
              </Typography>
            </Box>

            {/* Additional Info */}
            <Box
              sx={{
                marginTop: 'auto',
                padding: { xs: '8px', md: '16px' },
                backgroundColor: '#fef5f9',
                borderLeft: '3px solid #e91e63',
              }}
            >
              <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.5, fontSize: { xs: '0.65rem', md: '0.875rem' } }}>
                ✓ Fresh daily • Premium ingredients • Delivery charges may apply
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
