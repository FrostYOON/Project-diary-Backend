import express from "express";
import authRoutes from "./auth.routes";
import weatherRoutes from './weather.routes';
import projectRoutes from './project.routes';
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
// router.use('/tasks', taskRoutes);
// router.use('/users', userRoutes);
router.use('/weather', weatherRoutes);

export default router;