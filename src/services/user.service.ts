import { User } from '../models';
import { ApiResponse } from '../types/response.types';

class UserService {
  async getUsersByDepartment(departmentId: string): Promise<ApiResponse> {
    try {
      const users = await User.find({ department: departmentId }).sort({ name: 1 });
      return {
        success: true,
        message: '부서별 사용자 목록 조회 성공',
        data: { users }
      };
    } catch (error) {
      throw new Error('부서별 사용자 목록 조회 중 오류가 발생했습니다.');
    }
  }
}

export const userService = new UserService();
