import { Department } from "../models";
import { IDepartment } from "../types/department.types";
import { ApiResponse } from "../types/response.types";
import mongoose from 'mongoose';

class DepartmentService {
  // 부서 생성
  async createDepartment(departmentData: Partial<IDepartment>): Promise<ApiResponse> {
    try {
      const department = await Department.create(departmentData);
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
      const departments = await Department.find();
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
        };
      }

      return {
        success: true,
        message: '부서 조회 성공',
        data: { department }
      };
    } catch (error) {
      console.error('부서 조회 에러:', error);
      throw new Error('부서 조회 중 오류가 발생했습니다.');
    }
  }

  // 부서 정보 수정
  async updateDepartment(id: string, updateData: Partial<IDepartment>): Promise<ApiResponse> {
    try {
      const department = await Department.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
      if (!department) {
        throw new Error('해당 부서를 찾을 수 없습니다.');
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
        throw new Error('해당 부서를 찾을 수 없습니다.');
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