import { Request, Response, NextFunction } from 'express';
import { Task } from '../models';
import { IUser } from '../types/user.types';
export const taskCheck = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user as IUser;
    if (user) {
      if (!user) {
        res.status(401).json({
          success: false,
          message: '로그인이 필요합니다.'
        });
        return;
      }
    }

    const taskId = req.params.id;
    if (taskId) {
      const task = await Task.findById(taskId);
      if (!task) {
        res.status(404).json({
          success: false,
          message: '존재하지 않는 업무입니다.'
        });
        return;
      }

      // 자신이 생성한 태스크만 접근 가능
      if (task.author.toString() !== user._id.toString()) {
        res.status(403).json({
          success: false,
          message: '권한이 없습니다.'
        });
        return;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};