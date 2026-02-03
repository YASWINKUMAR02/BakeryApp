import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import designTokens from '../theme/designTokens';

const { colors, spacing } = designTokens;

const SectionHeader = ({
  eyebrow,
  title,
  description,
  align = 'left',
  actions,
  maxWidth = 540,
}) => {
  return (
    <Box
      sx={{
        textAlign: align,
        maxWidth,
        width: '100%',
        margin: align === 'center' ? '0 auto' : 0,
      }}
    >
      {eyebrow && (
        <Typography
          variant="overline"
          sx={{
            color: colors.brandPink,
            letterSpacing: '0.2em',
            fontWeight: 700,
            textTransform: 'uppercase',
            mb: 1,
            display: 'inline-block',
          }}
        >
          {eyebrow}
        </Typography>
      )}

      {title && (
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            letterSpacing: '-0.02em',
            fontSize: { xs: '1.9rem', md: '2.65rem' },
            color: colors.brandInk,
            lineHeight: 1.15,
            mb: description ? 1.5 : 0,
          }}
        >
          {title}
        </Typography>
      )}

      {description && (
        <Typography
          variant="body1"
          sx={{
            color: colors.stone,
            fontSize: { xs: '1rem', md: '1.05rem' },
            lineHeight: 1.6,
            mb: actions ? spacing(3) : 0,
          }}
        >
          {description}
        </Typography>
      )}

      {actions && (
        <Stack
          direction="row"
          spacing={2}
          justifyContent={align === 'center' ? 'center' : 'flex-start'}
        >
          {actions}
        </Stack>
      )}
    </Box>
  );
};

export default SectionHeader;
