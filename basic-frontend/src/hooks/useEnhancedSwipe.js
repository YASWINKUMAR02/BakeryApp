import { useState, useRef } from 'react';

/**
 * Enhanced swipe gesture hook with visual feedback
 * Supports horizontal and vertical swipes with drag tracking
 */
const useEnhancedSwipe = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  velocityThreshold = 0.3,
} = {}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    currentX.current = e.touches[0].clientX;
    currentY.current = e.touches[0].clientY;
    
    const deltaX = currentX.current - touchStartX.current;
    const deltaY = currentY.current - touchStartY.current;
    
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleTouchEnd = (e) => {
    if (!isDragging) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndTime = Date.now();
    
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;
    const deltaTime = touchEndTime - touchStartTime.current;
    
    // Calculate velocity (pixels per millisecond)
    const velocityX = Math.abs(deltaX) / deltaTime;
    const velocityY = Math.abs(deltaY) / deltaTime;
    
    // Determine if it's a horizontal or vertical swipe
    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
    
    if (isHorizontal) {
      // Horizontal swipe
      if (Math.abs(deltaX) > threshold || velocityX > velocityThreshold) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > threshold || velocityY > velocityThreshold) {
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp();
        }
      }
    }
    
    // Reset state
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleTouchCancel = () => {
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  // Return handlers and state
  return {
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchCancel,
    },
    isDragging,
    dragOffset,
  };
};

export default useEnhancedSwipe;
