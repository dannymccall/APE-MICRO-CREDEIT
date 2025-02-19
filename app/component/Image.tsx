"use client";
import { CldImage } from 'next-cloudinary';

// By default, the CldImage component applies auto-format and auto-quality to all delivery URLs for optimized delivery.
export default function ImageComponent({src}: {src: string}) {
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
      className='rounded-md'
    />
  );
}