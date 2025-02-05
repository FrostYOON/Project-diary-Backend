import { Router } from 'express';
import { authController } from '../../../controllers/auth.controller';
import { signUpValidator } from '../../../validators/auth.validator';
import { validateAuth, localAuthMiddleware, googleAuthMiddleware, naverAuthMiddleware, kakaoAuthMiddleware } from '../../../middlewares/auth.middleware';
import passport from 'passport';

const router = Router();

// 회원가입
router.post('/signup', signUpValidator, validateAuth, authController.signUp);

// 일반 로그인
router.post('/login', validateAuth, localAuthMiddleware, authController.login);

// 로그아웃
router.post('/logout', authController.logout);

// 구글 로그인
router.get('/login/google', googleAuthMiddleware);

// 카카오 로그인
router.get('/login/kakao', kakaoAuthMiddleware);

// 구글 로그인 콜백
router.get('/login/google/callback', 
  passport.authenticate('google', { session: false }), 
  authController.googleCallback
);

// 네이버 로그인
router.get('/login/naver', naverAuthMiddleware);

// 네이버 로그인 콜백
router.get('/login/naver/callback', 
  passport.authenticate('naver', { session: false }), 
  authController.naverCallback
);

// 카카오 로그인 콜백
router.get('/login/kakao/callback', 
  passport.authenticate('kakao', { session: false }), 
  authController.kakaoCallback
);

export default router;