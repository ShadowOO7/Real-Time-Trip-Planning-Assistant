# Real-Time Trip Planning Assistant (MERN + OSM)

A collaborative travel planner where a group can build and edit an itinerary together. Real-time updates (Socket.IO), OpenStreetMap (Leaflet + Nominatim), and OSRM routing. Includes a simple itinerary optimizer (nearest-neighbor with OSRM/table or Haversine fallback).

## Tech Stack
- **MERN**: MongoDB Atlas, Express, React (Vite), Node.js
- **Real-time**: Socket.IO
- **Maps**: Leaflet with OpenStreetMap tiles
- **Geocoding**: Nominatim (OpenStreetMap)
- **Routing**: OSRM (public endpoint or self-hosted), with fallback to Haversine
- **Architecture**: MVC
- **Deployment**: Render (single service) or Fly.io (Dockerfile)
  
## Project Structure
```
realtime-trip-planner/
  server/
    src/
      app.js, server.js
      config/db.js
      controllers/*.js
      models/*.js
      routes/*.js
      services/{geocode.js,routing.js,optimizer.js}
      sockets/index.js
      middleware/auth.js
    package.json
    Dockerfile
    .env.example
  client/ (Vite + React)
    src/
      main.jsx, App.jsx
      components/*.jsx
      api/http.js
      store/tripStore.js
    package.json
    vite.config.js
    index.html
    .env.example
render.yaml
README.md
docs/Setup.pdf
```

## Quick Start (Local)
1. **MongoDB**: Create a free cluster on MongoDB Atlas. Get the connection string.
2. **Env**: Copy `server/.env.example` to `server/.env` and fill values.
3. **Install**:
   ```bash
   cd realtime-trip-planner
   npm run install:all
   ```
4. **Dev** (concurrently build client once, then run server + socket):
   ```bash
   # build client
   npm run build
   # run api/socket (serves built client)
   npm run dev
   ```
5. Open http://localhost:4000

## Deployment (Render)
- Create a **Web Service** with root set to `/server`
- Build Command: `npm run build:client`
- Start Command: `npm start`
- Add env vars from `.env.example`

## Deployment (Fly.io)
- From repo root:
  ```bash
  fly launch --path server --copy-config --no-deploy
  fly secrets set MONGODB_URI=... JWT_SECRET=... OSRM_URL=https://router.project-osrm.org NOMINATIM_URL=https://nominatim.openstreetmap.org NOMINATIM_EMAIL=you@example.com
  fly deploy --path server
  ```

## Notes on Nominatim Usage
Respect Nominatim usage policy: include a proper User-Agent and email, and throttle requests. For production, consider a provider like OpenCage or a self-hosted Nominatim.

## AI Optimization
The optimizer in `server/src/services/optimizer.js` computes a near-greedy route using OSRM travel times. If OSRM is unavailable, it falls back to Haversine-based nearest neighbor.
