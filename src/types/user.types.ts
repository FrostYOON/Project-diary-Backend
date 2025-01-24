import { Document, Model, Types } from "mongoose";

// 상수로 관리하면 재사용성과 유지보수성이 향상됩니다
export const DEPARTMENTS = [
  'ceo',
  'hr',
  'sales',
  'marketing',
  'design',
  'development',
  'other'
] as const;

export const AUTH_TYPES = ['normal', 'google'] as const;
export const USER_ROLES = ['user', 'manager', 'admin', 'superAdmin'] as const;

export type Department = typeof DEPARTMENTS[number];
export type AuthType = typeof AUTH_TYPES[number];
export type UserRole = typeof USER_ROLES[number];

// 회원가입 시 필요한 데이터 타입
export interface IUserSignup {
  email: string;
  password?: string;
  name: string;
  phone?: string;
  birth?: Date;
  registerType: AuthType;
  department: Department;
  role: UserRole;
  socialId?: string;
}

// DB 모델용 타입
export interface IUser extends Document<Types.ObjectId> {
  email: string;
  password?: string;
  name: string;
  phone?: string;
  birth?: Date;
  department: Department;
  registerType: AuthType;
  socialId?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// 응답용 타입 (비밀번호 등 민감정보 제외)
export type UserResponse = Omit<IUser, 'password' | 'socialId'>;

// User 모델의 static 메서드 타입
export interface IUserEmailTaken extends Model<IUser> {
  isEmailTaken(email: string, excludeUserId?: string): Promise<boolean>;
}