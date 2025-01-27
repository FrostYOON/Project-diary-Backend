import { Request, Response, NextFunction } from "express";
import { taskService } from "../services/task.service";
import { ITask } from "../types/task.types";

// 전체 업무 조회
export const getTaskController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await taskService.getAllTasks();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// 업무 생성
export const createTaskController = async (
  req: Request<{}, {}, ITask>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await taskService.createTask(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

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
export const updateTaskController = async (
  req: Request<{ id: string }, {}, ITask>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await taskService.updateTask(req.params.id, req.body);
    if (result.status) {
      res.status(result.status).json(result);
      return;
    }
    res.status(200).json(result);
  } catch (error) {
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