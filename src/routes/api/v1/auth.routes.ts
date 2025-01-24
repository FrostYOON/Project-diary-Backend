import express from 'express';
import { signUpController, login, googleLogin  } from '../../../controllers/auth.controller';
import { signUpValidator, loginValidation, googleLoginValidation } from '../../../validators/auth.validator';
import { auth } from "../../../middlewares/auth.middleware";

const router = express.Router();

// 회원가입
router.post('/signup', signUpValidator, signUpController);

// 일반 로그인
router.post("/login", loginValidation, auth, login);

// 구글 로그인
router.post("/google-login", googleLoginValidation, auth, googleLogin);

export default router;