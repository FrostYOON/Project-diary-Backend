import { body } from "express-validator";

export const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("이메일 형식이 올바르지 않습니다."),
  body("password")
    .isLength({ min: 10})
    .withMessage("비밀번호는 10자 이상이어야 합니다."),
];
