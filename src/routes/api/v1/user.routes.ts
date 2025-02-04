import { Router } from 'express';
import { 
  createUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  getMeController,
  getUsersByDepartmentController,
  changePasswordController,
  getUserRoleController
} from '../../../controllers/user.controller';
import { changePasswordValidator, updateUserValidator } from '../../../validators/user.validator';

const router = Router();

// 본인 정보 조회
router.get('/me', getMeController);

// 본인 회원정보 수정
router.put("/me", updateUserValidator, updateUserController);

// 본인 비밀번호 변경
router.put("/me/password", changePasswordValidator, changePasswordController);

// 부서별 사용자 조회
router.get('/department/:departmentId', getUsersByDepartmentController);

// 사용자 권한 조회
router.get('/role', getUserRoleController);

// 일반적인 CRUD 라우트
router.post('/', createUserController);
router.get('/', getAllUsersController);
router.get('/:id', getUserByIdController);
router.put('/:id', updateUserController);
router.delete('/:id', deleteUserController);

export default router;