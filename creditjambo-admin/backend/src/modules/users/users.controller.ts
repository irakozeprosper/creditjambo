import { Request, Response } from "express";
import { UsersService } from "./users.service";

const usersService = new UsersService();

export const getUsers = async (req: Request, res: Response) => {
  const users = await usersService.getAllUsers();
  res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await usersService.getUserById(Number(id));

  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

export const createUser = async (req: Request, res: Response) => {
  const newUser = await usersService.createUser(req.body);
  res.status(201).json(newUser);
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedUser = await usersService.updateUser(Number(id), req.body);

  if (!updatedUser) return res.status(404).json({ message: "User not found" });
  res.json(updatedUser);
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await usersService.deleteUser(Number(id));

  if (!deleted) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted successfully" });
};
