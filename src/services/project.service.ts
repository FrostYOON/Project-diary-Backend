import { Project } from '../models';
import { IProject } from '../types/project.types';

// 프로젝트 목록 조회
export const getProjectList = async () => {
    const projects = await Project.find();
    return projects;
};

// 프로젝트 생성
export const createProject = async (project: IProject) => {
    const newProject = await Project.create(project);
    return newProject;
};

// 프로젝트 수정
export const updateProject = async (projectId: string, project: IProject) => {
    const updatedProject = await Project.findByIdAndUpdate(projectId, project, { new: true });
    return updatedProject;
};

// 프로젝트 삭제
export const deleteProject = async (projectId: string) => {
    await Project.findByIdAndDelete(projectId);
};