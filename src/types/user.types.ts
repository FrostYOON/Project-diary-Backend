import { Document } from "mongoose";

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
export const USER_ROLES = ['user', 'manager', 'admin', 'superadmin'] as const;

export type Department = typeof DEPARTMENTS[number];
export type AuthType = typeof AUTH_TYPES[number];
export type UserRole = typeof USER_ROLES[number];

// 회원가입 시 필요한 데이터 타입
export interface IUserSignup {
  email: string;
  password?: string;  // google 로그인의 경우 불필요
  name: string;
  phone?: string;
  birth?: Date;
  department: Department;
  register_type: AuthType;
}

// DB 모델용 타입
export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  phone?: string;
  birth?: Date;
  department: Department;
  register_type: AuthType;
  social_id?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// 응답용 타입 (비밀번호 등 민감정보 제외)
export type UserResponse = Omit<IUser, 'password' | 'social_id'>;
