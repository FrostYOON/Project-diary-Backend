import { Request, Response, NextFunction, RequestHandler } from 'express';
import { createProject, getProjectList, updateProject, deleteProject, getProjectById, projectService } from '../services/project.service';
import { Project } from '../models';
import { IUser } from '../types/user.types';

export interface ApiResponse {
  success: boolean;
  message: string;
  status?: number;
  data?: any;
}

// 공통 응답 처리 함수
const sendResponse = (res: Response, status: number, success: boolean, message: string, data?: any) => {
  res.status(status).json({
    success,
    message,
    ...(data && { data })
  });
};

// 프로젝트 목록 조회
export const getProjectListController: RequestHandler = async (req, res, next) => {
  try {
    const projects = await getProjectList();
    sendResponse(res, 200, true, '프로젝트 목록이 조회되었습니다.', { projects });
  } catch (error) {
    next(error);
  }
};

// 프로젝트 상세 조회
export const getProjectByIdController: RequestHandler = async (req, res, next) => {
  try {
    const project = await getProjectById(req.params.id);
    sendResponse(res, 200, true, '프로젝트 상세 조회 성공', { project });
  } catch (error) {
    next(error);
  }
};

// 프로젝트 생성
export const createProjectController: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      return sendResponse(res, 401, false, '인증이 필요합니다.');
    }

    const projectData = {
      ...req.body,
      author: (req.user as IUser)._id
    };
    
    const newProject = await createProject(projectData);
    sendResponse(res, 201, true, '프로젝트가 생성되었습니다.', { project: newProject });
  } catch (error) {
    next(error);
  }
};

// 프로젝트 수정
export const updateProjectController: RequestHandler = async (req, res, next) => {
  try {
    const updatedProject = await updateProject(req.params.id, req.body);
    sendResponse(res, 200, true, '프로젝트가 수정되었습니다.', { project: updatedProject });
  } catch (error) {
    next(error);
  }
};

// 프로젝트 삭제
export const deleteProjectController: RequestHandler = async (req, res, next) => {
  try {
    await deleteProject(req.params.id);
    sendResponse(res, 200, true, '프로젝트가 삭제되었습니다.');
  } catch (error) {
    next(error);
  }
};

export const getProjectsByDepartmentAndUserController: RequestHandler = async (req, res, next) => {
  try {
    const { departmentId, userId } = req.query;
    const result = await projectService.getProjectsByDepartmentAndUser(
      departmentId as string,
      userId as string
    ) as ApiResponse;

    if (result.status) {
      res.status(result.status).json(result);
      return;
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};