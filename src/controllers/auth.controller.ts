import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { IUserSignup } from "../types/user.types";
import { AuthError } from "../types/error";


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
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: '이메일과 비밀번호를 입력해주세요.'
      });
      return;
    }

    const result = await authService.login(email, password, res);
    res.status(result.status || 200).json(result);
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(401).json({
        success: false,
        message: error.message
      });
      return;
    }
    next(error);
  }
};

// 구글 로그인
export const googleLoginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await authService.googleLogin(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};



