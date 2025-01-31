import { Request, Response, NextFunction, RequestHandler } from 'express';
import { createProject, getProjectList, updateProject, deleteProject, getProjectById } from '../services/project.service';
import { IUser } from '../types/user.types';
import { Project } from '../models';


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
export const getProjectByIdController: RequestHandler = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId)
      .populate('department', 'name')
      .populate('members', 'name email')
      .populate('author', 'name email');

    if (!project) {
      res.status(404).json({
        success: false,
        message: '프로젝트를 찾을 수 없습니다.'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: '프로젝트 상세 조회 성공',
      data: { project }
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
export const updateProjectController: RequestHandler = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const updateData = req.body;
    const result = await updateProject(projectId, updateData);
    
    res.status(200).json({
      success: true,
      message: '프로젝트가 수정되었습니다.',
      data: { project: result }
    });
  } catch (error) {
    next(error);
  }
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