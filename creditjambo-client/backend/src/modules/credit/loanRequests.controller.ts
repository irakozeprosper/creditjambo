import { Request, Response } from "express";
import { LoanRequestsService } from "./loanRequests.service";

const service = new LoanRequestsService();

export class LoanRequestsController {
  // Create a new loan request
  async create(req: Request, res: Response) {
    try {
      const loanRequest = await service.create(req.body);
      res.status(201).json(loanRequest);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get all loan requests
  async getAll(req: Request, res: Response) {
    try {
      const requests = await service.getAll();
      res.json(requests);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllApproved(req: Request, res: Response) {
    try {
      const requests = await service.getAllApproved();
      res.json(requests);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get loan requests by user
  async getByUser(req: Request<{ userId: string }>, res: Response) {
    try {
      const requests = await service.getByUser(Number(req.params.userId));
      res.json(requests);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
