import React from "react";

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const Image: React.FC<ImageProps> = ({ src, alt, className }) => {
  return <img src={src} alt={alt} className={`w-full h-48 object-cover rounded-t-lg ${className}`} />;
};