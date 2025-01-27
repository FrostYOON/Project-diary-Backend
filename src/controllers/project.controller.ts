import { Request, Response, NextFunction } from 'express';
import { createProject, getProjectList, updateProject, deleteProject } from '../services/project.service';
import { projectService } from '../services/project.service';
import { ProjectError } from '../types/error';

// 프로젝트 목록 조회
export const getProjectListController = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const projects = await projectService.getProjectList();
    res.status(200).json({
      success: true,
      message: '프로젝트 목록 조회 성공',
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

// 프로젝트 상세 조회 (추가 필요)
export const getProjectByIdController = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const projectId = req.params.id;
    const project = await projectService.getProjectById(projectId);
    res.status(200).json({
      success: true,
      message: '프로젝트 상세 조회 성공',
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// 프로젝트 생성
export const createProjectController = async (req: Request, res: Response) => {
    const project = req.body;
    const newProject = await createProject(project);
    res.status(201).json(newProject);
};

// 프로젝트 수정
export const updateProjectController = async (req: Request, res: Response) => {
    const projectId = req.params.id;
    const project = req.body;
    const updatedProject = await updateProject(projectId, project);
    res.status(200).json(updatedProject);
};

// 프로젝트 삭제
export const deleteProjectController = async (req: Request, res: Response) => {
    const projectId = req.params.id;
    await deleteProject(projectId);
    res.status(204).send();
};