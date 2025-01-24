import express from "express";
import authRoutes from "./auth.routes";

const router = express.Router();

router.use('/auth', authRoutes);
// router.use('/projects', projectRoutes);
// router.use('/tasks', taskRoutes);
// router.use('/users', userRoutes);

export default router;