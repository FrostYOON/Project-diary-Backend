import { Request, Response } from "express";
import { authenticateUser, findOrCreateGoogleUser } from "../services/auth.service";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const { token, user } = await authenticateUser(email, password);
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  const googleProfile = req.body;

  try {
    const { token, user } = await findOrCreateGoogleUser(googleProfile);
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Failed to authenticate with Google" });
  }
};
