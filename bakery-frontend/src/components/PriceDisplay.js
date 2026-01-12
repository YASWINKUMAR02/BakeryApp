import React from 'react';
import { Box, Typography } from '@mui/material';
import { formatCurrencyParts } from '../utils/currencyUtils';

/**
 * A professional price display component.
 * Uses subtle typographic scaling for a clean, integrated feel.
 */
const PriceDisplay = ({ amount, color = '#121212', fontSize = '1.5rem', fontWeight = 700, variant = 'h4' }) => {
    const { symbol, value } = formatCurrencyParts(amount);

    return (
        <Box sx={{
            display: 'inline-flex',
            alignItems: 'baseline',
            gap: 0,
            whiteSpace: 'nowrap'
        }}>
            <Typography
                component="span"
                sx={{
                    fontSize: `calc(${fontSize} * 0.7)`,
                    fontWeight: 500, // Lighter weight for symbol for elegance
                    color: color,
                    mr: 0.3,
                    opacity: 0.9
                }}
            >
                {symbol}
            </Typography>
            <Typography
                variant={variant}
                component="span"
                sx={{
                    fontSize: fontSize,
                    fontWeight: fontWeight,
                    color: color,
                    letterSpacing: '-0.02em',
                    lineHeight: 1
                }}
            >
                {value}
            </Typography>
        </Box>
    );
};

export default PriceDisplay;
