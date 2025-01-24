import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { IUserSignup, IUser } from '../types/user.types';
import { User } from '../models';
import { AuthError } from '../types/error';
import { AuthResponse, ApiResponse } from '../types/response.types';
import { Profile } from 'passport-google-oauth20';

interface GoogleProfile {
  email: string;
  name: string;
  googleId: string;
}
export const authenticateUser = async (email: string, password: string) => {

  const user = await User.findOne({ email });
  if (!user || !user.password) {
    throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
  }

  // JWT 토큰 생성
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET_KEY as string,
    { expiresIn: process.env.JWT_EXPIRES_IN as string }
  );

  return { token, user };
};

export const findOrCreateGoogleUser = async (googleProfile: GoogleProfile) => {

  const { email, name, googleId } = googleProfile;

  let user = await User.findOne({ email, registerType: "google" });
  if (!user) {
    user = await User.create({
      email,
      name,
      socialId: googleId,
      registerType: "google",
      role: "user", // 기본 역할 설정
      department: "other"
    });
  }

  // JWT 토큰 생성
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET_KEY as string,
    { expiresIn: process.env.JWT_EXPIRES_IN as string }
  );

  return { token, user };
};


class AuthService {
  // 사용자 생성 로직 분리
  private async createUser(userData: IUserSignup): Promise<IUser> {
    const isEmailTaken = await User.isEmailTaken(userData.email);
    if (isEmailTaken) {
      throw new AuthError('이미 등록된 이메일입니다.');
    }

    console.log('userData:', userData); // 회원가입 데이터 확인

    const hashedPassword = userData.registerType === 'normal' 
      ? await this.hashPassword(userData.password!)
      : undefined;

    return User.create({
      ...userData,
      password: hashedPassword,
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
}

export const authService = new AuthService();
