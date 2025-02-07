import { Department } from "../models";
import { ApiResponse } from "../types/response.types";

class DepartmentService {
  // 부서 생성
  async createDepartment(name: string): Promise<ApiResponse> {
    try {
      // 부서명 중복 체크
      const existingDepartment = await Department.findOne({ name });
      if (existingDepartment) {
        return {
          success: false,
          message: '이미 존재하는 부서명입니다.',
          status: 409
        };
      }

      const department = await Department.create({ name });
      
      return {
        success: true,
        message: '부서가 생성되었습니다.',
        data: { department }
      };
    } catch (error) {
      console.error('부서 생성 에러:', error); // 구체적인 에러 로깅
      throw new Error(
        error instanceof Error 
          ? error.message 
          : '부서 생성 중 오류가 발생했습니다.'
      );
    }
  }

  // 전체 부서 조회
  async getAllDepartments(): Promise<ApiResponse> {
    try {
      const departments = await Department.find().sort({ name: 1 });
      return {
        success: true,
        message: '부서 목록 조회 성공',
        data: { departments }
      };
    } catch (error) {
      throw new Error('부서 목록 조회 중 오류가 발생했습니다.');
    }
  }

  // 특정 부서 조회
  async getDepartmentById(id: string): Promise<ApiResponse> {
    try {
      const department = await Department.findById(id);
      
      if (!department) {
        return {
          success: false,
          message: '해당 부서를 찾을 수 없습니다.',
          status: 404
        };
      }

      return {
        success: true,
        message: '부서 조회 성공',
        data: { department }
      };
    } catch (error) {
      throw new Error('부서 조회 중 오류가 발생했습니다.');
    }
  }

  // 부서 정보 수정
  async updateDepartment(departmentId: string, name: string): Promise<ApiResponse> {
    try {
      // 1. 수정하려는 부서가 존재하는지 확인
      const department = await Department.findById(departmentId);
      if (!department) {
        return {
          success: false,
          message: '존재하지 않는 부서입니다.',
          status: 404
        };
      }

      // 2. 새로운 부서명이 기존 부서와 중복되는지 확인 (자기 자신 제외)
      const existingDepartment = await Department.findOne({ 
        name, 
        _id: { $ne: departmentId } 
      });
      if (existingDepartment) {
        return {
          success: false,
          message: '이미 존재하는 부서명입니다.',
          status: 409
        };
      }

      // 3. 부서 정보 업데이트
      const updatedDepartment = await Department.findByIdAndUpdate(
        departmentId,
        { name },
        { new: true }
      );

      return {
        success: true,
        message: '부서 정보가 수정되었습니다.',
        data: { department: updatedDepartment }
      };
    } catch (error) {
      console.error('부서 수정 에러:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : '부서 수정 중 오류가 발생했습니다.'
      );
    }
  }

  // 부서 삭제
  async deleteDepartment(id: string): Promise<ApiResponse> {
    try {
      const department = await Department.findByIdAndDelete(id);
      if (!department) {
        return {
          success: false,
          message: '해당 부서를 찾을 수 없습니다.',
          status: 404
        };
      }
      return {
        success: true,
        message: '부서가 삭제되었습니다.'
      };
    } catch (error) {
      throw new Error('부서 삭제 중 오류가 발생했습니다.');
    }
  }
}

export const departmentService = new DepartmentService();