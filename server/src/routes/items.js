import { Router } from 'express';
import { addItem, updateItem, deleteItem, reorderItems } from '../controllers/itemController.js';

const r = Router();
r.post('/:tripId', addItem);
r.patch('/:itemId', updateItem);
r.delete('/:itemId', deleteItem);
r.post('/:tripId/reorder', reorderItems);

export default r;
