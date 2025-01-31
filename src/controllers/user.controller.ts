import { Request, Response, NextFunction, RequestHandler } from 'express';
import { User } from '../models';
import { userService } from '../services/user.service';

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

export const getUserDepartmentController: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: '로그인이 필요합니다.'
      });
      return;
    }

    const result = await userService.getUserDepartment(req.user._id.toString());
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createUserController: RequestHandler = async (req, res, next) => {
  try {
    const result = await userService.createUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAllUsersController: RequestHandler = async (req, res, next) => {
  try {
    const result = await userService.getAllUsers();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getUserByIdController: RequestHandler = async (req, res, next) => {
  try {
    const result = await userService.getUserById(req.params.id);
    if (result.status) {
      res.status(result.status).json(result);
      return;
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateUserController: RequestHandler = async (req, res, next) => {
  try {
    const result = await userService.updateUser(req.params.id, req.body);
    if (result.status) {
      res.status(result.status).json(result);
      return;
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteUserController: RequestHandler = async (req, res, next) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    if (result.status) {
      res.status(result.status).json(result);
      return;
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};