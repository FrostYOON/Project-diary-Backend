import { Schema } from "mongoose";
import {
  IUser,
  AUTH_TYPES,
  USER_ROLES
} from "../../types/user.types";

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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

UserSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

export default UserSchema;
