import { Server } from 'socket.io';
import ChatMessage from '../models/ChatMessage.js';

export function initSockets(server) {
  const io = new Server(server, {
    cors: {
      origin: (process.env.CORS_ORIGINS || '').split(',').filter(Boolean) || '*'
    }
  });
  io.on('connection', (socket) => {
    socket.on('join-trip', (tripId) => {
      socket.join(`trip:${tripId}`);
      socket.emit('joined', { tripId });
    });
    socket.on('leave-trip', (tripId) => {
      socket.leave(`trip:${tripId}`);
    });

    // Group chat
    socket.on('chat:send', async ({ tripId, text, userName }) => {
      if (!tripId || !text) return;
      const msg = await ChatMessage.create({ tripId, text, userName: userName || 'Guest' });
      io.to(`trip:${tripId}`).emit('chat:new', msg);
    });
  });

  //const app = server.listeners('request')[0]; // attach io to express
  // app.set('io', io);
  return io;
}
