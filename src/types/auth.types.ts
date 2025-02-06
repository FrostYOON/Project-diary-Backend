import { Types, Model } from 'mongoose';
import { IUser, AuthType, UserRole } from './user.types';

// 회원가입 시 필요한 데이터 타입
export interface IUserSignup {
  email: string;
  password?: string;
  name: string;
  phone?: string;
  birth?: Date;
  registerType: AuthType;
  department?: Types.ObjectId;
  role: UserRole;
  socialId?: string;
}

// Passport Info 타입
export interface PassportInfo {
  message?: string;
}

// 구글 프로필 타입
export interface GoogleProfile {
  id: string;
  emails: Array<{ value: string }>;
  displayName: string;
  photos: Array<{ value: string }>;
}

// 네이버 프로필 타입
export interface NaverProfile {
  id: string;
  emails: Array<{ value: string }>;
  displayName: string;
  profile_image: string;
  _json: {
    email: string;
    nickname: string;
    profile_image: string;
  }
}

// 카카오 프로필 타입
export interface KakaoProfile {
  id: string;
  _json: {
    kakao_account: {
      email: string;
      profile: {
        nickname: string;
        profile_image_url: string;
      }
    }
  }
}

// 에러 타입
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
} 

// 응답용 타입 (비밀번호 등 민감정보 제외)
export type UserResponse = Omit<IUser, 'password' | 'socialId'>;

// User 모델의 static 메서드 타입
export interface IUserEmailTaken extends Model<IUser> {
  isEmailTaken(email: string, excludeUserId?: string): Promise<boolean>;
}