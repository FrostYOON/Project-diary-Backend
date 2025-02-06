import { body } from 'express-validator';
import { REGEX } from './auth.validator';

// 회원정보 수정 유효성 검사
export const updateUserValidator = [
  body('name')
    .notEmpty().withMessage('이름은 필수입니다.')
    .isLength({ min: 2 }).withMessage('이름은 최소 2자 이상이어야 합니다.')
    .trim(),
  
  body('phone')
    .optional()
    .matches(REGEX.PHONE).withMessage('유효하지 않은 전화번호 형식입니다.'),
  
  body('birth')
    .optional()
    .matches(REGEX.BIRTH).withMessage('유효하지 않은 생년월일 형식입니다.'),
  
  body('department')
    .optional()
    .isMongoId().withMessage('유효하지 않은 부서 ID입니다.'),

  // email과 password는 수정 불가
];

// 비밀번호 변경 유효성 검사
export const changePasswordValidator = [
    body('currentPassword')
        .notEmpty().withMessage('현재 비밀번호를 입력해주세요.'),

    body('newPassword')
        .notEmpty().withMessage('새 비밀번호를 입력해주세요.')
        .isLength({ min: 8 }).withMessage('비밀번호는 최소 8자 이상이어야 합니다.')
        .matches(REGEX.PASSWORD).withMessage('비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.'),

    body('confirmPassword')
        .notEmpty().withMessage('비밀번호 확인을 입력해주세요.')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('비밀번호 확인이 일치하지 않습니다.');
            }
            return true;
        }),
];