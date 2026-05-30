import { Router } from 'express';
import {
  getFeederStatus,
  feedNow,
  scheduleFeeding,
  getFeedingHistory,
  getSchedules,
  completeSchedule,
} from '../controllers/feeder.controller';
import { validateBody } from '../middlewares/validation';

const router = Router();

router.get('/status', getFeederStatus);
router.get('/schedules', getSchedules);
router.post('/feed-now', validateBody({ petId: 'string' }), feedNow);
router.post('/schedule', validateBody({ petId: 'string', scheduledTime: 'string' }), scheduleFeeding);
router.get('/history', getFeedingHistory);
router.post('/complete-schedule', validateBody({ scheduleId: 'string' }), completeSchedule);

export default router;
