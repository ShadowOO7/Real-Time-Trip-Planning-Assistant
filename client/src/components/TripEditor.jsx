import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import api from '../api/http';
import ItemForm from './ItemForm';
import MapView from './MapView';
import RouteSummary from './RouteSummary';
import RealtimePresence from './RealtimePresence';
import ChatPanel from './chat/ChatPanel';
import SuggestionPanel from './suggestions/SuggestionPanel';

let socket;

export default function TripEditor({ trip }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!trip?._id) return;
    (async () => {
      setLoading(true);
      const { data } = await api.get(`/trips/${trip._id}`);
      setItems(data.items || []);
      setLoading(false);
    })();

    if (!socket) socket = io('/', { path: '/socket.io' });
    socket.emit('join-trip', trip._id);
    socket.on('item:added', (item) => {
      if (item.tripId === trip._id) setItems(prev => [...prev, item].sort((a,b)=>a.orderIndex-b.orderIndex));
    });
    socket.on('item:updated', (item) => {
      if (item.tripId === trip._id) setItems(prev => prev.map(i => i._id===item._id? item : i).sort((a,b)=>a.orderIndex-b.orderIndex));
    });
    socket.on('item:deleted', ({_id}) => {
      setItems(prev => prev.filter(i => i._id !== _id));
    });
    socket.on('items:reordered', (newItems) => { setItems(newItems); });

    return () => { socket?.emit('leave-trip', trip._id); };
  }, [trip?._id]);

  const addItem = async (payload) => {
    const { data } = await api.post(`/items/${trip._id}`, payload);
    setItems(prev => [...prev, data].sort((a,b)=>a.orderIndex-b.orderIndex));
  };

  const updateItem = async (id, updates) => {
    const { data } = await api.patch(`/items/${id}`, updates);
    setItems(prev => prev.map(i => i._id===id? data : i));
  };

  const deleteItem = async (id) => {
    await api.delete(`/items/${id}`);
    setItems(prev => prev.filter(i => i._id !== id));
  };

  const reorder = async (direction, idx) => {
    const newOrder = [...items];
    const swapIdx = direction === 'up' ? idx-1 : idx+1;
    if (swapIdx < 0 || swapIdx >= items.length) return;
    [newOrder[idx], newOrder[swapIdx]] = [newOrder[swapIdx], newOrder[idx]];
    const orderIds = newOrder.map(i => i._id);
    const { data } = await api.post(`/items/${trip._id}/reorder`, { order: orderIds });
    setItems(data);
  };

  const optimize = async () => {
    const { data } = await api.post(`/optimize/${trip._id}`);
    setItems(data);
  };

  if (!trip) return <div style={{padding:16}}>Create or join a trip to begin.</div>;

  const byStatus = (s) => (items||[]).filter(i => (i.status || 'planned') === s);
  const setStatus = (id, status) => updateItem(id, { status });

  const inviteLink = `${window.location.origin}/login?code=${trip.shareCode}`;

  return (
    <div style={{display:'flex', flexDirection:'column', height:'100%'}}>
      <div style={{padding:12, borderBottom:'1px solid #ddd'}}>
        <h2 style={{margin:'8px 0'}}>{trip.name}</h2>
        <RealtimePresence members={trip.members} shareCode={trip.shareCode} />
        <div className="item">
          <b>Invite friends</b>
          <div className="row">
            <input readOnly value={inviteLink} style={{flex:1}}/>
            <button onClick={()=>navigator.clipboard.writeText(inviteLink)}>Copy Link</button>
          </div>
          <small>Share code: {trip.shareCode} — your friends can join from the login/register page.</small>
        </div>
        <ItemForm onAdd={addItem} />
      </div>

      <div style={{display:'flex', flex:1}}>
        {/* Left: itinerary buckets */}
        <div style={{width:520, padding:12, borderRight:'1px solid #ddd', overflowY:'auto'}}>
          <b>Proposals</b>
          {byStatus('proposed').map((i, idx) => (
            <ItemRow key={i._id} i={i} idx={idx} reorder={reorder} setStatus={setStatus} deleteItem={deleteItem} />
          ))}
          <hr/>
          <b>Next</b>
          {byStatus('next').map((i, idx) => (
            <ItemRow key={i._id} i={i} idx={idx} reorder={reorder} setStatus={setStatus} deleteItem={deleteItem} />
          ))}
          <hr/>
          <b>Planned</b>
          {byStatus('planned').map((i, idx) => (
            <ItemRow key={i._id} i={i} idx={idx} reorder={reorder} setStatus={setStatus} deleteItem={deleteItem} />
          ))}
          <hr/>
          <b>Visited</b>
          {byStatus('visited').map((i, idx) => (
            <ItemRow key={i._id} i={i} idx={idx} reorder={reorder} setStatus={setStatus} deleteItem={deleteItem} />
          ))}

          <div className="row" style={{marginTop:8}}>
            <button onClick={optimize}>Optimize Order</button>
          </div>
          <RouteSummary items={items} />
        </div>

        {/* Middle: map */}
        <MapView items={items} />

        {/* Right: chat + suggestions */}
        <div style={{width:360, borderLeft:'1px solid #ddd', padding:12}}>
          <ChatPanel tripId={trip._id} socket={socket} />
          <SuggestionPanel tripId={trip._id} />
        </div>
      </div>
    </div>
  );
}

function ItemRow({ i, idx, reorder, setStatus, deleteItem }) {
  return (
    <div className="item">
      <div style={{display:'flex', justifyContent:'space-between', gap:8}}>
        <div>#{idx+1} <b>{i.title}</b> <span style={{fontSize:12,color:'#777'}}>({i.type})</span></div>
        <div>
          <button onClick={()=>reorder('up', idx)}>↑</button>
          <button onClick={()=>reorder('down', idx)}>↓</button>
        </div>
      </div>
      <div style={{fontSize:12, color:'#555'}}>{i.address || '—'}</div>
      <div className="row" style={{marginTop:6, gap:6}}>
        <select value={i.status || 'planned'} onChange={e=>setStatus(i._id, e.target.value)}>
          <option value="proposed">Proposed</option>
          <option value="next">Next</option>
          <option value="planned">Planned</option>
          <option value="visited">Visited</option>
        </select>
        <button onClick={()=>deleteItem(i._id)}>Delete</button>
      </div>
    </div>
  );
}
