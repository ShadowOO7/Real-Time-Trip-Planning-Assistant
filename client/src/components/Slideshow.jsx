import React, { useEffect, useRef, useState } from 'react';

export default function Slideshow({ images = [], interval = 3000, height = 400 }) {
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);
  
  useEffect(() => {
    timer.current = setInterval(() => setIdx(i => (i + 1) % images.length), interval);
    return () => clearInterval(timer.current);
  }, [images.length, interval]);

  const nextSlide = () => setIdx((idx + 1) % images.length);
  const prevSlide = () => setIdx((idx - 1 + images.length) % images.length);

  return (
    <div 
      className="relative overflow-hidden rounded-lg shadow-lg" 
      style={{ height: height }}
    >
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`Slide ${i + 1}`}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-800"
          style={{ opacity: i === idx ? 1 : 0 }}
        />
      ))}
      
      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
      >
        ←
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
      >
        →
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`w-2 h-2 rounded-full transition ${
              i === idx ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
