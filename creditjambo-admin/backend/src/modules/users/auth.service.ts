import { UsersRepository } from "./users.repository";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const usersRepo = new UsersRepository();

export class AuthService {
  async login(email: string, password: string) {
    const user = await usersRepo.findByEmail(email);

    if (!user) throw new Error("Invalid email or password");

    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) throw new Error("Invalid email or password");

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email }, // consistent naming
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN || "2h" } as SignOptions
    );

    return { token, user };
  }

  async register(userData: {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone_number: string;
    date_of_birth: Date;
  }) {
    return usersRepo.create(userData);
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (err) {
      throw new Error("Invalid token");
    }
  }
}
