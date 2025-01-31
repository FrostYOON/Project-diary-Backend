import { Request, Response, NextFunction } from 'express';
import { User } from '../models';
import { userService } from '../services/user.service';

export const getUserListController = async (
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

export const getUsersByDepartmentController = async (req: Request, res: Response) => {
  try {
    const { departmentId } = req.params;
    const response = await userService.getUsersByDepartment(departmentId);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '부서별 사용자 목록 조회 중 오류가 발생했습니다.'
    });
  }
};