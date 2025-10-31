import express from "express";
import { LoansController } from "./loans.controller";

const router = express.Router();
const controller = new LoansController();

router.post("/", controller.createLoan);
router.patch("/", controller.updatePaidAmount);
router.get("/account/:accountId/active", controller.getActiveByAccount);

export default router;
