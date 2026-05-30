import { Request, Response } from 'express';
import { BreedCatalogService } from '../services/breedCatalog.service';
import { asyncWrapper } from '../middlewares/asyncWrapper';
import { sendSuccess, sendCreated } from '../utils/response';
import { logger } from '../utils/logger';

const breedCatalogService = new BreedCatalogService();

export const getAllBreeds = asyncWrapper(async (_req: Request, res: Response) => {
  const breeds = await breedCatalogService.findActive();
  sendSuccess(res, breeds);
});

export const getBreedById = asyncWrapper(async (req: Request, res: Response) => {
  const breed = await breedCatalogService.findById(req.params.id);
  sendSuccess(res, breed);
});

export const getBreedsBySpecies = asyncWrapper(async (req: Request, res: Response) => {
  const breeds = await breedCatalogService.findBySpecies(req.params.species);
  sendSuccess(res, breeds);
});

export const createBreed = asyncWrapper(async (req: Request, res: Response) => {
  const breed = await breedCatalogService.create(req.body);
  logger.info(`Breed created: ${breed.id}`);
  sendCreated(res, breed, 'Breed created successfully');
});

export const updateBreed = asyncWrapper(async (req: Request, res: Response) => {
  const breed = await breedCatalogService.update(req.params.id, req.body);
  sendSuccess(res, breed, 'Breed updated successfully');
});

export const deleteBreed = asyncWrapper(async (req: Request, res: Response) => {
  await breedCatalogService.delete(req.params.id);
  logger.info(`Breed deleted: ${req.params.id}`);
  sendSuccess(res, null, 'Breed deleted successfully');
});
