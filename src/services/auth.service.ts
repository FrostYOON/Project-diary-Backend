import { User } from '../models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUser } from '../types/user.types';
import { AuthError } from '../types/error';

class AuthService {
  // 회원가입
  async signup(userData: IUser) {
    try {
      // 이메일 중복 체크
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new AuthError('이미 등록된 이메일입니다.');
      }

      // 사용자 생성
      const user = await User.create({
        ...userData,
        register_type: userData.register_type || 'normal',
        role: 'user',
        password: userData.register_type === 'normal' ? 
          await bcrypt.hash(userData.password!, 10) : 
          undefined
      });

      return {
        success: true,
        message: '회원가입이 완료되었습니다.',
        token: this.generateToken(user)
      };
    } catch (error) {
      if (error instanceof AuthError) throw error;
      throw new AuthError('회원가입 처리 중 오류가 발생했습니다.');
    }
  }

  // JWT 토큰 생성 유틸리티
  private generateToken(user: IUser) {
    if (!process.env.JWT_SECRET) {
      throw new AuthError('JWT_SECRET is not defined');
    }
    
    return jwt.sign(
      { 
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
  }

  // 구글 회원가입/로그인 통합
  async googleSignup(profile: any) {
    const existingUser = await User.findOne({
      email: profile._json.email,
      register_type: 'google'
    });

    if (existingUser) {
      return existingUser;
    }

    return User.create({
      email: profile._json.email,
      name: profile._json.name,
      register_type: 'google',
      social_id: profile._json.sub,
      role: 'user'
    });
  }
}

export const authService = new AuthService();
