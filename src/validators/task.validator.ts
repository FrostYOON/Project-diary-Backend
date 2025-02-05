import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { TASK_STATUS, TASK_TAGS, TASK_PRIORITY } from '../types/task.types';

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
  const { title, description, startDate, endDate, status, priority, tag, projectId } = req.body;

  // 각 필드별 유효성 검사 결과 로깅
  const validationResults = {
    title: !!title,
    description: !!description,
    startDate: !!startDate,
    endDate: !!endDate,
    status: status && TASK_STATUS.includes(status),
    priority: priority && TASK_PRIORITY.includes(priority),
    tag: tag && TASK_TAGS.includes(tag),
    projectId: !!projectId
  };

  const errors = [];

  if (!title) errors.push('제목은 필수 항목입니다.');
  if (!description) errors.push('설명은 필수 항목입니다.');
  if (!projectId) errors.push('프로젝트 ID는 필수 항목입니다.');
  if (!startDate) errors.push('시작일은 필수 항목입니다.');
  if (!endDate) errors.push('종료일은 필수 항목입니다.');
  if (!status || !TASK_STATUS.includes(status)) errors.push(`상태는 ${TASK_STATUS.join(', ')} 중 하나여야 합니다.`);
  if (!priority || !TASK_PRIORITY.includes(priority)) errors.push(`우선순위는 ${TASK_PRIORITY.join(', ')} 중 하나여야 합니다.`);
  if (!tag || !TASK_TAGS.includes(tag)) errors.push(`태그는 ${TASK_TAGS.join(', ')} 중 하나여야 합니다.`);

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: '입력값이 유효하지 않습니다.',
      errors: errors
    });
    return;
  }

  next();
};