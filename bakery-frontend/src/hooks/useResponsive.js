import { useTheme, useMediaQuery } from '@mui/material';

/**
 * Custom hook for responsive design
 * Returns boolean flags for different screen sizes
 */
export const useResponsive = () => {
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // < 600px
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 600px - 960px
  const isDesktop = useMediaQuery(theme.breakpoints.up('md')); // > 960px
  const isSmallMobile = useMediaQuery('(max-width:400px)'); // Very small phones
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    isSmallMobile,
    // Convenience flags
    isMobileOrTablet: isMobile || isTablet,
    isLargeScreen: useMediaQuery(theme.breakpoints.up('lg')),
  };
};

export default useResponsive;
