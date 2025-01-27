import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { DEPARTMENTS } from '../types/department.types';

export const validateDepartmentId = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({
      success: false,
      message: '유효하지 않은 부서 ID입니다.'
    });
    return;
  }
  
  next();
};

export const validateDepartmentData = (req: Request, res: Response, next: NextFunction): void => {
  const { name } = req.body;

  // name이 필수값인지 확인
  if (!name) {
    res.status(400).json({
      success: false,
      message: '부서명은 필수 항목입니다.'
    });
    return;
  }

  // name이 허용된 값인지 확인
  if (!DEPARTMENTS.includes(name)) {
    res.status(400).json({
      success: false,
      message: '유효하지 않은 부서명입니다.',
      data: {
        allowedDepartments: DEPARTMENTS
      }
    });
    return;
  }

  next();
}; 