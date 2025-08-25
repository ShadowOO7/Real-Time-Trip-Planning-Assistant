import mongoose from 'mongoose';

const ChatMessageSchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  userName: { type: String, required: true },
  text: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('ChatMessage', ChatMessageSchema);
