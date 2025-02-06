import { Department } from "../models/schemas/department.schema";
import { IDepartment } from "../types/department.types";
import { ApiResponse } from "../types/response.types";

class DepartmentService {
  // 부서 생성
  async createDepartment(data: IDepartment): Promise<ApiResponse> {
    try {
      const department = await Department.create(data);
      return {
        success: true,
        message: '부서가 생성되었습니다.',
        data: { department }
      };
    } catch (error) {
      throw new Error('부서 생성 중 오류가 발생했습니다.');
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
  async updateDepartment(id: string, data: IDepartment): Promise<ApiResponse> {
    try {
      const department = await Department.findByIdAndUpdate(id, data, { new: true });
      if (!department) {
        return {
          success: false,
          message: '해당 부서를 찾을 수 없습니다.',
          status: 404
        };
      }
      
      return {
        success: true,
        message: '부서 정보가 수정되었습니다.',
        data: { department }
      };
    } catch (error) {
      throw new Error('부서 수정 중 오류가 발생했습니다.');
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