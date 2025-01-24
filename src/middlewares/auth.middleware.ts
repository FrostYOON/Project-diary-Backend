import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

// 유효성 검사 결과 처리 미들웨어
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // 유효성 검사 실패 시 400 상태 코드와 에러 배열을 반환
    res.status(400).json({ errors: errors.array() });
    return;
  }

  // 유효성 검사 통과 시 다음 미들웨어로 넘어감
  next();
};



