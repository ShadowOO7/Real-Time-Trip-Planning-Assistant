import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  title: { type: String, required: true },
  items: { type: [String], default: [] }, // Changed from destination to items array
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export default mongoose.model("Trip", tripSchema);
