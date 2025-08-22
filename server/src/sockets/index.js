export default function initSockets(io) {
  io.on('connection', (socket) => {
    socket.on('join-trip', (tripId) => {
      socket.join(`trip:${tripId}`);
      socket.emit('joined', { tripId });
    });
    socket.on('leave-trip', (tripId) => {
      socket.leave(`trip:${tripId}`);
    });
  });
}
