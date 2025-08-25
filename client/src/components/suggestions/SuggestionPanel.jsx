import React, { useEffect, useState } from 'react';
import api from '../../api/http';

export default function SuggestionPanel({ tripId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async () => {
    if (!tripId) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/suggest/next/${tripId}`);
      setItems(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSuggestions(); }, [tripId]);

  return (
    <div className="item" style={{height:'48%', overflow:'hidden', display:'flex', flexDirection:'column'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <b>Suggestions (near Next)</b>
        <button onClick={fetchSuggestions}>Refresh</button>
      </div>
      <div style={{flex:1, overflowY:'auto', marginTop:8}}>
        {loading ? <div>Loading...</div> : (items||[]).slice(0,10).map((s, idx) => (
          <div key={idx} style={{marginBottom:8}}>
            <div><b>{s.title}</b></div>
            <div style={{fontSize:12, color:'#666'}}>{s.address}</div>
          </div>
        ))}
        {!loading && (items||[]).length === 0 && <div>No suggestions yet. Mark one item as “Next”.</div>}
      </div>
    </div>
  );
}
