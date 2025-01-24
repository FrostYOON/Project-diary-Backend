import { Request, Response, NextFunction } from "express";
import { authenticateUser, findOrCreateGoogleUser } from "../services/auth.service";
import { authService } from "../services/auth.service";
import { IUserSignup } from "../types/user.types";
import { ApiResponse } from "../types/response.types";

// 회원가입
export const signUpController = async (
  req: Request<{}, {}, IUserSignup>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// 로그인
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const { token, user } = await authenticateUser(email, password);
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  const googleProfile = req.body;

  try {
    const { token, user } = await findOrCreateGoogleUser(googleProfile);
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Failed to authenticate with Google" });
  }
};



