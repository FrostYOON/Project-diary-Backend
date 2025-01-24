import { Request, Response, NextFunction } from "express";
import { User } from "../models";
import { authService } from "../services/auth.service";
import { IUserSignup } from "../types/user.types";
import { ApiResponse } from "../types/response.types";

export const signUpController = async (
  req: Request<{}, {}, IUserSignup>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};