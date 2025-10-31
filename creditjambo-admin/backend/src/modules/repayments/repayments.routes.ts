import express from "express";
import { RepaymentsController } from "./repayments.controller";

const router = express.Router();
const controller = new RepaymentsController();

router.post("/", controller.create);                     // Create a repayment entry
router.get("/:id", controller.getById);                 // Get repayment by ID
router.get("/loan/:loanId", controller.getByLoan);      // Get all repayments for a loan
router.put("/:id/pay", controller.recordPayment);       // Record a repayment transaction

export default router;
