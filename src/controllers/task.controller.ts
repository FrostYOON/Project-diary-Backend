import { Request, Response, NextFunction, RequestHandler } from "express";
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
export const createTaskController: RequestHandler = async (req, res, next) => {
  try {
    // 요청 데이터 로깅
    console.log('Task creation request body:', req.body);
    
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
    console.log('=== Task Update Request ===');
    console.log('Headers:', req.headers);
    console.log('Params:', req.params);
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('========================');

    if (!req.user?._id) {
      res.status(401).json({
        success: false,
        message: '로그인이 필요합니다.'
      });
      return;
    }

    // 유효성 검사 결과 상세 로깅
    const { title, startDate, endDate, status, priority, tag } = req.body;
    const missingFields = [];
    
    if (!title) missingFields.push('title');
    if (!startDate) missingFields.push('startDate');
    if (!endDate) missingFields.push('endDate');
    if (!status) missingFields.push('status');
    if (!priority) missingFields.push('priority');
    if (!tag) missingFields.push('tag');

    if (missingFields.length > 0) {
      console.log('Missing fields:', missingFields);
      res.status(400).json({
        success: false,
        message: '필수 항목이 누락되었습니다.',
        missingFields: missingFields
      });
      return;
    }

    const taskData = {
      ...req.body,
      project: req.body.projectId
    };

    const result = await taskService.updateTask(req.params.id, taskData);
    res.json(result);
  } catch (error) {
    console.error('Task update error:', error);
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