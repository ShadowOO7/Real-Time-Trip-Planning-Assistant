import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import tripRoutes from "./routes/trip.js";
import routes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
  origin: (process.env.CORS_ORIGINS || '').split(',').filter(Boolean) || '*',
  credentials: true
}));
app.set('etag', false);

//Trip routes
app.use("/api/trips", tripRoutes);

// API Routes
app.use('/api', routes);

// Serve built client (no-cache for HTML to avoid stale bundles)
const clientBuildPath = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientBuildPath, {
  etag: false,
  lastModified: false,
  setHeaders: (res, p) => {
    if (p.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-store');
    } else {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));
app.get('*', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

export default app;
