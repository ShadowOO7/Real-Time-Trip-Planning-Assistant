import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapView({ items }) {
  const ref = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map(ref.current).setView([20, 0], 2);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(mapRef.current);
    }
  }, []);

  useEffect(() => {
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    const mks = (items || []).filter(i => i.lat && i.lng).map((i, idx) => {
      const marker = L.marker([i.lat, i.lng]).addTo(mapRef.current).bindPopup(`${idx+1}. ${i.title}`);
      return marker;
    });
    markersRef.current = mks;
    if (mks.length) {
      const group = L.featureGroup(mks);
      mapRef.current.fitBounds(group.getBounds().pad(0.2));
    }
  }, [items]);

  return <div className="map" ref={ref}></div>;
}
