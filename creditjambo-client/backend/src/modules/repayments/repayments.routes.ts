import express from "express";
import { RepaymentsController } from "./repayments.controller";

const router = express.Router();
const controller = new RepaymentsController();

router.post("/", controller.createRepayment);
router.get("/", controller.getAllRepayments);
router.get("/loan/:loanId", controller.getRepaymentsByLoan);

export default router;
