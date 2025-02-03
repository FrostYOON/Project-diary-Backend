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