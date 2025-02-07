import { Project, Department, User } from "../models";
import mongoose, { Types } from 'mongoose';
import notificationService from './notification.service';

// 프로젝트 생성
export const createProject = async (projectData: any) => {
  try {
    // department 처리
    if (projectData.department === 'other') {
      const otherDepartment = await Department.findOne({ name: 'other' });
      if (!otherDepartment) {
        return {
          success: false,
          message: '기본 부서를 찾을 수 없습니다.',
          status: 404
        };
      }
      projectData.department = otherDepartment._id;
    } else if (!mongoose.Types.ObjectId.isValid(projectData.department)) {
      return {
        success: false,
        message: '유효하지 않은 부서 ID입니다.',
        status: 400
      };
    }

    // members가 없으면 빈 배열로 초기화
    if (!projectData.members) {
      projectData.members = [];
    }

    // author 확인
    if (!projectData.author) {
      return {
        success: false,
        message: '작성자 정보가 필요합니다.',
        status: 400
      };
    }

    const project = await Project.create(projectData);

    // 프로젝트 생성자의 authoredProjects 업데이트
    await User.findByIdAndUpdate(projectData.author, {
      $push: { authoredProjects: project._id }
    });

    // 멤버들의 memberProjects 업데이트
    if (projectData.members?.length > 0) {
      await User.updateMany(
        { _id: { $in: projectData.members } },
        { $push: { memberProjects: project._id } }
      );
    }

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

  try {
    const oldProject = await Project.findById(id);
    if (!oldProject) {
      return {
        success: false,
        message: '프로젝트를 찾을 수 없습니다.',
        status: 404
      };
    }

    // 멤버 변경이 있는 경우
    if (updateData.members) {
      // 기존 멤버에서 제외된 멤버들의 memberProjects에서 제거
      const removedMembers = oldProject.members.filter(
        (m: any) => !updateData.members.includes(m.toString())
      );
      if (removedMembers.length > 0) {
        await User.updateMany(
          { _id: { $in: removedMembers } },
          { $pull: { memberProjects: id } }
        );
      }

      // 새로 추가된 멤버들의 memberProjects에 추가
      const newMembers = updateData.members.filter(
        (m: string) => !oldProject.members.map((om: any) => om.toString()).includes(m)
      );
      if (newMembers.length > 0) {
        await User.updateMany(
          { _id: { $in: newMembers } },
          { $push: { memberProjects: id } }
        );
      }
    }

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
      return {
        success: false,
        message: '프로젝트를 찾을 수 없습니다.',
        status: 404
      };
    }
    return project;
  } catch (error) {
    console.error('프로젝트 수정 에러:', error);
    throw error;
  }
};

// 프로젝트 삭제
export const deleteProject = async (id: string) => {
  try {
    const project = await Project.findById(id);
    if (!project) {
      return {
        success: false,
        message: '프로젝트를 찾을 수 없습니다.',
        status: 404
      };
    }

    await User.findByIdAndUpdate(project.author, {
      $pull: { authoredProjects: id }
    });

    await User.updateMany(
      { _id: { $in: project.members } },
      { $pull: { memberProjects: id } }
    );

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
    return {
      success: false,
      message: '프로젝트를 찾을 수 없습니다.',
      status: 404
    };
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