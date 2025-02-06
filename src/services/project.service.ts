import { Project, Department } from "../models";
import mongoose, { Types } from 'mongoose';
import notificationService from './notification.service';

// 프로젝트 생성
export const createProject = async (projectData: any) => {
  try {
    // department 처리
    if (projectData.department === 'other') {
      const otherDepartment = await Department.findOne({ name: 'other' });
      if (!otherDepartment) {
        throw new Error('기본 부서를 찾을 수 없습니다.');
      }
      projectData.department = otherDepartment._id;
    } else if (!mongoose.Types.ObjectId.isValid(projectData.department)) {
      throw new Error('유효하지 않은 부서 ID입니다.');
    }

    // members가 없으면 빈 배열로 초기화
    if (!projectData.members) {
      projectData.members = [];
    }

    // author 확인
    if (!projectData.author) {
      throw new Error('작성자 정보가 필요합니다.');
    }

    const project = await Project.create(projectData);
    
    // 알림 생성
    await notificationService.createProjectNotification(project);
    
    return project;
  } catch (error) {
    console.error('프로젝트 생성 에러:', error);
    throw error;
  }
};

// 프로젝트 수정
export const updateProject = async (id: string, updateData: any) => {
  // author 필드는 수정 불가능하도록
  delete updateData.author;

  const project = await Project.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  )
    .populate('department', 'name')
    .populate('members', 'name')
    .populate('author', 'name');

  if (!project) {
    throw new Error('프로젝트를 찾을 수 없습니다.');
  }
  return project;
};

// 프로젝트 삭제
export const deleteProject = async (id: string) => {
  try {
    const project = await Project.findById(id);
    if (!project) {
      throw new Error('프로젝트를 찾을 수 없습니다.');
    }

    // 프로젝트 삭제 전에 알림 생성
    await notificationService.createProjectCancelNotification(project);

    // 프로젝트 삭제
    await Project.findByIdAndDelete(id);
    
    return true;
  } catch (error) {
    console.error('프로젝트 삭제 에러:', error);
    throw error;
  }
};

// 프로젝트 상세 조회
export const getProjectById = async (id: string) => {
  const project = await Project.findById(id)
    .populate('department', 'name')
    .populate('members', 'name email')
    .populate('author', 'name email')
    .lean();
  
  if (!project) {
    throw new Error('프로젝트를 찾을 수 없습니다.');
  }
  return project;
};

export class ProjectService {
  // 부서와 사용자 ID로 프로젝트 필터링
  async getProjectsByDepartmentAndUser(departmentId: string, userId: string) {
    try {
      // departmentId와 userId 유효성 검사
      if (!Types.ObjectId.isValid(departmentId) || !Types.ObjectId.isValid(userId)) {
        return {
          success: false,
          message: '유효하지 않은 ID입니다.',
          status: 400
        };
      }

      const projects = await Project.find({
        department: departmentId,
        members: userId
      })
        .select('_id title')  // 프로젝트 ID와 제목만 선택
        .lean();  // 성능 최적화를 위해 일반 객체로 변환

      return {
        success: true,
        message: '프로젝트 조회 성공',
        data: { projects }
      };
    } catch (error) {
      console.error('Project lookup error:', error);
      throw new Error('프로젝트 조회 중 오류가 발생했습니다.');
    }
  }

  async getProjectList(userId: string, userRole: string) {
    try {
      let query = {};
      
      if (userRole === 'admin') {
        query = {};
      } else if (userRole === 'manager') {
        query = { author: userId };
      } else if (userRole === 'user') {
        query = { members: userId };
      }

      const projects = await Project.find(query)
        .populate('department', 'name')
        .populate('members', 'name email')
        .populate('author', 'name email')
        .sort({ createdAt: -1 });

      return {
        success: true,
        message: '프로젝트 목록 조회 성공',
        data: projects
      };
    } catch (error) {
      console.error('Project list error:', error);
      throw new Error('프로젝트 목록 조회 중 오류가 발생했습니다.');
    }
  }
}

export const projectService = new ProjectService();