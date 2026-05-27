import { Request, Response } from 'express';
import { FeedingScheduleService } from '../services/feedingSchedule.service';
import { asyncWrapper } from '../middlewares/asyncWrapper';
import { sendSuccess, sendCreated } from '../utils/response';
import { logger } from '../utils/logger';

const feedingScheduleService = new FeedingScheduleService();

export const getSchedules = asyncWrapper(async (_req: Request, res: Response) => {
  const schedules = await feedingScheduleService.findAll();
  sendSuccess(res, schedules);
});

export const getScheduleById = asyncWrapper(async (req: Request, res: Response) => {
  const schedule = await feedingScheduleService.findById(req.params.id);
  sendSuccess(res, schedule);
});

export const getSchedulesByPet = asyncWrapper(async (req: Request, res: Response) => {
  const schedules = await feedingScheduleService.findByPet(req.params.petId);
  sendSuccess(res, schedules);
});

export const getSchedulesByType = asyncWrapper(async (req: Request, res: Response) => {
  const schedules = await feedingScheduleService.findByDistributionType(req.params.type as 'manual' | 'programmed');
  sendSuccess(res, schedules);
});

export const createSchedule = asyncWrapper(async (req: Request, res: Response) => {
  const schedule = await feedingScheduleService.create(req.body);
  logger.info(`Feeding schedule created: ${schedule.id}`);
  sendCreated(res, schedule, 'Feeding schedule created successfully');
});

export const updateSchedule = asyncWrapper(async (req: Request, res: Response) => {
  const schedule = await feedingScheduleService.update(req.params.id, req.body);
  sendSuccess(res, schedule, 'Feeding schedule updated successfully');
});

export const deleteSchedule = asyncWrapper(async (req: Request, res: Response) => {
  await feedingScheduleService.delete(req.params.id);
  logger.info(`Feeding schedule deleted: ${req.params.id}`);
  sendSuccess(res, null, 'Feeding schedule deleted successfully');
});
