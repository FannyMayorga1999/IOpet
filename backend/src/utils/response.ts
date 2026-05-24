import { Response } from 'express';

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200
): void {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
}

export function sendCreated<T>(res: Response, data: T, message?: string): void {
  sendSuccess(res, data, message, 201);
}

export function sendError(
  res: Response,
  statusCode: number,
  error: string,
  message?: string
): void {
  const response: ApiResponse = {
    success: false,
    error,
    message,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
}

export function sendNotFound(res: Response, resource = 'Resource'): void {
  sendError(res, 404, 'NOT_FOUND', `${resource} not found`);
}
