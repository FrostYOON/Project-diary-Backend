import { Request, Response } from "express";
import { User } from "../models";

export const signUpController = async (req: Request, res: Response): Promise<void> => {
  const { email, password, name, phone, birth, department } = req.body;
  try {
    const user = await User.create({ email, password, name, phone, birth, department });
    if (!user) {
      res.status(400).json({ message: '회원가입에 실패했습니다.'});
      return;
    }

    res.status(200).json({
      message: '회원가입에 성공했습니다.',
      redirectUrl: '/login'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const selectUserController = async (req: Request, res: Response): Promise<void> => {
  const users = await User.find();
  try {
    if (!users) {
      res.status(400).json({ message: '유저 조회에 실패했습니다.'});
      return;
    }
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
}