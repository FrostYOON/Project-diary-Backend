import { Request, Response, NextFunction, RequestHandler } from "express";
import { taskService } from "../services/task.service";
import { ITask } from "../types/task.types";

// 전체 업무 조회
export const getTaskController: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({
        success: false,
        message: '로그인이 필요합니다.'
      });
      return;
    }
    const result = await taskService.getAllTasks(req.user._id.toString());
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// 업무 생성
export const createTaskController: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user?._id) {
      res.status(401).json({
        success: false,
        message: '로그인이 필요합니다.'
      });
      return;
    }

    // author 필드 추가
    const taskData = {
      ...req.body,
      author: req.user._id
    };

    const result = await taskService.createTask(taskData);
    res.status(201).json(result);
  } catch (error) {
    console.error('Task creation error:', error);
    next(error);
  }
};

// 특정 업무 조회
export const getTaskByIdController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await taskService.getTaskById(req.params.id);
    if (result.status) {
      res.status(result.status).json(result);
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// 업무 수정
export const updateTaskController: RequestHandler = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const updateData = req.body;

    if (!taskId) {
      res.status(400).json({
        success: false,
        message: '업무 ID가 필요합니다.'
      });
      return;
    }

    // 빈 객체 체크 수정
    if (!updateData) {
      res.status(400).json({
        success: false,
        message: '수정할 데이터가 없습니다.',
        debug: {
          body: req.body,
          contentType: req.headers['content-type']
        }
      });
      return;
    }

    const result = await taskService.updateTask(taskId, updateData);
    
    res.json(result);
  } catch (error) {
    console.error('Update task error:', error);
    next(error);
  }
};

// 업무 삭제
export const deleteTaskController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await taskService.deleteTask(req.params.id);
    if (result.status) {
      res.status(result.status).json(result);
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};