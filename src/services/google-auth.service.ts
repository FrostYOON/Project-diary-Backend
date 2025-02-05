import { OAuth2Client } from 'google-auth-library';
import { User, Department } from '../models';
import { AuthError } from '../types/error';
import { ApiResponse, LoginResponse } from '../types/response.types';
import { tokenService } from './token.service';
import { GoogleProfile } from '../types/auth.types';

export class GoogleAuthService {
  private client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async verifyToken(tokenId: string) {
    try {
      return await this.client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.GOOGLE_CLIENT_ID
      });
    } catch (error) {
      console.error('Token verification error:', error);
      throw new AuthError('구글 토큰이 유효하지 않습니다.');
    }
  }

  async handleGoogleAuth(profile: GoogleProfile): Promise<ApiResponse<LoginResponse>> {
    try {
      let user = await User.findOne({
        email: profile.emails[0].value,
        registerType: 'google'
      });

      const defaultDepartment = await Department.findOne({ name: 'other' });
      if (!defaultDepartment) {
        throw new AuthError('기본 부서를 찾을 수 없습니다.');
      }

      if (!user) {
        user = await User.create({
          email: profile.emails[0].value,
          name: profile.displayName,
          registerType: 'google',
          socialId: profile.id,
          department: defaultDepartment._id,
          role: 'user'
        });
      }

      const accessToken = tokenService.generateToken(user);

      return {
        success: true,
        message: '구글 로그인 성공',
        data: {
          accessToken,
          user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            department: defaultDepartment?._id
          }
        }
      };
    } catch (error) {
      console.error('Google auth error:', error);
      throw new AuthError('구글 로그인 처리 중 오류가 발생했습니다.');
    }
  }
}

export const googleAuthService = new GoogleAuthService(); 