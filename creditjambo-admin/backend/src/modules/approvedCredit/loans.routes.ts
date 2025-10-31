import express from "express";
import { LoansController } from "./loans.controller";

const router = express.Router();
const controller = new LoansController();

router.post("/disburse", controller.disburseLoan);        // Disburse a loan
router.get("/", controller.getAll);                       // Get all loans
router.get("/:id", controller.getById);                  // Get loan by ID
router.put("/:id/status", controller.updateStatus);      // Update loan status
router.get("/account/:accountId/active", controller.getLoanByAccountId);

export default router;
