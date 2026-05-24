import { Request, Response, NextFunction, RequestHandler } from 'express';
import { sendError } from '../utils/response';

type ValidationSchema = Record<string, 'string' | 'number' | 'boolean'>;

export function validateBody(schema: ValidationSchema): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];

    for (const [field, type] of Object.entries(schema)) {
      const value = req.body[field];
      if (value === undefined || value === null) {
        errors.push(`Missing required field: ${field}`);
        continue;
      }
      if (typeof value !== type) {
        errors.push(`Field "${field}" must be of type ${type}`);
      }
    }

    if (errors.length > 0) {
      sendError(res, 400, 'VALIDATION_ERROR', errors.join('; '));
      return;
    }

    next();
  };
}
