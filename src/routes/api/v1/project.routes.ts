import { Router } from 'express';
import passport from 'passport';
import { 
  getProjectListController, 
  getProjectByIdController,
  createProjectController, 
  updateProjectController, 
  deleteProjectController,
  getProjectsByDepartmentAndUserController,
} from '../../../controllers/project.controller';
import { checkProjectExists, checkProjectPermission } from '../../../middlewares/project.middleware';

const router = Router();

const authenticateJWT = passport.authenticate('jwt', { session: false });

// 모든 라우트에 인증 미들웨어 적용
router.use(authenticateJWT);

// 프로젝트 목록 조회 - checkProjectExists 제거
router.get('/', getProjectListController);

// 프로젝트 상세 조회
router.get('/:id', checkProjectExists, getProjectByIdController);

// 프로젝트 생성
router.post('/', 
  passport.authenticate('jwt', { session: false }),  // passport 인증 미들웨어 사용
  checkProjectPermission,
  createProjectController
);

// 프로젝트 수정
router.put('/:id', 
  passport.authenticate('jwt', { session: false }),
  checkProjectPermission,
  updateProjectController
);

// 프로젝트 삭제
router.delete('/:id', 
  passport.authenticate('jwt', { session: false }),
  checkProjectPermission,
  deleteProjectController
);

// 부서와 사용자별 프로젝트 조회
router.get('/', getProjectsByDepartmentAndUserController);

export default router;