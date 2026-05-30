import { Router } from 'express';
import path from 'path';
import petRoutes from './pet.routes';
import feedingScheduleRoutes from './feedingSchedule.routes';
import feederRoutes from './feeder.routes';

const router = Router();

router.use('/pets', petRoutes);
router.use('/feeding-schedules', feedingScheduleRoutes);
router.use('/feeder', feederRoutes);

router.get('/feeder-panel', (_req, res) => {
  res.sendFile(path.resolve(__dirname, '../../public/feeder.html'));
});

export default router;
