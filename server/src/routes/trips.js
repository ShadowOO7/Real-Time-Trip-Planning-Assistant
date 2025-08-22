import { Router } from 'express';
import { createTrip, joinTrip, getTrip } from '../controllers/tripController.js';

const r = Router();
r.post('/', createTrip);
r.post('/join', joinTrip);
r.get('/:tripId', getTrip);

export default r;
