import { Request, Response, NextFunction } from 'express';
import { User } from '../models';

export const selectUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.find().select('-password -social_id');
    res.status(200).json({
      success: true,
      message: '사용자 목록 조회 성공',
      data: { users }
    });
  } catch (error) {
    next(error);
  }
};