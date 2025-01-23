import express, { Request, Response, NextFunction } from "express";
import { login } from "../controllers/auth.controller";
import { loginValidator } from "../validators/auth.validator";

const router = express.Router();

// 로그인 라우트
router.post("/login", loginValidator, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await login(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
