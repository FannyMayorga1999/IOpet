import { Router } from 'express';
import {
  getPets,
  getPetById,
  getPetsByOwner,
  createPet,
  updatePet,
  deletePet,
} from '../controllers/pet.controller';
import { validateBody } from '../middlewares/validation';

const router = Router();

router.get('/', getPets);
router.get('/:id', getPetById);
router.get('/owner/:ownerId', getPetsByOwner);
router.post('/', validateBody({ name: 'string', species: 'string', ownerId: 'string' }), createPet);
router.patch('/:id', updatePet);
router.delete('/:id', deletePet);

export default router;
