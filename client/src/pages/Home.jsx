import React from 'react';
import Slideshow from '../components/Slideshow';

export default function Home() {
  const images = [
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470", // mountains
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", // sea/river
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e", // hills/forest
    "https://images.unsplash.com/photo-1467269204594-9661b134dd2b", // city
  ];
  return (
    <div style={{padding:16}}>
      <h2>Plan trips together in real-time</h2>
      <p>Collaborative itineraries, chat, proposals, suggestions & more.</p>
      <Slideshow images={images} interval={3000} height={420} />
    </div>
  );
}
