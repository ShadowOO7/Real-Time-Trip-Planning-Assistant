import Item from '../models/Item.js';
import createError from 'http-errors';
import { optimizeOrder } from '../services/optimizer.js';

export async function optimizeTrip(req, res, next) {
  try {
    const { tripId } = req.params;
    const items = await Item.find({ tripId }).sort({ orderIndex: 1 });
    const itemsWithCoords = items.filter(i => i.lat && i.lng);
    if (itemsWithCoords.length < 2) throw createError(400, 'Need at least 2 items with coordinates');

    const optimized = await optimizeOrder(itemsWithCoords.map(i => ({
      _id: i._id, title: i.title, lat: i.lat, lng: i.lng, orderIndex: i.orderIndex
    })));

    // apply new orderIndex
    const map = new Map(optimized.map(o => [String(o._id), o.orderIndex]));
    await Promise.all(itemsWithCoords.map(i => {
      i.orderIndex = map.get(String(i._id));
      return i.save();
    }));

    const updated = await Item.find({ tripId }).sort({ orderIndex: 1 });
    req.io.to(`trip:${tripId}`).emit('items:reordered', updated);
    res.json(updated);
  } catch (e) { next(e); }
}
