import { Router } from 'express';
import { authController } from '../../../controllers/auth.controller';
import { signUpValidator } from '../../../validators/auth.validator';

const router = Router();

// 회원가입
router.post('/signup', signUpValidator, authController.signUp);

// 일반 로그인
router.post('/login', authController.localAuth);

// 구글 로그인
router.get('/login/google', authController.googleLogin);

// 구글 로그인 콜백
router.get('/login/google/callback', ...authController.googleCallback);

export default router;