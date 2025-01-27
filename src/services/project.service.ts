import { Project } from "../models/schemas/project.schema";


// 프로젝트 목록 조회
export const getProjectList = async () => {
    
    return Project.find()
      .populate('department', 'name')
      .populate('members', 'name')
      .populate('author', 'name');
};

// 프로젝트 생성
export const createProject = async (projectData: any) => {
    // author는 현재 로그인한 사용자의 ID로 설정
    if (!projectData.author) {
      throw new Error('작성자 정보가 필요합니다.');
    }


    // members가 없으면 빈 배열로 초기화
    if (!projectData.members) {
      projectData.members = [];
    }

    return Project.create(projectData);
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
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      throw new Error('프로젝트를 찾을 수 없습니다.');
    }
    return project;
};

export const getProjectById = async (id: string) => {
    const project = await Project.findById(id)
      .populate('department', 'name')
      .populate('members', 'name')
      .populate('author', 'name');
    
    if (!project) {
      throw new Error('프로젝트를 찾을 수 없습니다.');
    }
    return project;
};