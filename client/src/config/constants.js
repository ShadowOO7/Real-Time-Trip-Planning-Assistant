export const API_URL = import.meta.env.VITE_API_BASE || '/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || window.location.origin;
export const MAP_CONFIG = {
  defaultZoom: 13,
  defaultCenter: { lat: 20, lng: 0 }
};