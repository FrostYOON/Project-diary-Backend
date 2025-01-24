import express from "express";
import { login, googleLogin } from "../controllers/auth.controller";
import { loginValidation, googleLoginValidation } from "../validators/auth.validator";
import { validate } from "../middlewares/auth.middleware";

const router = express.Router();

// 일반 로그인
router.post("/login", loginValidation, validate, login);

// 구글 로그인
router.post("/google-login", googleLoginValidation, validate, googleLogin);

export default router;





