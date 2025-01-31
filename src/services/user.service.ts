import { User } from '../models';
import { ApiResponse } from '../types/response.types';
import { IUserSignup } from '../types/user.types';

class UserService {
  // 사용자 생성
  async createUser(userData: IUserSignup): Promise<ApiResponse> {
    try {
      const user = await User.create(userData);
      return {
        success: true,
        message: '사용자가 생성되었습니다.',
        data: { user }
      };
    } catch (error) {
      throw new Error('사용자 생성 중 오류가 발생했습니다.');
    }
  }

  // 전체 사용자 조회
  async getAllUsers(): Promise<ApiResponse> {
    try {
      const users = await User.find()
        .select('-password -socialId')
        .populate('department', 'name');
      return {
        success: true,
        message: '사용자 목록 조회 성공',
        data: { users }
      };
    } catch (error) {
      throw new Error('사용자 목록 조회 중 오류가 발생했습니다.');
    }
  }

  // 특정 사용자 조회
  async getUserById(id: string): Promise<ApiResponse> {
    try {
      const user = await User.findById(id)
        .select('-password -socialId')
        .populate('department', 'name');
      
      if (!user) {
        return {
          success: false,
          message: '사용자를 찾을 수 없습니다.',
          status: 404
        };
      }

      return {
        success: true,
        message: '사용자 조회 성공',
        data: { user }
      };
    } catch (error) {
      throw new Error('사용자 조회 중 오류가 발생했습니다.');
    }
  }

  // 사용자 정보 수정
  async updateUser(id: string, data: Partial<IUserSignup>): Promise<ApiResponse> {
    try {
      const user = await User.findByIdAndUpdate(
        id, 
        data,
        { new: true }
      ).select('-password -socialId');

      if (!user) {
        return {
          success: false,
          message: '사용자를 찾을 수 없습니다.',
          status: 404
        };
      }

      return {
        success: true,
        message: '사용자 정보가 수정되었습니다.',
        data: { user }
      };
    } catch (error) {
      throw new Error('사용자 수정 중 오류가 발생했습니다.');
    }
  }

  // 사용자 삭제
  async deleteUser(id: string): Promise<ApiResponse> {
    try {
      const user = await User.findByIdAndDelete(id);
      
      if (!user) {
        return {
          success: false,
          message: '사용자를 찾을 수 없습니다.',
          status: 404
        };
      }

      return {
        success: true,
        message: '사용자가 삭제되었습니다.'
      };
    } catch (error) {
      throw new Error('사용자 삭제 중 오류가 발생했습니다.');
    }
  }

  async getUserDepartment(userId: string): Promise<ApiResponse> {
    try {
      const user = await User.findById(userId).populate('department', 'name');
      
      if (!user) {
        return {
          success: false,
          message: '사용자를 찾을 수 없습니다.',
          status: 404
        };
      }

      return {
        success: true,
        message: '부서 정보 조회 성공',
        data: {
          department: user.department
        }
      };
    } catch (error) {
      throw new Error('부서 정보 조회 중 오류가 발생했습니다.');
    }
  }
}

export const userService = new UserService();
