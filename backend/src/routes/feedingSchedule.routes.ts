import { Router } from 'express';
import {
  getSchedules,
  getScheduleById,
  getSchedulesByPet,
  getSchedulesByType,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from '../controllers/feedingSchedule.controller';
import { validateBody } from '../middlewares/validation';

const router = Router();

router.get('/', getSchedules);
router.get('/pet/:petId', getSchedulesByPet);
router.get('/type/:type', getSchedulesByType);
router.get('/:id', getScheduleById);
router.post(
  '/',
  validateBody({ petId: 'string', portionSize: 'string', foodType: 'string', scheduledTime: 'string', distributionType: 'string' }),
  createSchedule
);
router.patch('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);

export default router;
