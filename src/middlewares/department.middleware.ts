import { Request, Response, NextFunction } from 'express';
import { IUser } from '../types/user.types';
// 관리자만 부서 관리 가능하도록 체크
export const adminCheck = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user as IUser;
    if (user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: '관리자만 접근 가능합니다.'
      });
      return;
    }
    next();
  } catch (error) {
    next(error);
  }
}; 