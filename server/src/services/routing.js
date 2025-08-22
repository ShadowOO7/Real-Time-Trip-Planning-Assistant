import axios from 'axios';

const osrm = process.env.OSRM_URL || 'https://router.project-osrm.org';

export async function travelTimesMatrix(coords) {
  // coords: [{lat, lng}, ...]
  const coordinates = coords.map(c => `${c.lng},${c.lat}`).join(';');
  const url = `${osrm}/table/v1/driving/${coordinates}`;
  const res = await axios.get(url, { timeout: 15000 });
  return res.data; // durations: number[][] in seconds
}

export async function routeLine(coords) {
  const coordinates = coords.map(c => `${c.lng},${c.lat}`).join(';');
  const url = `${osrm}/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;
  const res = await axios.get(url, { timeout: 15000 });
  return res.data; // routes[0].geometry
}
