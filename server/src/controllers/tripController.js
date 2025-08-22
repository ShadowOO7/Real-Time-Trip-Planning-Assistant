import Trip from '../models/Trip.js';
import Item from '../models/Item.js';
import createError from 'http-errors';

function randomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function createTrip(req, res, next) {
  try {
    const { name, ownerName } = req.body;
    if (!name || !ownerName) throw createError(400, 'name and ownerName required');
    const shareCode = randomCode();
    const trip = await Trip.create({ name, ownerName, shareCode, members: [ownerName] });
    res.json(trip);
  } catch (e) { next(e); }
}

export async function joinTrip(req, res, next) {
  try {
    const { shareCode, memberName } = req.body;
    const trip = await Trip.findOne({ shareCode });
    if (!trip) throw createError(404, 'Trip not found');
    if (!trip.members.includes(memberName)) {
      trip.members.push(memberName);
      await trip.save();
    }
    res.json(trip);
  } catch (e) { next(e); }
}

export async function getTrip(req, res, next) {
  try {
    const { tripId } = req.params;
    const trip = await Trip.findById(tripId);
    if (!trip) throw createError(404, 'Trip not found');
    const items = await Item.find({ tripId }).sort({ orderIndex: 1, createdAt: 1 });
    res.json({ trip, items });
  } catch (e) { next(e); }
}
