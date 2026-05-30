import { Router } from 'express';
import {
  getAllFood,
  getFoodById,
  getFoodBySpecies,
  createFood,
  updateFood,
  deleteFood,
} from '../controllers/foodCatalog.controller';
import { validateBody } from '../middlewares/validation';

const router = Router();

router.get('/', getAllFood);
router.get('/species/:species', getFoodBySpecies);
router.get('/:id', getFoodById);
router.post('/', validateBody({ name: 'string', category: 'string' }), createFood);
router.patch('/:id', updateFood);
router.delete('/:id', deleteFood);

export default router;
