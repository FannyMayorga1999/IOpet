import { Request, Response } from 'express';
import * as http from 'http';
import { asyncWrapper } from '../middlewares/asyncWrapper';
import { sendSuccess, sendCreated, sendError } from '../utils/response';
import { logger } from '../utils/logger';
import { PetService } from '../services/pet.service';
import { FeedingScheduleService } from '../services/feedingSchedule.service';
import { getRealtimeDatabase } from '../configs/firebase';

const petService = new PetService();
const feedingScheduleService = new FeedingScheduleService();
function getESP32IP(): string {
  return process.env.ESP32_IP || '192.168.4.1';
}

function esp32Get(path: string): Promise<{ ok: boolean; data?: string }> {
  return new Promise((resolve) => {
    console.log(`Attempting to reach ESP32 at http://${getESP32IP()}${path}...`);
    const req = http.get(`http://${getESP32IP()}${path}`, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        resolve({ ok: res.statusCode === 200, data: body });
      });
    });
    req.on('error', () => resolve({ ok: false }));
    req.setTimeout(5000, () => { req.destroy(); resolve({ ok: false }); });
  });
}

function esp32GetLong(path: string): Promise<{ ok: boolean; data?: string }> {
  return new Promise((resolve) => {
    const req = http.get(`http://${getESP32IP()}${path}`, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        resolve({ ok: res.statusCode === 200, data: body });
      });
    });
    req.on('error', () => resolve({ ok: false }));
    req.setTimeout(15000, () => { req.destroy(); resolve({ ok: false }); });
  });
}

export const getFeederStatus = asyncWrapper(async (_req: Request, res: Response) => {
  const result = await esp32Get('/status');
  sendSuccess(res, {
    online: result.ok,
    ip: getESP32IP(),
    lastCheck: new Date().toISOString(),
    ...(result.ok ? { message: 'ESP32 reachable' } : { message: 'ESP32 not reachable' }),
  });
});

export const feedNow = asyncWrapper(async (req: Request, res: Response) => {
  const { petId, portionSize, foodType } = req.body;

  if (!petId) {
    sendError(res, 400, 'VALIDATION_ERROR', 'petId is required');
    return;
  }

  let pet;
  try {
    pet = await petService.findById(petId);
  } catch {
    sendError(res, 404, 'PET_NOT_FOUND', `Pet with id ${petId} not found`);
    return;
  }

  const espResult = await esp32GetLong('/llenar');
  if (!espResult.ok) {
    logger.error('ESP32 not reachable for feeding', { ip: getESP32IP(), petId });
    sendError(res, 502, 'ESP32_UNREACHABLE', 'Could not reach the ESP32 feeder');
    return;
  }

  const schedule = await feedingScheduleService.create({
    petId,
    portionSize: portionSize || '100g',
    foodType: foodType || 'Croquetas',
    scheduledTime: new Date().toISOString(),
    distributionType: 'manual',
  });

  await feedingScheduleService.update(schedule.id!, {
    status: 'completed',
    completedTime: new Date().toISOString(),
  });

  logger.info(`Manual feeding completed`, { petId: pet.id, name: pet.name });
  sendCreated(res, { pet: { id: pet.id, name: pet.name }, feedingId: schedule.id }, 'Comida servida correctamente');
});

export const scheduleFeeding = asyncWrapper(async (req: Request, res: Response) => {
  const { petId, portionSize, foodType, scheduledTime } = req.body;

  if (!petId || !scheduledTime) {
    sendError(res, 400, 'VALIDATION_ERROR', 'petId and scheduledTime are required');
    return;
  }

  let pet;
  try {
    pet = await petService.findById(petId);
  } catch {
    sendError(res, 404, 'PET_NOT_FOUND', `Pet with id ${petId} not found`);
    return;
  }

  const schedule = await feedingScheduleService.create({
    petId,
    portionSize: portionSize || '100g',
    foodType: foodType || 'Croquetas',
    scheduledTime,
    distributionType: 'programmed',
  });

  try {
    const rtdb = getRealtimeDatabase();
    await rtdb.ref('horarios').push({ hora: scheduledTime });
    logger.info(`Schedule written to RTDB`, { petId, scheduledTime });
  } catch (err) {
    logger.error('Failed to write to RTDB', err);
  }

  logger.info(`Feeding scheduled`, { petId: pet.id, name: pet.name, scheduledTime });
  sendCreated(res, { pet: { id: pet.id, name: pet.name }, feedingId: schedule.id, scheduledTime }, 'Horario programado correctamente');
});

export const getSchedules = asyncWrapper(async (_req: Request, res: Response) => {
  const allSchedules = await feedingScheduleService.findAll();
  const programmed = allSchedules.filter((s) => s.distributionType === 'programmed' && s.status === 'pending');

  const petIds = [...new Set(programmed.map((s) => s.petId))];
  const petsMap = new Map<string, { name: string; species: string }>();

  for (const id of petIds) {
    try {
      const pet = await petService.findById(id);
      petsMap.set(id, { name: pet.name, species: pet.species });
    } catch {
      petsMap.set(id, { name: 'Unknown', species: 'other' });
    }
  }

  const enriched = programmed.map((s) => ({
    ...s,
    petName: petsMap.get(s.petId)?.name || 'Unknown',
    petSpecies: petsMap.get(s.petId)?.species || 'other',
  }));

  sendSuccess(res, enriched);
});

export const getFeedingHistory = asyncWrapper(async (_req: Request, res: Response) => {
  const schedules = await feedingScheduleService.findAll();

  const petIds = [...new Set(schedules.map((s) => s.petId))];
  const petsMap = new Map<string, { name: string; species: string }>();

  for (const id of petIds) {
    try {
      const pet = await petService.findById(id);
      petsMap.set(id, { name: pet.name, species: pet.species });
    } catch {
      petsMap.set(id, { name: 'Unknown', species: 'other' });
    }
  }

  const enriched = schedules.slice(0, 20).map((s) => ({
    ...s,
    petName: petsMap.get(s.petId)?.name || 'Unknown',
    petSpecies: petsMap.get(s.petId)?.species || 'other',
  }));

  sendSuccess(res, enriched);
});

export const completeSchedule = asyncWrapper(async (req: Request, res: Response) => {
  const { scheduleId } = req.body;

  if (!scheduleId) {
    sendError(res, 400, 'VALIDATION_ERROR', 'scheduleId is required');
    return;
  }

  const schedule = await feedingScheduleService.update(scheduleId, {
    status: 'completed',
    completedTime: new Date().toISOString(),
  });

  logger.info(`Schedule completed via ESP32`, { scheduleId, petId: schedule.petId });
  sendSuccess(res, { scheduleId, status: 'completed' }, 'Schedule marked as completed');
});
