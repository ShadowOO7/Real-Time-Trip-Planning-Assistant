import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import tripRoutes from "./routes/trip.js";

import authRoutes from './routes/auth.js';  // ✅ make sure this file exists

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/trips", tripRoutes);

// Routes
app.use('/api/auth', authRoutes);  // ✅ auth endpoints

// Health check
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
}).catch(err => console.error('❌ MongoDB connection error:', err));
