import { Router } from 'express';
import passport from 'passport';
import { 
  createUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  getMeController,
  getUsersByDepartmentController,
  changePasswordController
} from '../../../controllers/user.controller';
import { changePasswordValidator, updateUserValidator } from '../../../validators/user.validator';

const router = Router();
const authenticateJWT = passport.authenticate('jwt', { session: false });


// 본인 정보 조회
router.get('/me', authenticateJWT, getMeController);

// 본인 회원정보 수정
router.put("/me", authenticateJWT, updateUserValidator, updateUserController);

// 본인 비밀번호 변경
router.put("/me/password", authenticateJWT, changePasswordValidator, changePasswordController);

// 부서별 사용자 조회
router.get('/department/:departmentId', authenticateJWT, getUsersByDepartmentController);

// 일반적인 CRUD 라우트
router.post('/', authenticateJWT, createUserController);
router.get('/', authenticateJWT, getAllUsersController);
router.get('/:id', authenticateJWT, getUserByIdController);
router.put('/:id', authenticateJWT, updateUserController);
router.delete('/:id', authenticateJWT, deleteUserController);

export default router;