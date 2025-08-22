import React, { useState } from 'react';
import api from '../api/http';

export default function TripList({ onOpenTrip }) {
  const [name, setName] = useState('My Trip');
  const [ownerName, setOwnerName] = useState('You');
  const [shareCode, setShareCode] = useState('');
  const [joinName, setJoinName] = useState('Friend');

  const createTrip = async () => {
    const { data } = await api.post('/trips', { name, ownerName });
    onOpenTrip(data);
  };
  const joinTrip = async () => {
    const { data } = await api.post('/trips/join', { shareCode, memberName: joinName });
    onOpenTrip(data);
  };
  return (
    <div>
      <div className="item" style={{marginBottom:12}}>
        <h2 style={{margin:'0 0 8px'}}>Create Trip</h2>
        <div className="row">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Trip name" />
          <input value={ownerName} onChange={e=>setOwnerName(e.target.value)} placeholder="Your name" />
          <button onClick={createTrip}>Create</button>
        </div>
      </div>
      <div className="item">
        <h2 style={{margin:'0 0 8px'}}>Join Trip</h2>
        <div className="row">
          <input value={shareCode} onChange={e=>setShareCode(e.target.value)} placeholder="Share code" />
          <input value={joinName} onChange={e=>setJoinName(e.target.value)} placeholder="Your name" />
          <button className="btn-secondary" onClick={joinTrip}>Join</button>
        </div>
        <p className="muted" style={{fontSize:12, marginTop:8}}>After creating, share your code from the editor header.</p>
      </div>
    </div>
  );
}
