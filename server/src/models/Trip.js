import mongoose from 'mongoose';

const TripSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerName: { type: String, required: true },
  shareCode: { type: String, required: true, unique: true },
  members: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('Trip', TripSchema);
