import React from 'react';

export default function RouteSummary({ items }) {
  const totalCost = (items || []).reduce((a,b)=>a + (b.cost||0), 0);
  return (
    <div className="item">
      <b>Summary</b>
      <div>Total items: {(items||[]).length}</div>
      <div>Total cost: {totalCost.toFixed(2)}</div>
    </div>
  );
}
