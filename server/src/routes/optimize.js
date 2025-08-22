import { Router } from 'express';
import { optimizeTrip } from '../controllers/optimizeController.js';

const r = Router();
r.post('/:tripId', optimizeTrip);

export default r;
