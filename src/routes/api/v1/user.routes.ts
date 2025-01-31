import { Router } from 'express';
import passport from 'passport';
import { 
  createUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  getUserDepartmentController
} from '../../../controllers/user.controller';

const router = Router();
const authenticateJWT = passport.authenticate('jwt', { session: false });

// 내 부서 정보 조회 (먼저 정의)
router.get('/me/department', authenticateJWT, getUserDepartmentController);

// CRUD 라우트
router.post('/', authenticateJWT, createUserController);
router.get('/', authenticateJWT, getAllUsersController);
router.get('/:id', authenticateJWT, getUserByIdController);
router.put('/:id', authenticateJWT, updateUserController);
router.delete('/:id', authenticateJWT, deleteUserController);

export default router;
