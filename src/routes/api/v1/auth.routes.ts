import { Router } from 'express';
import { authController } from '../../../controllers/auth.controller';
import { signUpValidator } from '../../../validators/auth.validator';
import { validateAuth, localAuthMiddleware, googleAuthMiddleware } from '../../../middlewares/auth.middleware';
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

// 구글 로그인 콜백
router.get('/login/google/callback', 
  passport.authenticate('google', { session: false }), 
  authController.googleCallback
);

export default router;