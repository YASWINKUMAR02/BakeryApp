import { useEffect, useRef } from 'react';

const useSwipeGesture = (onSwipeLeft, onSwipeRight, threshold = 50) => {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartX.current = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
      touchEndX.current = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const distance = touchStartX.current - touchEndX.current;
      const isLeftSwipe = distance > threshold;
      const isRightSwipe = distance < -threshold;

      if (isLeftSwipe && onSwipeLeft) {
        onSwipeLeft();
      }
      if (isRightSwipe && onSwipeRight) {
        onSwipeRight();
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, threshold]);
};

export default useSwipeGesture;
