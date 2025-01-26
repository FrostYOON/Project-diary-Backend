import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../types/error';

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: '서버 오류가 발생했습니다.'
  });
}; 