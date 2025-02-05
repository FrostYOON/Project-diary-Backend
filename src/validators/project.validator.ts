import { body } from 'express-validator';

export const createProjectValidation = [
    body('title').notEmpty().withMessage('프로젝트 이름을 입력해주세요.'),
    body('description').notEmpty().withMessage('프로젝트 설명을 입력해주세요.'),
    body('startDate').notEmpty().withMessage('프로젝트 시작일을 입력해주세요.')
        .isDate().withMessage('유효하지 않은 날짜 형식입니다.'),
    body('endDate').notEmpty().withMessage('프로젝트 종료일을 입력해주세요.')
        .isDate().withMessage('유효하지 않은 날짜 형식입니다.')
        .custom((value, { req }) => {
            if (new Date(value) < new Date(req.body.startDate)) {
                throw new Error('종료일은 시작일 이후여야 합니다.');
            }
            return true;
        }),
    body('status').notEmpty().withMessage('프로젝트 상태를 입력해주세요.')
        .isIn(['준비', '진행중', '완료', '보류']).withMessage('유효하지 않은 상태입니다.'),
];