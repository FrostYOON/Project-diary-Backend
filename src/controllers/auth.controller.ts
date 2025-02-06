import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { IUserSignup } from "../types/auth.types";
import { AuthError } from "../types/error";
import { tokenService } from "../services/token.service";


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
        message: '이메일과 비밀번호를 입력해주세요.',
        data: null
      });
      return;
    }

    const result = await authService.login(email, password, res);
    res.status(200).json(result);
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      success: false,
      message: error instanceof AuthError ? error.message : '로그인 처리 중 오류가 발생했습니다.',
      data: null
    });
  }
};

// 로그아웃
export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await authService.logout(res);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// 소셜 로그인 공통 콜백 핸들러
const handleSocialCallback = (req: Request, res: Response) => {
  if (!req.user) {
    const redirectUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    return res.redirect(`${redirectUrl}/login?error=authentication_failed`);
  }

  const user = req.user as any;
  const accessToken = user.accessToken;

  if (!accessToken) {
    console.error('No token found in user object:', user);
    const redirectUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    return res.redirect(`${redirectUrl}/login?error=token_missing`);
  }

  tokenService.setCookie(res, accessToken);
  const redirectUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/+$/, '');
  return res.redirect(`${redirectUrl}/auth/callback?accessToken=${accessToken}`);
};

export const authController = {
  // 기존 로그인/회원가입 컨트롤러는 유지
  signUp: signUpController,
  login: loginController,
  logout: logoutController,
  googleCallback: handleSocialCallback,
  naverCallback: handleSocialCallback,
  kakaoCallback: handleSocialCallback,
};


