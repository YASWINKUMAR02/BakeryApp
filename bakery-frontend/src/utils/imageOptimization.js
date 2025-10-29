// Image Optimization Utilities
import { useState, useEffect } from 'react';

/**
 * Lazy load image component with placeholder
 */
export const LazyImage = ({ src, alt, className, style, placeholder }) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '/placeholder.png');
  const [imageRef, setImageRef] = useState();

  useEffect(() => {
    let observer;
    
    if (imageRef && imageSrc === placeholder) {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              observer.unobserve(imageRef);
            }
          });
        },
        {
          rootMargin: '50px',
        }
      );
      observer.observe(imageRef);
    }

    return () => {
      if (observer && imageRef) {
        observer.unobserve(imageRef);
      }
    };
  }, [imageRef, imageSrc, src, placeholder]);

  return (
    <img
      ref={setImageRef}
      src={imageSrc}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
    />
  );
};

/**
 * Generate responsive image srcset
 */
export const getResponsiveImageUrl = (baseUrl, width) => {
  // For Unsplash images
  if (baseUrl.includes('unsplash.com')) {
    return `${baseUrl}&w=${width}&q=80&fm=webp`;
  }
  
  // For local images (you would need to have different sizes)
  return baseUrl;
};

/**
 * Generate srcset for responsive images
 */
export const generateSrcSet = (baseUrl) => {
  const sizes = [320, 640, 960, 1280, 1920];
  return sizes
    .map(size => `${getResponsiveImageUrl(baseUrl, size)} ${size}w`)
    .join(', ');
};

/**
 * Optimize image URL (convert to WebP if supported)
 */
export const optimizeImageUrl = (url, options = {}) => {
  const { width, height, quality = 80, format = 'webp' } = options;
  
  if (url.includes('unsplash.com')) {
    let optimizedUrl = url;
    if (width) optimizedUrl += `&w=${width}`;
    if (height) optimizedUrl += `&h=${height}`;
    optimizedUrl += `&q=${quality}&fm=${format}`;
    return optimizedUrl;
  }
  
  return url;
};

/**
 * Preload critical images
 */
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Preload multiple images
 */
export const preloadImages = (srcArray) => {
  return Promise.all(srcArray.map(src => preloadImage(src)));
};

/**
 * Get placeholder image (low quality placeholder)
 */
export const getPlaceholder = (url) => {
  if (url.includes('unsplash.com')) {
    return `${url}&w=50&q=10&blur=50`;
  }
  return url;
};

/**
 * Check if WebP is supported
 */
export const supportsWebP = () => {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  if (canvas.getContext && canvas.getContext('2d')) {
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
};

/**
 * Compress image file before upload
 */
export const compressImage = (file, maxWidth = 1920, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            }));
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export default {
  LazyImage,
  getResponsiveImageUrl,
  generateSrcSet,
  optimizeImageUrl,
  preloadImage,
  preloadImages,
  getPlaceholder,
  supportsWebP,
  compressImage,
};
