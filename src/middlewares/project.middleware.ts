import { Request, Response, NextFunction, RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { Project } from '../models';
import { User } from '../models';
import { IUser } from '../types/user.types';

export const validateProject = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};


// 프로젝트 존재 유무
export const checkProjectExists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404).json({ message: '프로젝트를 찾을 수 없습니다.' });
      return;
    }
    next();
  } catch (error) {
    next(error);
  }
};

// 프로젝트 생성, 수정, 삭제 시 manager, admin 권한 확인
export const checkProjectPermission: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: '로그인이 필요합니다.'
      });
      return;
    }

    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      res.status(403).json({
        success: false,
        message: '프로젝트 생성 권한이 없습니다.'
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};



