import { Router } from 'express';
import petRoutes from './pet.routes';
import feedingScheduleRoutes from './feedingSchedule.routes';

const router = Router();

router.use('/pets', petRoutes);
router.use('/feeding-schedules', feedingScheduleRoutes);

export default router;
