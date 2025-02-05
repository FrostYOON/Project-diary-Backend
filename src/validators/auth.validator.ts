import { body, ValidationChain } from 'express-validator';
import { User } from '../models';

export const REGEX = {
  PHONE: /^\d{3}-\d{3,4}-\d{4}$/,
  BIRTH: /^(20)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/
};

export const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("이메일 형식이 올바르지 않습니다.")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("비밀번호를 입력해주세요.")
    .isLength({ min: 8 })
    .withMessage("비밀번호는 최소 8자 이상이어야 합니다.")
];

export const googleLoginValidation = [
  body("googleToken")
    .notEmpty()
    .withMessage("구글 토큰이 필요합니다."),
  body("email")
    .isEmail()
    .withMessage("유효하지 않은 이메일 주소입니다.")
    .normalizeEmail()
];

const phoneBirthCheck = () => {
  return [
    body('phone')
      .custom((value, { req }) => {
        if (req.body.registerType === 'normal') {
          if (!value || !REGEX.PHONE.test(value)) {
            throw new Error('유효하지 않은 전화번호 형식입니다.');
          }
        }
        return true;
      }),

    body('birth')
      .custom((value, { req }) => {
        if (req.body.registerType === 'normal') {
          if (!value) {
            throw new Error('생년월일은 필수입니다.');
          }
          if (!REGEX.BIRTH.test(value)) {
            throw new Error('유효하지 않은 생년월일 형식입니다.');
          }
        }
        return true;
      })
  ];
};

export const signUpValidator: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('유효하지 않은 이메일 주소입니다.')
    .normalizeEmail()
    .custom(async (email) => {
      const isEmailTaken = await User.isEmailTaken(email);
      if (isEmailTaken) {
        throw new Error('이미 등록된 이메일입니다.');
      }
      return true;
    }),

  body('name')
    .isLength({ min: 2 })
    .withMessage('이름은 최소 2자 이상이어야 합니다.')
    .trim(),

  body('registerType')
    .optional()
    .isIn(['normal', 'google'])
    .withMessage('유효하지 않은 provider입니다.'),

  body('password')
    .custom((value, { req }) => {
      if (req.body.registerType === 'normal') {
        if (!value || value.length < 8) {
          throw new Error('비밀번호는 최소 8자 이상이어야 합니다.');
        }
        if (!REGEX.PASSWORD.test(value)) {
          throw new Error('비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.');
        }
      }
      return true;
    }),
  ...phoneBirthCheck(),
];
