import { Router } from 'express';
import trips from './trips.js';
import items from './items.js';
import optimize from './optimize.js';

const router = Router();

router.use((req, res, next) => {
  // expose io on req for controllers to emit
  req.io = req.app.get('io');
  next();
});

router.use('/trips', trips);
router.use('/items', items);
router.use('/optimize', optimize);

export default router;
