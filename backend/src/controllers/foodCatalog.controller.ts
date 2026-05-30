import { Request, Response } from 'express';
import { FoodCatalogService } from '../services/foodCatalog.service';
import { asyncWrapper } from '../middlewares/asyncWrapper';
import { sendSuccess, sendCreated } from '../utils/response';
import { logger } from '../utils/logger';

const foodCatalogService = new FoodCatalogService();

export const getAllFood = asyncWrapper(async (_req: Request, res: Response) => {
  const food = await foodCatalogService.findActive();
  sendSuccess(res, food);
});

export const getFoodById = asyncWrapper(async (req: Request, res: Response) => {
  const food = await foodCatalogService.findById(req.params.id);
  sendSuccess(res, food);
});

export const getFoodBySpecies = asyncWrapper(async (req: Request, res: Response) => {
  const food = await foodCatalogService.findBySpecies(req.params.species);
  sendSuccess(res, food);
});

export const createFood = asyncWrapper(async (req: Request, res: Response) => {
  const food = await foodCatalogService.create(req.body);
  logger.info(`Food created: ${food.id}`);
  sendCreated(res, food, 'Food created successfully');
});

export const updateFood = asyncWrapper(async (req: Request, res: Response) => {
  const food = await foodCatalogService.update(req.params.id, req.body);
  sendSuccess(res, food, 'Food updated successfully');
});

export const deleteFood = asyncWrapper(async (req: Request, res: Response) => {
  await foodCatalogService.delete(req.params.id);
  logger.info(`Food deleted: ${req.params.id}`);
  sendSuccess(res, null, 'Food deleted successfully');
});
