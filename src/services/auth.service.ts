import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { IUserSignup, IUser } from '../types/user.types';
import { User } from '../models';
import { AuthError } from '../types/error';
import { AuthResponse, ApiResponse, LoginResponse } from '../types/response.types';
import { Profile } from 'passport-google-oauth20';

class AuthService {
  // 사용자 생성 로직 분리
  private async createUser(userData: IUserSignup): Promise<IUser> {
    const isEmailTaken = await User.isEmailTaken(userData.email);
    if (isEmailTaken) {
      throw new AuthError('이미 등록된 이메일입니다.');
    }

    console.log('userData:', userData); // 회원가입 데이터 확인

    // 일반 회원가입인 경우 비밀번호 필수
    if (!userData.registerType || userData.registerType === 'normal') {
      if (!userData.password) {
        throw new AuthError('비밀번호가 필요합니다.');
      }
      const hashedPassword = await this.hashPassword(userData.password);
      
      // password를 제외한 나머지 데이터
      const { password, ...restUserData } = userData;

      return User.create({
        ...restUserData,
        registerType: 'normal',
        password: hashedPassword,
        role: 'user',
        department: "other"
      });
    }

    // 소셜 로그인의 경우
    const { password, ...restUserData } = userData;
    return User.create({
      ...restUserData,
      role: 'user',
      department: "other"
    });
  }

  // 회원가입
  async signup(userData: IUserSignup): Promise<ApiResponse<AuthResponse>> {
    try {
      const user = await this.createUser(userData);
      
      return {
        success: true,
        message: '회원가입이 완료되었습니다.',
        data: {
          user: this.formatUserResponse(user)
        }
      };
    } catch (error) {
      console.error('Signup error details:', error); // 상세 에러 확인
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
      email: user.email,
      password: user.password,
      name: user.name,
      phone: user.phone,
      birth: user.birth,
      registerType: user.registerType,
      socialId: user.socialId,
      role: user.role,
      department: user.department
    };
  }

  // 로그인
  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    try {
      console.log('Login attempt for email:', email);
      const user = await User.findOne({ email });
      
      if (!user) {
        console.log('User not found with email:', email);
        throw new AuthError('이메일 또는 비밀번호가 올바르지 않습니다.');
      }

      console.log('Found user:', user);
      
      // 비밀번호 필드 확인
      if (!user.password) {
        console.error('User found but password is not set');
        throw new AuthError('이메일 또는 비밀번호가 올바르지 않습니다.');
      }

      // 비밀번호 비교
      try {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password validation result:', isPasswordValid);
        
        if (!isPasswordValid) {
          throw new AuthError('이메일 또는 비밀번호가 올바르지 않습니다.');
        }
      } catch (bcryptError) {
        console.error('Password comparison error:', bcryptError);
        throw new AuthError('이메일 또는 비밀번호가 올바르지 않습니다.');
      }

      const accessToken = this.generateToken(user);
      
      return {
        success: true,
        message: '로그인이 완료되었습니다.',
        data: {
          accessToken,
          user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name
          }
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof AuthError) {
        throw error;
      }
      if (error instanceof Error) {
        console.error('Detailed error:', error.message);
      }
      throw new AuthError('로그인 처리 중 오류가 발생했습니다.');
    }
  }
}

export const authService = new AuthService();
