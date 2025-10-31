import { Request, Response } from "express";
import { RepaymentsService } from "./repayments.service";

const service = new RepaymentsService();

export class RepaymentsController {
  async create(req: Request, res: Response) {
    try {
      const repayment = await service.create(req.body);
      res.status(201).json(repayment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getByLoan(req: Request, res: Response) {
    try {
      const repayments = await service.getByLoan(Number(req.params.loanId));
      res.json(repayments);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const repayment = await service.getById(Number(req.params.id));
      res.json(repayment);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  async recordPayment(req: Request, res: Response) {
    try {
      const repayment = await service.recordPayment(Number(req.params.id), req.body);
      res.json(repayment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
