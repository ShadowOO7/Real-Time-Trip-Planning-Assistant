import React, { useEffect, useRef, useState } from 'react';

export default function Slideshow({ images = [], interval = 3000, height = 400 }) {
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);
  useEffect(() => {
    timer.current = setInterval(() => setIdx(i => (i + 1) % images.length), interval);
    return () => clearInterval(timer.current);
  }, [images.length, interval]);
  return (
    <div style={{position:'relative', width:'100%', height}}>
      {images.map((src, i) => (
        <img key={src}
             src={src}
             alt=""
             style={{
               position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover',
               opacity: i===idx?1:0, transition:'opacity 800ms ease'
             }}/>
      ))}
    </div>
  );
}
