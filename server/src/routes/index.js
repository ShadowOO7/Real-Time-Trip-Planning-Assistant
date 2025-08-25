import { Router } from 'express';
import trips from './trips.js';
import items from './items.js';
import optimize from './optimize.js';
import auth from './auth.js';
import suggest from './suggest.js';
import chat from './chat.js';

const router = Router();

router.use((req, res, next) => {
  req.io = req.app.get('io');
  next();
});

router.use('/auth', auth);
router.use('/trips', trips);
router.use('/items', items);
router.use('/optimize', optimize);
router.use('/suggest', suggest);
router.use('/chat', chat);

export default router;
