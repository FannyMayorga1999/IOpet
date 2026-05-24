import { Router } from 'express';
import {
  getSchedules,
  getScheduleById,
  getSchedulesByPet,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from '../controllers/feedingSchedule.controller';
import { validateBody } from '../middlewares/validation';

const router = Router();

router.get('/', getSchedules);
router.get('/:id', getScheduleById);
router.get('/pet/:petId', getSchedulesByPet);
router.post(
  '/',
  validateBody({ petId: 'string', portionSize: 'string', foodType: 'string', scheduledTime: 'string' }),
  createSchedule
);
router.patch('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);

export default router;
