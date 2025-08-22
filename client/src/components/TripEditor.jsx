import React, { useEffect, useState, useMemo } from 'react';
import io from 'socket.io-client';
import api from '../api/http';
import ItemForm from './ItemForm';
import MapView from './MapView';
import RouteSummary from './RouteSummary';
import RealtimePresence from './RealtimePresence';

let socket;

export default function TripEditor({ trip }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!trip?._id) return;
    // fetch items
    (async () => {
      setLoading(true);
      const { data } = await api.get(`/trips/${trip._id}`);
      setItems(data.items || []);
      setLoading(false);
    })();

    // socket
    if (!socket) {
      socket = io('/', { path: '/socket.io' });
    }
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
    socket.on('items:reordered', (newItems) => {
      setItems(newItems);
    });

    return () => {
      socket?.emit('leave-trip', trip._id);
    };
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

  return (
    <div style={{display:'flex', flexDirection:'column', height:'100%'}}>
      <div style={{padding:12, borderBottom:'1px solid var(--border)'}}>
        <h2 style={{margin:'8px 0'}}>{trip.name}</h2>
        <RealtimePresence members={trip.members} shareCode={trip.shareCode} />
        <ItemForm onAdd={addItem} />
      </div>

      <div style={{display:'flex', flex:1}}>
        <div style={{width:440, padding:12, borderRight:'1px solid var(--border)', overflowY:'auto'}}>
          <div className="row" style={{justifyContent:'space-between', marginBottom:8}}>
            <b>Itinerary</b>
            <span className="pill">{(items||[]).length} items</span>
          </div>
          {loading && <div className="muted">Loading…</div>}
          {(items||[]).map((i, idx) => (
            <div key={i._id} className="item">
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div>#{idx+1} <b>{i.title}</b> <span className="muted" style={{fontSize:12}}>({i.type})</span></div>
                <div className="row">
                  <button className="btn-secondary" onClick={()=>reorder('up', idx)}>Move ↑</button>
                  <button className="btn-secondary" onClick={()=>reorder('down', idx)}>Move ↓</button>
                </div>
              </div>
              <div className="muted" style={{fontSize:12}}>{i.address || '—'}</div>
              <div className="row">
                <button className="btn-secondary" onClick={()=>updateItem(i._id, { title: prompt('New title', i.title) || i.title })}>Rename</button>
                <button className="btn-danger" onClick={()=>deleteItem(i._id)}>Delete</button>
              </div>
            </div>
          ))}
          <div className="row">
            <button onClick={optimize}>Optimize Order</button>
          </div>
          <RouteSummary items={items} />
        </div>

        <MapView items={items} />
      </div>
    </div>
  );
}
