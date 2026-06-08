'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getLocalizedPath } from '../utils/getLocalizedPath';

export default function SliderClient({ images, lang }: { images: any[], lang: any }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      <style jsx global>{`
        .swiper-wrapper { transform: translateX(-${current * 100}%); }
      `}</style>
      
      {/* Тут рендер пагінації */}
      <div className="swiper-pagination">
        {images.map((_, i) => (
          <button 
            key={i} 
            className={`swiper-pagination-bullet ${current === i ? 'swiper-pagination-bullet-active' : ''}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </>
  );
}