import { useEffect, useRef, useState } from 'react';

const usePullToRefresh = (onRefresh, threshold = 80) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  useEffect(() => {
    const handleTouchStart = (e) => {
      // Only trigger if at top of page
      if (window.scrollY === 0) {
        touchStartY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (window.scrollY === 0 && touchStartY.current > 0) {
        touchEndY.current = e.touches[0].clientY;
        const distance = touchEndY.current - touchStartY.current;

        if (distance > 0) {
          setIsPulling(true);
          setPullDistance(Math.min(distance, threshold * 1.5));
        }
      }
    };

    const handleTouchEnd = async () => {
      if (isPulling && pullDistance >= threshold) {
        // Trigger refresh
        if (onRefresh) {
          await onRefresh();
        }
      }

      // Reset
      setIsPulling(false);
      setPullDistance(0);
      touchStartY.current = 0;
      touchEndY.current = 0;
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, pullDistance, onRefresh, threshold]);

  return { isPulling, pullDistance, isRefreshing: pullDistance >= threshold };
};

export default usePullToRefresh;
