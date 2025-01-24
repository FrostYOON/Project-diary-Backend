import { body } from "express-validator";

export const loginValidation = [
  body("email").isEmail().withMessage("이메일 형식이 올바르지 않습니다."),
  body("password").notEmpty().withMessage("비밀번호를 입력해주세요."),
];

export const googleLoginValidation = [
  body("googleToken").notEmpty().withMessage("구글 로그인"),
];


