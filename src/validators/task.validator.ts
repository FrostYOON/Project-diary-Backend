import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { TASK_STATUS } from '../types/task.types';
export const validateTaskId = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({
      success: false,
      message: '유효하지 않은 업무 ID입니다.'
    });
    return;
  }

  next();
};

export const validateTaskData = (req: Request, res: Response, next: NextFunction): void => {
  const { title, startDate, endDate, status } = req.body;

  if (!title || !startDate || !endDate || !status) {
    res.status(400).json({
      success: false,
      message: '모든 필수 항목을 입력해야 합니다.'
    });
    return;
  }

  if (startDate > endDate) {
    res.status(400).json({
      success: false,
      message: '시작일은 종료일보다 이전이어야 합니다.'
    });
    return;
  }

  if (!TASK_STATUS.includes(status)) {
    res.status(400).json({
      success: false,
      message: '유효하지 않은 상태입니다.'
    });
    return;
  }

  next();
};