import { Request, Response, NextFunction } from "express";
import { departmentService } from "../services/department.service";
import { IDepartment } from "../types/department.types";

// 전체 부서 조회
export const getDepartmentController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await departmentService.getAllDepartments();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// 부서 생성
export const createDepartmentController = async (
  req: Request<{}, {}, IDepartment>, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const result = await departmentService.createDepartment(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// 특정 부서 조회
export const getDepartmentByIdController = async (
  req: Request<{ id: string }>, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const result = await departmentService.getDepartmentById(req.params.id);
    if (result.status) {
      res.status(result.status).json(result);
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// 부서 정보 수정
export const updateDepartmentController = async (
  req: Request<{ id: string }, {}, IDepartment>, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const result = await departmentService.updateDepartment(req.params.id, req.body);
    if (result.status) {
      res.status(result.status).json(result);
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// 부서 삭제
export const deleteDepartmentController = async (
  req: Request<{ id: string }>, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const result = await departmentService.deleteDepartment(req.params.id);
    if (result.status) {
      res.status(result.status).json(result);
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};