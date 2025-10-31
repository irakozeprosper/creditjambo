import { Request, Response } from "express";
import { LoansService } from "./loans.service";

const service = new LoansService();

export class LoansController {
  async disburseLoan(req: Request, res: Response) {
    try {
      const loan = await service.disburseLoan(req.body);
      res.status(201).json(loan);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    const loans = await service.getAll();
    res.json(loans);
  }

  async getById(req: Request, res: Response) {
    try {
      const loan = await service.getById(Number(req.params.id));
      res.json(loan);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const updated = await service.updateStatus(Number(req.params.id), req.body);
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getLoanByAccountId(req: Request, res: Response) {
    try {
      const accountId = Number(req.params.accountId);
      if (isNaN(accountId)) {
        return res.status(400).json({ message: "Invalid account ID" });
      }

      const result = await service.getLoanByAccountId(accountId);
      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Error fetching active loan:", error);
      return res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  }
}
