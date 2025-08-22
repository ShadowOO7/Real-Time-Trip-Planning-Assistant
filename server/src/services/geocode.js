import axios from 'axios';

const base = process.env.NOMINATIM_URL || 'https://nominatim.openstreetmap.org';
const email = process.env.NOMINATIM_EMAIL || 'example@example.com';

export async function geocode(query) {
  const url = `${base}/search`;
  const res = await axios.get(url, {
    params: {
      format: 'jsonv2',
      q: query,
      addressdetails: 1,
      limit: 1,
      email
    },
    headers: {
      'User-Agent': `rtp-app/1.0 (${email})`
    },
    timeout: 10000
  });
  if (!res.data || res.data.length === 0) return null;
  const r = res.data[0];
  return {
    lat: parseFloat(r.lat),
    lng: parseFloat(r.lon),
    display_name: r.display_name,
    raw: r
  };
}
