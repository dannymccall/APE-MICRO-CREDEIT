"use client";
import { CldImage } from 'next-cloudinary';

// By default, the CldImage component applies auto-format and auto-quality to all delivery URLs for optimized delivery.
interface ImageProps {
    src: string;
    className?: string;
    }


export default function ImageComponent({src, className="rounded-md"}: ImageProps) {
  return (
    <CldImage
      src={src}// Use this sample image or upload your own via the Media Explorer
      width="100" // Transform the image: auto-crop to square aspect_ratio
      height="100"
      crop={{
        type: 'auto',
        source: true
      }}
      alt='Sample Image'
      className={className}
    />
  );
}