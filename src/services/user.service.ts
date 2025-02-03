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
      // email과 password 필드 제거
      const { email, password, ...updateData } = data;

      const user = await User.findByIdAndUpdate(
        id,
        updateData,
        { 
          new: true,
          runValidators: true 
        }
      )
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
        message: '회원정보가 수정되었습니다.',
        data: { 
          user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            birth: user.birth,
            department: user.department,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }
        }
      };
    } catch (error) {
      console.error('User update error:', error);
      throw new Error('회원정보 수정 중 오류가 발생했습니다.');
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

  // 내 정보 조회
  async getMyInfo(userId: string): Promise<ApiResponse> {
    try {
      const user = await User.findById(userId)
        .select('-password -socialId')
        .populate('department', 'name')
        .lean();

      if (!user) {
        return {
          success: false,
          message: '사용자를 찾을 수 없습니다.',
          status: 404
        };
      }

      return {
        success: true,
        message: '내 정보 조회 성공',
        data: { 
          user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            birth: user.birth,
            department: user.department,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }
        }
      };
    } catch (error) {
      console.error('User info lookup error:', error);
      throw new Error('사용자 정보 조회 중 오류가 발생했습니다.');
    }
  }
}

export const userService = new UserService();
