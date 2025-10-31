import { Request, Response } from "express";
import { LoansService } from "./loans.service";

const service = new LoansService();

export class LoansController {
  createLoan = async (req: Request, res: Response) => {
    try {
      const loan = await service.createLoan(req.body);
      res.status(201).json(loan);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  updatePaidAmount = async (req: Request, res: Response) => {
    try {
      const { loan_id } = req.body;
      const { paid_amount } = req.body;
      const { status } = req.body;
      const result = await service.updateLoanPaidAmount(
        loan_id,
        status,
        paid_amount
      );
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  async getActiveByAccount(req: Request<{ accountId: number }>, res: Response) {
    try {
      const { accountId } = req.params;
      if (!accountId) {
        return res.status(400).json({ message: "Invalid account_id" });
      }

      const loan = await service.getActiveLoanByAccount(accountId);
      res.json(loan);
    } catch (err: any) {
      res.status(404).json({ message: err.message });
    }
  }
}
