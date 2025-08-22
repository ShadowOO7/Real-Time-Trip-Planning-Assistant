import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";
import initSockets from "./sockets/index.js";

dotenv.config();
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

// --- MongoDB connection (Mongoose) ---
// Old behavior (Atlas-only): connect only if MONGODB_URI set
// if (!process.env.MONGODB_URI) {
//   console.warn("⚠️  MONGODB_URI is not set. The server will start, but DB operations will fail.");
// } else {
//   mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
//     .then(() => console.log("✅ Connected to MongoDB via Mongoose"))
//     .catch((err) => console.error("❌ MongoDB connection error:", err));
// }

// New behavior: fall back to system/local MongoDB if MONGODB_URI is not provided
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/realtime-trip-planner';
mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 })
  .then(() => console.log(`✅ Connected to MongoDB via Mongoose (${process.env.MONGODB_URI ? 'env URI' : 'local fallback'})`))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- Socket.IO setup ---
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGINS?.split(",") || "*",
    methods: ["GET", "POST"],
  },
});
// make io available to express routes/controllers
app.set('io', io);
initSockets(io);

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
