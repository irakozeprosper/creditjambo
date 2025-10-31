import { User } from "../models/user"; // Or wherever your User type/interface is

declare global {
  namespace Express {
    interface Request {
      user?: {
        user_id: number;
        email: string;
        iat?: number;
        exp?: number;
      };
    }
  }
}
