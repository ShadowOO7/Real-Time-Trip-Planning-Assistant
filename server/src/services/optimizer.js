// Simple nearest-neighbor optimizer with OSRM table fallback to Haversine
import { travelTimesMatrix } from './routing.js';

function haversine(a, b) {
  const R = 6371e3;
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x = Math.sin(dLat/2)**2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng/2)**2;
  return 2 * R * Math.asin(Math.sqrt(x)); // meters
}

export async function optimizeOrder(items) {
  const coords = items.map(i => ({ lat: i.lat, lng: i.lng }));
  let matrix = null;
  try {
    const table = await travelTimesMatrix(coords);
    matrix = table?.durations;
  } catch (_e) {
    // Fallback to distance in seconds approximation (distance/15m/s ~ 54km/h)
    const n = coords.length;
    matrix = Array.from({length: n}, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const d = haversine(coords[i], coords[j]); // meters
        matrix[i][j] = d / 15; // seconds approx
      }
    }
  }

  const n = items.length;
  if (n <= 2) return items.map((it, idx) => ({ ...it, orderIndex: idx }));
  const visited = new Array(n).fill(false);
  let order = [];
  let current = 0;
  visited[0] = true;
  order.push(0);
  for (let step = 1; step < n; step++) {
    let best = -1, bestCost = Infinity;
    for (let j = 0; j < n; j++) {
      if (!visited[j] && matrix[current][j] < bestCost) {
        bestCost = matrix[current][j];
        best = j;
      }
    }
    if (best === -1) break;
    visited[best] = true;
    order.push(best);
    current = best;
  }
  return order.map((idx, orderIndex) => ({ ...items[idx], orderIndex }));
}
