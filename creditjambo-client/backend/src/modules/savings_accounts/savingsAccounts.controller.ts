import { Request, Response } from "express";
import { SavingsAccountsService } from "./savingsAccounts.service";

const service = new SavingsAccountsService();

export class SavingsAccountsController {
  async create(req: Request, res: Response) {
    try {
      const account = await service.create(req.body);
      res.status(201).json(account);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    const accounts = await service.getAll();
    res.json(accounts);
  }

  async getById(req: Request, res: Response) {
    try {
      const account = await service.getById(Number(req.params.id));
      res.json(account);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  async getByUserId(req: Request, res: Response) {
    try {
      const account = await service.getByUserId(Number(req.params.user_id));
      res.json(account);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  async updateBalance(req: Request, res: Response) {
    try {
      const account = await service.updateBalance(Number(req.params.id), req.body);
      res.json(account);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
