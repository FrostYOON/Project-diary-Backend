import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

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

  if (req.method === 'POST') {
    // 필수 필드 존재 여부 확인
    if (!name) {
      res.status(400).json({
        success: false,
        message: '부서명은 필수 항목입니다.'
      });
      return;
    }

    // 부서명 형식 검증
    if (typeof name !== 'string') {
      res.status(400).json({
        success: false,
        message: '부서명은 문자열이어야 합니다.'
      });
      return;
    }

    // 부서명 길이 검증
    if (name.length < 2 || name.length > 20) {
      res.status(400).json({
        success: false,
        message: '부서명은 2~20자 사이여야 합니다.'
      });
      return;
    }

    // 부서명 형식 검증 (특수문자 제한 등)
    const nameRegex = /^[가-힣a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
      res.status(400).json({
        success: false,
        message: '부서명은 한글, 영문만 사용 가능합니다.'
      });
      return;
    }
  }
  else if (req.method === 'PUT') {
    if (!name) {
      res.status(400).json({
        success: false,
        message: '부서명은 필수 항목입니다.'
      });
      return;
    }

    if (typeof name !== 'string') {
      res.status(400).json({
        success: false,
        message: '부서명은 문자열이어야 합니다.'
      });
    }
  }

  next();
}; 