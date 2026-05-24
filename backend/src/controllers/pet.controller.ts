import { Request, Response } from 'express';
import { PetService } from '../services/pet.service';
import { asyncWrapper } from '../middlewares/asyncWrapper';
import { sendSuccess, sendCreated, sendNotFound } from '../utils/response';
import { logger } from '../utils/logger';

const petService = new PetService();

export const getPets = asyncWrapper(async (_req: Request, res: Response) => {
  const pets = await petService.findAll();
  sendSuccess(res, pets);
});

export const getPetById = asyncWrapper(async (req: Request, res: Response) => {
  const pet = await petService.findById(req.params.id);
  sendSuccess(res, pet);
});

export const getPetsByOwner = asyncWrapper(async (req: Request, res: Response) => {
  const pets = await petService.findByOwner(req.params.ownerId);
  sendSuccess(res, pets);
});

export const createPet = asyncWrapper(async (req: Request, res: Response) => {
  const pet = await petService.create(req.body);
  logger.info(`Pet created: ${pet.id}`);
  sendCreated(res, pet, 'Pet created successfully');
});

export const updatePet = asyncWrapper(async (req: Request, res: Response) => {
  const pet = await petService.update(req.params.id, req.body);
  sendSuccess(res, pet, 'Pet updated successfully');
});

export const deletePet = asyncWrapper(async (req: Request, res: Response) => {
  await petService.delete(req.params.id);
  logger.info(`Pet deleted: ${req.params.id}`);
  sendSuccess(res, null, 'Pet deleted successfully');
});
