const designTokens = {
  colors: {
    brandPink: '#e91e63',
    brandBurgundy: '#ad1457',
    brandDark: '#121212',
    brandInk: '#1a1a1a',
    stone: '#555555',
    muted: '#999999',
    cloud: '#f7f4f6',
    paper: '#ffffff',
    accentGold: '#D4AF37',
    success: '#2e7d32',
    warning: '#ed6c02',
    danger: '#d32f2f'
  },
  gradients: {
    primary: 'linear-gradient(135deg, #e91e63 0%, #ad1457 100%)',
    softRose: 'linear-gradient(135deg, #fff5f8 0%, #ffe3ed 100%)',
    subtleCard: 'linear-gradient(145deg, rgba(233, 30, 99, 0.08) 0%, rgba(173, 20, 87, 0.05) 60%, rgba(255, 255, 255, 0.7) 100%)'
  },
  radii: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    pill: '999px'
  },
  shadows: {
    resting: '0 10px 30px rgba(17, 17, 17, 0.06)',
    hover: '0 25px 60px rgba(233, 30, 99, 0.22)',
    subtle: '0 8px 24px rgba(0, 0, 0, 0.05)'
  },
  spacing: (factor = 1) => `${factor * 4}px`,
  transitions: {
    standard: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
    micro: 'all 0.25s ease'
  }
};

export default designTokens;
