import { Request, Response, NextFunction, RequestHandler } from 'express';
import { createProject, getProjectList, updateProject, deleteProject, getProjectById } from '../services/project.service';
import { IUser } from '../types/user.types';


interface AuthenticatedRequest extends Request {
    user: IUser;
  }

// 프로젝트 목록 조회
export const getProjectListController = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const projects = await getProjectList();
    res.status(200).json({
      success: true,
      message: '프로젝트 목록이 조회되었습니다.',
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

// 프로젝트 상세 조회
export const getProjectByIdController = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const projectId = req.params.id;
    const project = await getProjectById(projectId);
    res.status(200).json({
      success: true,
      message: '프로젝트 상세가 조회되었습니다.',
      data: project
    });
  } catch (error) {
    next(error);
  }
};

interface AuthenticatedRequest extends Request {
  user: IUser;
}

// 프로젝트 생성
export const createProjectController: RequestHandler<{}, any, any, any, { user: IUser }> = async (
  req,
  res,
  next
) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: '인증이 필요합니다.'
      });
      return;
    }

    const projectData = {
      ...req.body,
      author: req.user._id
    };
    const newProject = await createProject(projectData);
    res.status(201).json({
      success: true,
      message: '프로젝트가 생성되었습니다.',
      data: newProject
    });
  } catch (error) {
    next(error);
  }
};

// 프로젝트 수정
export const updateProjectController = async (req: Request, res: Response) => {
    const projectId = req.params.id;
    const project = req.body;
    const updatedProject = await updateProject(projectId, project);
    res.status(200).json({
      success: true,
      message: '프로젝트가 수정되었습니다.',
      data: updatedProject
    });
};

// 프로젝트 삭제
export const deleteProjectController = async (req: Request, res: Response) => {
    const projectId = req.params.id;
    await deleteProject(projectId);
    res.status(204).json({
      success: true,
      message: '프로젝트가 삭제되었습니다.'
    });
};