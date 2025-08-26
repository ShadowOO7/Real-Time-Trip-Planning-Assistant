import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  type: { 
    type: String, 
    enum: ['destination','accommodation','activity'], 
    required: true,
    default: 'destination'
  },
  title: { type: String, required: true },
  notes: { type: String },
  address: { type: String },
  lat: { type: Number },
  lng: { type: Number },
  start: { type: Date },
  end: { type: Date },
  cost: { type: Number, default: 0 },
  orderIndex: { type: Number, default: 0 },
  status: { type: String, enum: ['proposed','planned','next','visited'], default: 'planned' },
  metadata: { type: Object }
}, { timestamps: true });

ItemSchema.index({ tripId: 1, orderIndex: 1 });

export default mongoose.model('Item', ItemSchema);
