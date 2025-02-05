import { User, Department } from '../models';
import { AuthError } from '../types/error';
import { tokenService } from './token.service';
import { ApiResponse, LoginResponse } from '../types/response.types';
import { KakaoProfile } from '../types/auth.types';
class KakaoAuthService {
  async handleKakaoAuth(profile: KakaoProfile): Promise<ApiResponse<LoginResponse>> {
    try {
      const email = profile._json.kakao_account.email;
      const profileImage = profile._json.kakao_account.profile.profile_image_url;
      
      let user = await User.findOne({
        email,
        registerType: 'kakao'
      });

      const defaultDepartment = await Department.findOne({ name: 'other' });
      if (!defaultDepartment) {
        throw new AuthError('기본 부서를 찾을 수 없습니다.');
      }

      if (!user) {
        user = await User.create({
          email,
          name: profile._json.kakao_account.profile.nickname,
          registerType: 'kakao',
          socialId: profile.id,
          department: defaultDepartment._id,
          profileImage: profileImage,
          role: 'user'
        });
      }

      const accessToken = tokenService.generateToken(user);

      return {
        success: true,
        message: '카카오 로그인 성공',
        data: {
          accessToken,
          user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            department: defaultDepartment?._id,
            profileImage: user.profileImage
          }
        }
      };
    } catch (error) {
      console.error('Kakao auth error:', error);
      throw new AuthError('카카오 로그인 처리 중 오류가 발생했습니다.');
    }
  }
}

export const kakaoAuthService = new KakaoAuthService(); 