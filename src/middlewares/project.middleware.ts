import { Request, Response, NextFunction, RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { Project } from '../models';
import { IUser } from '../types/user.types';
import { User } from '../models';

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

export const validateProject = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};


// 프로젝트 존재 유무
export const checkProjectExists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const projectId = req.params.projectId;
    const project = await Project.findById(projectId);
    if (!project) {
        res.status(404).json({ message: '프로젝트를 찾을 수 없습니다.' });
        return;
    }
    next();
};

// 프로젝트 생성, 수정, 삭제 시 manager, admin 권한 확인
export const checkProjectPermission: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      return;
    }

    if (user.role !== 'admin' && user.role !== 'manager') {
      res.status(403).json({ message: '프로젝트 생성 권한이 없습니다.' });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: '권한 확인 중 오류가 발생했습니다.' });
  }
};



