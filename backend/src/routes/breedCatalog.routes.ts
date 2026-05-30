import { Router } from 'express';
import {
  getAllBreeds,
  getBreedById,
  getBreedsBySpecies,
  createBreed,
  updateBreed,
  deleteBreed,
} from '../controllers/breedCatalog.controller';
import { validateBody } from '../middlewares/validation';

const router = Router();

router.get('/', getAllBreeds);
router.get('/species/:species', getBreedsBySpecies);
router.get('/:id', getBreedById);
router.post('/', validateBody({ name: 'string', species: 'string' }), createBreed);
router.patch('/:id', updateBreed);
router.delete('/:id', deleteBreed);

export default router;
