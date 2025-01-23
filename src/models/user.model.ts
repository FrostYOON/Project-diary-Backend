import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  phone: string;
  birth: Date;
  department: "ceo" | "hr" | "sales" | "marketing" | "design" | "development" | "other";
  register_type: "normal" | "google";
  social_id: string;
  role: "user" | "manager" | "admin" | "superadmin";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  phone: { type: String },
  birth: { type: Date },
  department: {
    type: String,
    enum: ["ceo", "hr", "sales", "marketing", "design", "development", "other"],
    required: true,
    default: "other",
  },
  register_type: {
    type: String,
    enum: ["normal", "google"],
    required: true,
    default: "normal",
  },
  social_id: { type: String },
  role: {
    type: String,
    enum: ["user", "manager", "admin", "superadmin"],
    required: true,
    default: "user",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

UserSchema.pre("save", async function (next) {
  if (this.password && this.isNew || this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
