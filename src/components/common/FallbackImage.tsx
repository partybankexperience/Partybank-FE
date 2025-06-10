
import { useState } from 'react';
import { getFallbackImage, FALLBACK_IMAGES } from '../../config/fallbackImages';

interface FallbackImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackType?: keyof typeof FALLBACK_IMAGES;
  fallbackSrc?: string;
}

const FallbackImage = ({ 
  src, 
  alt, 
  className = "", 
  fallbackType = 'default',
  fallbackSrc
}: FallbackImageProps) => {
  const defaultFallback = fallbackSrc || getFallbackImage(fallbackType);
  const [imgSrc, setImgSrc] = useState(src || defaultFallback);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && imgSrc !== defaultFallback) {
      setHasError(true);
      setImgSrc(defaultFallback);
    }
  };

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      className={className}
      onError={handleError}
    />
  );
};

export default FallbackImage;
