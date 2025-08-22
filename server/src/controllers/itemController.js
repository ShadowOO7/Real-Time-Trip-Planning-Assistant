import Item from '../models/Item.js';
import Trip from '../models/Trip.js';
import createError from 'http-errors';
import { geocode } from '../services/geocode.js';

export async function addItem(req, res, next) {
  try {
    const { tripId } = req.params;
    const { type, title, notes, address, lat, lng, start, end, cost } = req.body;
    const trip = await Trip.findById(tripId);
    if (!trip) throw createError(404, 'Trip not found');

    let position = { lat, lng };
    let resolvedAddress = address;
    if ((!lat || !lng) && address) {
      const g = await geocode(address);
      if (g) {
        position = { lat: g.lat, lng: g.lng };
        resolvedAddress = g.display_name;
      }
    }
    const orderIndex = await Item.countDocuments({ tripId });
    const item = await Item.create({
      tripId, type, title, notes, address: resolvedAddress,
      lat: position.lat, lng: position.lng,
      start, end, cost, orderIndex
    });

    req.io.to(`trip:${tripId}`).emit('item:added', item);
    res.json(item);
  } catch (e) { next(e); }
}

export async function updateItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const updates = req.body;
    const item = await Item.findByIdAndUpdate(itemId, updates, { new: true });
    if (!item) throw createError(404, 'Item not found');
    req.io.to(`trip:${item.tripId}`).emit('item:updated', item);
    res.json(item);
  } catch (e) { next(e); }
}

export async function deleteItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const item = await Item.findByIdAndDelete(itemId);
    if (!item) throw createError(404, 'Item not found');
    req.io.to(`trip:${item.tripId}`).emit('item:deleted', { _id: itemId });
    res.json({ ok: true });
  } catch (e) { next(e); }
}

export async function reorderItems(req, res, next) {
  try {
    const { tripId } = req.params;
    const { order } = req.body; // array of itemIds in new order
    const items = await Item.find({ tripId });
    const map = new Map(order.map((id, idx) => [id, idx]));
    await Promise.all(items.map(i => {
      i.orderIndex = map.get(String(i._id)) ?? i.orderIndex;
      return i.save();
    }));
    const updated = await Item.find({ tripId }).sort({ orderIndex: 1 });
    req.io.to(`trip:${tripId}`).emit('items:reordered', updated);
    res.json(updated);
  } catch (e) { next(e); }
}
