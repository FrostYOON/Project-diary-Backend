import express from 'express';
import { signUpController, loginController } from '../../../controllers/auth.controller';
import { signUpValidator } from '../../../validators/auth.validator';

const router = express.Router();

// 회원가입
router.post('/signup', signUpValidator, signUpController);

// 일반 로그인
router.post('/login', loginController);

export default router;