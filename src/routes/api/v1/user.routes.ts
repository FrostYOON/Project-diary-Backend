import { Router } from 'express';
import passport from 'passport';
import { 
  createUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  getUserDepartmentController,
  getUsersByDepartmentController
} from '../../../controllers/user.controller';

const router = Router();
const authenticateJWT = passport.authenticate('jwt', { session: false });

// 내 부서 정보 조회 (가장 구체적인 경로)
router.get('/me/department', authenticateJWT, getUserDepartmentController);

// 부서별 사용자 조회 (두 번째로 구체적인 경로)
router.get('/department/:departmentId', authenticateJWT, getUsersByDepartmentController);

// 일반적인 CRUD 라우트
router.post('/', authenticateJWT, createUserController);
router.get('/', authenticateJWT, getAllUsersController);
router.get('/:id', authenticateJWT, getUserByIdController);
router.put('/:id', authenticateJWT, updateUserController);
router.delete('/:id', authenticateJWT, deleteUserController);

export default router;
