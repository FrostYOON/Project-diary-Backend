import { Router } from 'express';
import passport from 'passport';
import { 
  getUserListController, 
  getUsersByDepartmentController
} from '../../../controllers/user.controller';

const router = Router();

const authenticateJWT = passport.authenticate('jwt', { session: false });

// 모든 라우트에 인증 미들웨어 적용
router.use(authenticateJWT);

// 사용자 목록 조회
router.get('/', getUserListController);

// 부서별 사용자 목록 조회
router.get('/department/:departmentId', getUsersByDepartmentController);

// 사용자 상세 조회
router.get('/:id', getUsersByDepartmentController);

export default router;
