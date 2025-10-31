import { Request, Response } from "express";
import { LoanRequestsService } from "./loanRequests.service";

const service = new LoanRequestsService();

export class LoanRequestsController {
  async create(req: Request, res: Response) {
    try {
      const loanRequest = await service.create(req.body);
      res.status(201).json(loanRequest);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    const requests = await service.getAll();
    res.json(requests);
  }

  async getByStatus(req: Request, res: Response) {
    try {
      const requests = await service.getByStatus(String(req.params.status));
      res.json(requests);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const request = await service.getById(Number(req.params.id));
      res.json(request);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  async getByUser(req: Request, res: Response) {
    try {
      const requests = await service.getByUser(Number(req.params.userId));
      res.json(requests);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const requestId = Number(req.params.id);
      const { request_status } = req.body;

      // Assume logged-in user ID is in req.user.id (e.g., from auth middleware)
      const approverId = (req as any).user?.user_id;

      if (!approverId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!["Pending", "Approved", "Rejected"].includes(request_status)) {
        return res
          .status(400)
          .json({ message: `Invalid request_status value ${request_status}` });
      }

      const updatedRequest = await service.updateStatus(
        requestId,
        { request_status },
        approverId
      );

      return res.status(200).json({ data: updatedRequest });
    } catch (error: any) {
      console.error("Error updating loan request status:", error);
      return res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  }
}
