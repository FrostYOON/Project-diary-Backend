import axios from 'axios';
import { User, Department } from '../models';
import { AuthError } from '../types/error';
import { ApiResponse, LoginResponse } from '../types/response.types';
import { tokenService } from './token.service';
import { NaverProfile } from '../types/auth.types';

export class NaverAuthService {
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.clientId = process.env.NAVER_CLIENT_ID || '';
    this.clientSecret = process.env.NAVER_CLIENT_SECRET || '';
  }

  async verifyToken(accessToken: string): Promise<NaverProfile> {
    try {
      const response = await axios.get('https://openapi.naver.com/v1/nid/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.data.resultcode !== '00') {
        throw new AuthError('네이버 토큰이 유효하지 않습니다.');
      }

      const profile = response.data.response;
      return {
        id: profile.id,
        emails: [{ value: profile.email }],
        displayName: profile.nickname,
        profile_image: profile.profile_image,
        _json: {
          email: profile.email,
          nickname: profile.nickname,
          profile_image: profile.profile_image
        }
      };
    } catch (error) {
      console.error('Naver token verification error:', error);
      throw new AuthError('네이버 토큰 검증 중 오류가 발생했습니다.');
    }
  }

  async handleNaverAuth(profile: NaverProfile): Promise<ApiResponse<LoginResponse>> {
    try {
      let user = await User.findOne({
        email: profile._json.email,
        registerType: 'naver'
      });

      const defaultDepartment = await Department.findOne({ name: 'other' });
      if (!defaultDepartment) {
        throw new AuthError('기본 부서를 찾을 수 없습니다.');
      }

      if (!user) {
        user = await User.create({
          email: profile._json.email,
          name: profile._json.nickname,
          registerType: 'naver',
          socialId: profile.id,
          department: defaultDepartment._id,
          profileImage: profile._json.profile_image,
          role: 'user'
        });
      }

      const accessToken = tokenService.generateToken(user);

      return {
        success: true,
        message: '네이버 로그인 성공',
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
      console.error('Naver auth error:', error);
      throw new AuthError('네이버 로그인 처리 중 오류가 발생했습니다.');
    }
  }
}

export const naverAuthService = new NaverAuthService();