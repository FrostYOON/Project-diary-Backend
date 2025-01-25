import { Request, Response, NextFunction } from 'express';
import { weatherService } from '../services/weather.service';

export const getWeather = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const weather = await weatherService.getCitiesWeather();
    res.status(200).json(weather);
  } catch (error) {
    next(error);
  }
}