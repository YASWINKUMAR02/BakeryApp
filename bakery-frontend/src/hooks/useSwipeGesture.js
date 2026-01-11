import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook to handle swipe gestures for navigation
 * Swipe Right -> Go Back
 * Swipe Left -> Go Forward (optional, but usually less common)
 */
const useSwipeGesture = (options = {}) => {
    const {
        threshold = 100,
        onSwipeRight,
        onSwipeLeft,
        disableBackSwipe = false
    } = options;

    const navigate = useNavigate();
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);
    const touchEndX = useRef(0);
    const touchEndY = useRef(0);

    useEffect(() => {
        const handleTouchStart = (e) => {
            touchStartX.current = e.targetTouches[0].clientX;
            touchStartY.current = e.targetTouches[0].clientY;
        };

        const handleTouchMove = (e) => {
            touchEndX.current = e.targetTouches[0].clientX;
            touchEndY.current = e.targetTouches[0].clientY;
        };

        const handleTouchEnd = () => {
            const deltaX = touchEndX.current - touchStartX.current;
            const deltaY = touchEndY.current - touchStartY.current;

            // Ensure it's a horizontal swipe and meets the threshold
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
                if (deltaX > 0) {
                    // Swipe Right (Go Back)
                    if (onSwipeRight) {
                        onSwipeRight();
                    } else if (!disableBackSwipe) {
                        navigate(-1);
                    }
                } else {
                    // Swipe Left (Go Forward)
                    if (onSwipeLeft) {
                        onSwipeLeft();
                    }
                }
            }

            // Reset
            touchStartX.current = 0;
            touchStartY.current = 0;
            touchEndX.current = 0;
            touchEndY.current = 0;
        };

        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchmove', handleTouchMove, { passive: true });
        document.addEventListener('touchend', handleTouchEnd);

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [navigate, threshold, onSwipeRight, onSwipeLeft, disableBackSwipe]);
};

export default useSwipeGesture;
