import { Request, Response } from "express";
import { AuthService } from "./auth.service";

const authService = new AuthService();

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    res.json(data);
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
