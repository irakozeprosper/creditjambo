import { Request, Response } from "express";
import { RepaymentsService } from "./repayments.service";

const service = new RepaymentsService();

export class RepaymentsController {
  // Create a new repayment
  async createRepayment(req: Request, res: Response) {
    try {
      const { account_id, loan_id, amount } = req.body;

      const result = await service.createRepayment({
        account_id,
        loan_id,
        amount,
      });

      return res.status(200).json({
        message: "Repayment processed successfully",
        data: result,
      });
    } catch (error: any) {
      console.error("Repayment error:", error);
      return res.status(400).json({ message: error.message });
    }
  }

  // Get all repayments for a specific loan
  async getRepaymentsByLoan(req: Request<{ loan_id: string }>, res: Response) {
    try {
      const { loan_id } = req.params;
      const repayments = await service.getRepaymentsByLoan(Number(loan_id));
      res.json(repayments);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  // Get all repayments
  async getAllRepayments(req: Request, res: Response) {
    try {
      const repayments = await service.getAllRepayments();
      res.json(repayments);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}
