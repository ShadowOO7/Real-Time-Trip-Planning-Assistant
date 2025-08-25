import React, { useState } from 'react';

export default function ItemForm({ onAdd }) {
  const [type, setType] = useState('destination');
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [cost, setCost] = useState(0);
  const [status, setStatus] = useState('planned');

  return (
    <div className="item">
      <div className="row">
        <select value={type} onChange={e=>setType(e.target.value)}>
          <option value="destination">Destination</option>
          <option value="accommodation">Accommodation</option>
          <option value="activity">Activity</option>
        </select>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title"/>
      </div>
      <div className="row">
        <input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Address or place"/>
      </div>
      <div className="row">
        <input type="datetime-local" value={start} onChange={e=>setStart(e.target.value)} />
        <input type="datetime-local" value={end} onChange={e=>setEnd(e.target.value)} />
        <input type="number" value={cost} onChange={e=>setCost(parseFloat(e.target.value || '0'))} placeholder="Cost" style={{width:100}}/>
      </div>
      <div className="row" style={{marginTop:6}}>
        <select value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="proposed">Proposed</option>
          <option value="next">Next</option>
          <option value="planned">Planned</option>
          <option value="visited">Visited</option>
        </select>
        <button onClick={()=>onAdd({type,title,address,start,end,cost,status})}>Add</button>
      </div>
    </div>
  );
}
