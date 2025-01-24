import { User } from '../models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUserSignup, IUser } from '../types/user.types';
import { AuthError } from '../types/error';
import { AuthResponse, ApiResponse } from '../types/response.types';
import { Profile } from 'passport-google-oauth20';

class AuthService {
  // 사용자 생성 로직 분리
  private async createUser(userData: IUserSignup): Promise<IUser> {
    const isEmailTaken = await User.isEmailTaken(userData.email);
    if (isEmailTaken) {
      throw new AuthError('이미 등록된 이메일입니다.');
    }

    const hashedPassword = userData.registerType === 'normal' 
      ? await this.hashPassword(userData.password!)
      : undefined;

    return User.create({
      ...userData,
      password: hashedPassword,
      role: 'user'
    });
  }

  // 회원가입
  async signup(userData: IUserSignup): Promise<ApiResponse<AuthResponse>> {
    try {
      const user = await this.createUser(userData);
      const token = this.generateToken(user);
      
      return {
        success: true,
        message: '회원가입이 완료되었습니다.',
        data: {
          token,
          user: this.formatUserResponse(user)
        }
      };
    } catch (error) {
      if (error instanceof AuthError) throw error;
      throw new AuthError('회원가입 처리 중 오류가 발생했습니다.');
    }
  }

  // 구글 회원가입/로그인
  async googleSignup(profile: Profile): Promise<ApiResponse<AuthResponse>> {
    try {
      const existingUser = await User.findOne({
        email: profile._json.email,
        registerType: 'google'
      });

      const user = existingUser || await this.createUser({
        email: profile._json.email!,
        name: profile._json.name!,
        registerType: 'google',
        socialId: profile.id,
        department: 'other',
        role: 'user'
      });

      const token = this.generateToken(user);
      
      return {
        success: true,
        message: '구글 로그인이 완료되었습니다.',
        data: {
          token,
          user: this.formatUserResponse(user)
        }
      };
    } catch (error) {
      if (error instanceof AuthError) throw error;
      throw new AuthError('구글 로그인 처리 중 오류가 발생했습니다.');
    }
  }

  // 유틸리티 메서드들
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private generateToken(user: IUser): string {
    if (!process.env.JWT_SECRET) {
      throw new AuthError('JWT_SECRET is not defined');
    }
    
    return jwt.sign(
      { 
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
  }

  private formatUserResponse(user: IUser) {
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role
    };
  }
}

export const authService = new AuthService();
