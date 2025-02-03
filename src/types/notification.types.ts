import { Document, Types } from "mongoose";

export type NotificationType = 'PROJECT_CREATED' | 'PROJECT_DUE_SOON' | 'PROJECT_ENDED' | 'PROJECT_CANCELED';

export interface INotification extends Document {
  title: string;
  content: string;
  type: NotificationType;
  project: Types.ObjectId;
  recipients: Types.ObjectId[];  // 알림을 받을 사용자들
  readBy: Types.ObjectId[];  // 읽은 사용자들
  createdAt: Date;
}