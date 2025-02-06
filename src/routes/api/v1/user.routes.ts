import { Router } from 'express';
import { 
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  getMeController,
  getUsersByDepartmentController,
  changePasswordController,
  getUserRoleController,
  updateProfileImageController,
} from '../../../controllers/user.controller';
import { changePasswordValidator, updateUserValidator } from '../../../validators/user.validator';
import { upload } from '../../../middlewares/upload.middleware';

const router = Router();

// 본인 정보 조회
router.get('/me', getMeController);

// 본인 회원정보 수정
router.put("/me", updateUserValidator, updateUserController);

// 프로필 이미지 업로드
router.post('/me/profileImage', 
  upload.single('file'),  // 'profileImage' -> 'file'로 변경
  updateProfileImageController
);

// 본인 비밀번호 변경
router.put("/me/password", changePasswordValidator, changePasswordController);

// 부서별 사용자 조회
router.get('/department/:departmentId', getUsersByDepartmentController);

// 사용자 권한 조회
router.get('/role', getUserRoleController);

// 일반적인 CRUD 라우트
router.get('/', getAllUsersController);
router.get('/:id', getUserByIdController);
router.put('/:id', updateUserController);
router.delete('/:id', deleteUserController);

export default router;