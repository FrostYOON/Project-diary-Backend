import { Request, Response, NextFunction } from "express";
import passport from 'passport';
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
    res.status(200).json(result);
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

export const authController = {
  // 기존 로그인/회원가입 컨트롤러는 유지
  signUp: signUpController,
  login: loginController,
  
  // 구글 로그인 관련 컨트롤러
  googleLogin: (req: Request, res: Response, next: NextFunction) => {
    const state = req.query.redirect_uri 
      ? Buffer.from(req.query.redirect_uri as string).toString('base64')
      : Buffer.from(process.env.CLIENT_URL || 'http://localhost:5173').toString('base64');
    
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      state,
      prompt: 'select_account'
    })(req, res, next);
  },

  // 구글 로그인 콜백
  googleCallback: [
    passport.authenticate('google', { session: false }),
    (req: Request, res: Response) => {
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

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
      });

      const redirectUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/+$/, '');
      return res.redirect(`${redirectUrl}/auth/callback?accessToken=${accessToken}`);
    }
  ],

  // 일반 로그인 인증 미들웨어
  localAuth: (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', { session: false }, async (err: any, user: any, info: any) => {
      if (err) {
        console.error('Login error:', err);
        return next(err);
      }
      if (!user) {
        console.log('Authentication failed:', info?.message);
        return res.status(401).json({ 
          success: false,
          message: info?.message || '이메일 또는 비밀번호가 올바르지 않습니다.' 
        });
      }

      try {
        req.user = user;
        return loginController(req, res, next);
      } catch (error) {
        console.error('Login controller error:', error);
        next(error);
      }
    })(req, res, next);
  }
};



