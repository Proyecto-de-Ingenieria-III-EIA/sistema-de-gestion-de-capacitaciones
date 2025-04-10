import React from "react";
import Image from "next/image";

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const Img: React.FC<ImageProps> = ({ src, alt, className}) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={250}
      height={300}
      className={className}
    />
  );
};