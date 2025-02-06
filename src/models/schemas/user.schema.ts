import { Schema } from "mongoose";
import { IUser, AUTH_TYPES, USER_ROLES } from "../../types/user.types";
import { Project, Task, Notification } from "../../models";

const UserSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  phone: { type: String },
  birth: { type: Date },
  department: {
    type: Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  registerType: {
    type: String,
    enum: AUTH_TYPES,
    required: true,
    default: "normal",
  },
  socialId: { type: String },
  role: {
    type: String,
    enum: USER_ROLES,
    required: true,
    default: "user",
  },
  profileImage: { type: String },
  authoredProjects: [{
    type: Schema.Types.ObjectId,
    ref: "Project",
  }],
  memberProjects: [{
    type: Schema.Types.ObjectId,
    ref: "Project",
  }],
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: "Task",
  }],
  notifications: [{
    type: Schema.Types.ObjectId,
    ref: "Notification",
  }],
  readNotifications: [{
    type: Schema.Types.ObjectId,
    ref: "Notification",
  }],
}, {
  timestamps: true
});

UserSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

// 유저 삭제 전 관련 데이터 정리
UserSchema.pre('deleteOne', { document: true, query: false }, async function() {
  const userId = this._id;

  try {
    await Project.updateMany({ members: userId }, { $pull: { members: userId } });

    await Task.deleteMany({ author: userId });

    await Notification.updateMany(
      { $or: [{ recipients: userId }, { readBy: userId }] },
      { 
        $pull: { 
          recipients: userId,
          readBy: userId 
        } 
      }
    );

  } catch (error) {
    console.error('유저 삭제 전 데이터 정리 중 오류:', error);
    throw error;
  }
});

export default UserSchema;
