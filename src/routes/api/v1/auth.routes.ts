import express from 'express';
import passport from 'passport';
import { signUpController } from '../../../controllers/auth.controller';
import { signUpValidator } from '../../../validators/auth.validator';
import jwt from 'jsonwebtoken';
import { IUser } from '../../../types/user.types';

const router = express.Router();

// 회원가입 - JWT 인증 제거
router.post('/signup', signUpValidator, signUpController);

// 일반 로그인
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (
    err: any, 
    user: IUser | false, 
    info: { message: string } | undefined
  ) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ 
        message: info?.message || '이메일 또는 비밀번호가 올바르지 않습니다.' 
      });
    }

    try {
      // JWT 토큰 생성
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '24h' }
      );

      // 쿠키에 토큰 설정
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });

      // 응답에 토큰 포함
      return res.json({
        success: true,
        user: {
          id: user._id,
          email: user.email
        },
        accessToken  // 토큰을 응답에 포함
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
});

// 구글 로그인
router.get('/login/google', (req, res, next) => {
  const state = req.query.redirect_uri 
    ? Buffer.from(req.query.redirect_uri as string).toString('base64')
    : Buffer.from(process.env.CLIENT_URL || 'http://localhost:5173').toString('base64');
  
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state,
    prompt: 'select_account'  // 항상 계정 선택 화면 표시
  })(req, res, next);
});

// 구글 로그인 콜백
router.get('/login/google/callback', 
  passport.authenticate('google', { session: false }),
  (req, res) => {
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

    // 쿠키에 토큰 설정
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    // 프론트엔드에서 토큰 처리를 위한 상태 페이지로 리다이렉트
    const redirectUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/+$/, '');
    return res.redirect(`${redirectUrl}/auth/callback?accessToken=${accessToken}`);
  }
);

export default router;