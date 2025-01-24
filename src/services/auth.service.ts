import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User, { IUser } from "../models/user.model";

interface GoogleProfile {
  email: string;
  name: string;
  googleId: string;
}
export const authenticateUser = async (email: string, password: string) => {

  const user = await User.findOne({ email });
  if (!user || !user.password) {
    throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
  }

  // JWT 토큰 생성
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET_KEY as string,
    { expiresIn: process.env.JWT_EXPIRES_IN as string }
  );

  return { token, user };
};

export const findOrCreateGoogleUser = async (googleProfile: GoogleProfile) => {

  const { email, name, googleId } = googleProfile;

  let user = await User.findOne({ email, register_type: "google" });
  if (!user) {
    user = await User.create({
      email,
      name,
      social_id: googleId,
      register_type: "google",
      role: "user", // 기본 역할 설정
    });
  }

  // JWT 토큰 생성
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET_KEY as string,
    { expiresIn: process.env.JWT_EXPIRES_IN as string }
  );

  return { token, user };
};

