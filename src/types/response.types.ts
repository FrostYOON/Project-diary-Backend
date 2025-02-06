import { Types } from "mongoose";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  status?: number;
}

// 인증 응답 타입
export interface AuthResponse {
  accessToken: string;
  user: {
    email: string;
    password?: string;
    name: string;
    phone?: string;
    birth?: Date;
    registerType: string;
    socialId?: string;
    role: string;
    department: Types.ObjectId;
  };
}

// 로그인 응답 타입
export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    department: Types.ObjectId;
    profileImage?: string;
  };
}