import React, { useEffect, useState } from 'react';
import api from '../../api/http';
import { useAuthStore } from '../../store/authStore';

export default function ChatPanel({ tripId, socket }) {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    if (!tripId) return;
    (async () => {
      const { data } = await api.get(`/chat/${tripId}`);
      setMsgs(data || []);
    })();

    if (!socket) return;
    const handler = (m) => {
      if (m.tripId === tripId) setMsgs(prev => [...prev, m]);
    };
    socket.on('chat:new', handler);
    return () => { socket.off('chat:new', handler); };
  }, [tripId, socket]);

  const send = () => {
    if (!text.trim()) return;
    socket.emit('chat:send', { tripId, text, userName: user?.name || user?.email || 'Guest' });
    setText('');
  };

  return (
    <div className="item" style={{height: '48%', display:'flex', flexDirection:'column'}}>
      <b>Group Chat</b>
      <div style={{flex:1, overflowY:'auto', border:'1px solid #eee', borderRadius:6, padding:8, margin:'8px 0'}}>
        {(msgs||[]).map(m => (
          <div key={m._id} style={{marginBottom:6}}>
            <b>{m.userName}:</b> {m.text}
          </div>
        ))}
      </div>
      <div className="row">
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Message..." style={{flex:1}}/>
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}
