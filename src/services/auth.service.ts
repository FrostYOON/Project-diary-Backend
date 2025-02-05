import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { tokenService } from "./token.service";
import { User } from '../models';
import { AuthError } from '../types/error';
import { ApiResponse, AuthResponse, LoginResponse } from '../types/response.types';
import { IUserSignup } from '../types/auth.types';
import { Department } from '../models';
import { Response } from 'express';
import { googleAuthService } from './google-auth.service';

class AuthService {
  // 유틸리티 메서드들
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  // 회원가입
  async signup(userData: IUserSignup): Promise<ApiResponse<AuthResponse>> {
    try {
      // 부서 이름으로 부서 ID 찾기
      const department = await Department.findOne({ name: 'other' });
      if (!department) {
        return {
          success: false,
          message: '존재하지 않는 부서입니다.',
          status: 400
        };
      }

      // 비밀번호 해시화
      const hashedPassword = userData.password ? await this.hashPassword(userData.password) : undefined;

      // 사용자 생성 시 부서 ID 저장
      const user = await User.create({
        ...userData,
        department: department._id,  // 부서 이름을 ID로 변환
        registerType: 'normal',
        password: hashedPassword,
        role: 'user'
      });

      const accessToken = tokenService.generateToken(user);

      return {
        success: true,
        message: '회원가입이 완료되었습니다.',
        data: {
          accessToken,
          user: {
            email: user.email,
            password: hashedPassword,
            name: user.name,
            phone: user.phone,
            birth: user.birth,
            registerType: user.registerType,
            socialId: user.socialId,
            role: user.role,
            department: department?._id,
          }
        }
      };
    } catch (error) {
      throw new AuthError('회원가입 처리 중 오류가 발생했습니다.');
    }
  }
  
  // 로그인
  async login(email: string, password: string, res: Response): Promise<ApiResponse<LoginResponse>> {
    try {
      const user = await User.findOne({ email });
      if (!user || !user.password) {
        throw new AuthError('이메일 또는 비밀번호가 올바르지 않습니다.');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new AuthError('이메일 또는 비밀번호가 올바르지 않습니다.');
      }

      const department = await Department.findById(user.department);
      if (!department) {
        throw new AuthError('존재하지 않는 부서입니다.');
      }

      const accessToken = tokenService.generateToken(user);
      tokenService.setCookie(res, accessToken);

      return {
        success: true,
        message: '로그인이 완료되었습니다.',
        data: {
          accessToken,
          user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            department: department?._id
          }
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(res: Response): Promise<ApiResponse<null>> {
    try {
      tokenService.clearCookie(res);
      return {
        success: true,
        message: '로그아웃이 완료되었습니다.'
      };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // 구글 로그인
  async googleLogin(tokenId: string): Promise<ApiResponse<LoginResponse>> {
    try {
      const ticket = await googleAuthService.verifyToken(tokenId);
      const payload = ticket.getPayload();
      
      if (!payload) {
        throw new AuthError('구글 인증 정보를 가져올 수 없습니다.');
      }

      const profile = {
        id: payload.sub,
        emails: [{ value: payload.email || '' }],
        displayName: payload.name || payload.email?.split('@')[0] || ''
      };

      return await googleAuthService.handleGoogleAuth(profile);
    } catch (error) {
      console.error('Google login error:', error);
      if (error instanceof AuthError) throw error;
      throw new AuthError('구글 로그인 처리 중 오류가 발생했습니다.');
    }
  }
}

export const authService = new AuthService();
