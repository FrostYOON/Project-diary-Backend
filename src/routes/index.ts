import express from "express";
import authRoutes from "./auth.routes";

const router = express.Router();

// 인증 관련 라우트
router.use("/auth", authRoutes);

export default router;
