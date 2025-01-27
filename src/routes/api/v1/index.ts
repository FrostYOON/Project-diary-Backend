import express from "express";
import authRoutes from "./auth.routes";
import weatherRoutes from './weather.routes';
import departmentRoutes from './department.routes';
// import projectRoutes from './project.routes';
import taskRoutes from './task.routes';
// import userRoutes from './user.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/departments', departmentRoutes);
// router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
// router.use('/users', userRoutes);
router.use('/weather', weatherRoutes);

export default router;