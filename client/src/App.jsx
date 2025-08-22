import React, { useEffect, useState } from 'react';
import TripList from './components/TripList';
import TripEditor from './components/TripEditor';

export default function App() {
  const [trip, setTrip] = useState(null);
  return (
    <div style={{display:'flex', width:'100%'}}>
      <div className="sidebar">
        <div className="app-header" style={{position:'sticky',top:0}}>
          <div className="brand">
            <div className="brand-badge">RT</div>
            <div className="brand-title">Real‑Time Trip Planner</div>
          </div>
          <span className="pill muted">Live</span>
        </div>
        <TripList onOpenTrip={setTrip} />
      </div>
      <div className="content">
        <TripEditor trip={trip} />
      </div>
    </div>
  );
}
