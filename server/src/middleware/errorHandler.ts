import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  
  // Log error (in production, use proper logging service)
  console.error(`[${new Date().toISOString()}] ${statusCode} - ${message}`);
  console.error('Stack:', error.stack);
  
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const response: any = {
    error: message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  };
  
  if (isDevelopment) {
    response.stack = error.stack;
  }
  
  res.status(statusCode).json(response);
};

export const createError = (message: string, statusCode: number = 500): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};