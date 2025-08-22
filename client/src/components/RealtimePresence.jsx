import React from 'react';

export default function RealtimePresence({ members=[], shareCode }) {
  return (
    <div className="item">
      <div><b>Share Code:</b> {shareCode}</div>
      <div><b>Members:</b> {members.join(', ') || '—'}</div>
    </div>
  );
}
