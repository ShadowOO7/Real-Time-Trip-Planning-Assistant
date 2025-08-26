import io from 'socket.io-client';
import { useAuthStore } from '../store/authStore';

let socket = null;

export const initializeSocket = () => {
  if (!socket) {
    const baseUrl = import.meta.env.VITE_API_BASE?.replace('/api', '') || '';
    socket = io(baseUrl, {
      path: '/socket.io',
      auth: {
        token: useAuthStore.getState().token
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    socket.on('reconnect', (attempt) => {
      console.log('Socket reconnected after', attempt, 'attempts');
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const closeSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};