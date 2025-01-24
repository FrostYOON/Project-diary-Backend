import { body, ValidationChain } from 'express-validator';

export const loginValidation = [
  body("email").isEmail().withMessage("이메일 형식이 올바르지 않습니다."),
  body("password").notEmpty().withMessage("비밀번호를 입력해주세요."),
];

export const googleLoginValidation = [
  body("googleToken").notEmpty().withMessage("구글 로그인"),
];

export const REGEX = {
  PHONE: /^\d{3}-\d{3,4}-\d{4}$/,
  BIRTH: /^(20)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/
};

const phoneBirthCheck = () => {
  return [
    body('phone')
      .custom((value, { req }) => {
        if (req.body.register_type === 'normal') {
        if (!value || !REGEX.PHONE.test(value)) {
          throw new Error('유효하지 않은 전화번호 형식입니다.');
        }
      }
      return true;
    }),

  body('birth')
    .custom((value, { req }) => {
      if (req.body.register_type === 'normal') {
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
  // 공통 필드 검증
  body('email')
    .isEmail()
    .withMessage('유효하지 않은 이메일 주소입니다.')
    .normalizeEmail(),

  body('name')
    .isLength({ min: 2 })
    .withMessage('이름은 최소 2자 이상이어야 합니다.')
    .trim(),

  // provider에 따른 조건부 검증
  body('register_type')
    .optional()
    .isIn(['normal', 'google'])
    .withMessage('유효하지 않은 provider입니다.'),

  // local 회원가입일 경우 추가 검증
  body('password')
    .custom((value, { req }) => {
      if (req.body.register_type === 'normal') {
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
