import { Request, Response } from "express";
import { TransactionsService } from "./transactions.service";

const service = new TransactionsService();

export class TransactionsController {
  async createDeposit(req: Request, res: Response) {
    try {
      const {
        account_id,
        amount,
        source_destination_name,
        source_destination_account,
      } = req.body;

      // Basic validation
      if (
        !account_id ||
        !amount ||
        !source_destination_name ||
        !source_destination_account
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const deposit = await service.createDeposit({
        account_id,
        amount,
        source_destination_name,
        source_destination_account,
        type: "Deposit",
        reference_number: "",
      });

      return res.status(201).json({
        message: "Deposit created successfully",
        deposit,
      });
    } catch (error: any) {
      console.error("Error creating deposit:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  async createWithdrawal(req: Request, res: Response) {
    try {
      const {
        account_id,
        amount,
        source_destination_name,
        source_destination_account,
      } = req.body;

      // Basic validation
      if (
        !account_id ||
        !amount ||
        !source_destination_name ||
        !source_destination_account
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Call service to create withdrawal
      const withdrawal = await service.createWithdrawal({
        account_id,
        amount,
        source_destination_name,
        source_destination_account,
        type: "Withdrawal",
        reference_number: "", // Repository will generate a unique reference
      });

      return res.status(201).json({
        message: "Withdrawal created successfully",
        withdrawal,
      });
    } catch (error: any) {
      console.error("Error creating withdrawal:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  async getAll(req: Request, res: Response) {
    const transactions = await service.getAll();
    res.json(transactions);
  }

  async getAllTransactionsToday(req: Request, res: Response) {
    const transactions = await service.getAllTransactionsToday();
    res.json(transactions);
  }

  async getById(req: Request, res: Response) {
    try {
      const transaction = await service.getById(Number(req.params.id));
      res.json(transaction);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  async getByAccount(req: Request, res: Response) {
    try {
      const transactions = await service.getByAccount(
        Number(req.params.accountId)
      );
      res.json(transactions);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const transaction = await service.updateStatus(
        Number(req.params.id),
        req.body
      );
      res.json(transaction);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
