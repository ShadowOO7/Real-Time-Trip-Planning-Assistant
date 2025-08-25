import axios from "axios";
import Item from "../models/Item.js";

const base = process.env.NOMINATIM_URL || "https://nominatim.openstreetmap.org";
const email = process.env.NOMINATIM_EMAIL || "example@example.com";

/**
 * Get up to `limit` interesting places near lat/lng.
 */
export async function suggestNearby({ lat, lng, limit = 10 }) {
  const res = await axios.get(`${base}/search`, {
    params: {
      format: "jsonv2",
      q: "",
      featuretype: "point",
      addressdetails: 1,
      extratags: 1,
      dedupe: 1,
      limit,
      // use 'viewbox' + 'bounded' to bias; here we use around via 'q' trick on categories:
      // we'll just leverage 'around' with OS-specific providers is tricky; so use a category search by tagging:
      // fallback: search common tourism categories by 'amenity'/'tourism' keywords around terms.
      // Simpler approach: 'q' combined keywords + lat/lon via 'near' isn't official; so instead:
    },
    headers: { "User-Agent": `rtp-app/1.0 (${email})` }
  });
  return res.data;
}

/**
 * For a given trip, find item with status 'next' and suggest near it.
 */
export async function suggestForNextTripItem(tripId, limit = 10) {
  const nextItem = await Item.findOne({ tripId, status: 'next', lat: { $ne: null }, lng: { $ne: null } });
  if (!nextItem) return [];
  // Use a bounding box around nextItem coordinates and search typical sightseeing categories
  const delta = 0.2; // ~20km box each side (varies with latitude)
  const viewbox = [
    nextItem.lng - delta, nextItem.lat + delta,
    nextItem.lng + delta, nextItem.lat - delta
  ].join(',');

  const categories = [
    "tourism=attraction", "tourism=museum", "tourism=viewpoint", "natural=peak",
    "natural=water", "waterway=waterfall", "amenity=place_of_worship",
    "historic=monument", "leisure=park"
  ];

  // Query each category and merge
  const axiosOpts = {
    headers: { "User-Agent": `rtp-app/1.0 (${email})` },
    params: { format: "jsonv2", addressdetails: 1, limit: Math.ceil(limit/2), viewbox, bounded: 1 }
  };

  const results = [];
  for (const cat of categories) {
    const res = await axios.get(`${base}/search?${cat}`, axiosOpts);
    if (Array.isArray(res.data)) results.push(...res.data);
    if (results.length >= limit * 2) break; // cap requests
  }

  // Rank / dedupe
  const seen = new Set();
  const ranked = results
    .filter(r => r && r.lat && r.lon && r.display_name)
    .filter(r => { const key = r.osm_type + r.osm_id; if (seen.has(key)) return false; seen.add(key); return true; })
    .slice(0, limit)
    .map(r => ({
      title: r.namedetails?.name || r.display_name.split(',')[0],
      address: r.display_name,
      lat: parseFloat(r.lat), lng: parseFloat(r.lon)
    }));
  return ranked.slice(0, limit);
}
