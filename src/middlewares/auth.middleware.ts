import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import passport from "passport";
import { IUser } from "../types/user.types";
import { AuthError } from "../types/error";

// 유효성 검사 미들웨어
export const validateAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: "입력값이 유효하지 않습니다.",
      errors: errors.array(),
    });
  }
  next();
};

// 로컬 인증 미들웨어
export const localAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "local",
    { session: false },
    (err: Error, user: IUser, info: any) => {
      if (err) {
        console.error("Local auth error:", err);
        return res.status(401).json({
          success: false,
          message: "인증 처리 중 오류가 발생했습니다.",
          error: err.message
        });
      }
      if (!user) {
        return res.status(401).json({
          success: false,
          message: info?.message || "이메일 또는 비밀번호가 올바르지 않습니다.",
          data: null
        });
      }
      req.user = user;
      next();
    }
  )(req, res, next);
};

// 구글 인증 미들웨어
export const googleAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const state = req.query.redirect_uri
      ? Buffer.from(req.query.redirect_uri as string).toString("base64")
      : Buffer.from(process.env.CLIENT_URL || "http://localhost:5173").toString(
          "base64"
        );

    passport.authenticate("google", {
      scope: ["profile", "email"],
      state,
      prompt: "select_account",
    })(req, res, next);
  } catch (error) {
    console.error("Google auth error:", error);
    return next(new AuthError("구글 인증 처리 중 오류가 발생했습니다."));
  }
};

// 네이버 인증 미들웨어
export const naverAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const state = req.query.redirect_uri
      ? Buffer.from(req.query.redirect_uri as string).toString("base64")
      : Buffer.from(process.env.CLIENT_URL || "http://localhost:5173").toString(
          "base64"
        );

    const authUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NAVER_CLIENT_ID}&redirect_uri=${process.env.NAVER_CALLBACK_URL}&state=${state}`;
    
    res.redirect(authUrl);
  } catch (error) {
    console.error('Naver auth error:', error);
    next(new AuthError('네이버 인증 처리 중 오류가 발생했습니다.'));
  }
};
    
// 카카오 인증 미들웨어
export const kakaoAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const state = req.query.redirect_uri
      ? Buffer.from(req.query.redirect_uri as string).toString("base64")
      : Buffer.from(process.env.CLIENT_URL || "http://localhost:5173").toString(
          "base64"
        );

    passport.authenticate("kakao", {
      scope: ['profile_nickname', 'profile_image', 'account_email'],
      state,
      prompt: "select_account",
    })(req, res, next);
  } catch (error) {
    console.error("Kakao auth error:", error);
    return next(new AuthError("카카오 인증 처리 중 오류가 발생했습니다."));
  }
};
