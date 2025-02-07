import { Document, Types } from "mongoose";

export const AUTH_TYPES = ['normal', 'google', 'naver', 'kakao'];
export const USER_ROLES = ['user', 'manager', 'admin'];

export type AuthType = typeof AUTH_TYPES[number];
export type UserRole = typeof USER_ROLES[number];

// DB 모델용 타입
export interface IUser extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
  email: string;
  password?: string;
  name: string;
  phone?: string;
  birth?: Date;
  department?: Types.ObjectId;
  registerType: AuthType;
  socialId?: string;
  role: UserRole;
  profileImage?: string;
  authoredProjects?: Types.ObjectId[];
  memberProjects?: Types.ObjectId[];
  tasks?: Types.ObjectId[];
  notifications?: Types.ObjectId[];
  readNotifications?: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}