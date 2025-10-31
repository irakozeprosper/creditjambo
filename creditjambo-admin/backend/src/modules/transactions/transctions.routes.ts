import express from "express";
import { TransactionsController } from "./transactions.controller";

const router = express.Router();
const controller = new TransactionsController();
router.get("/", controller.getAll);
router.get("/today", controller.getAllTransactionsToday);
router.get("/:id", controller.getById);
router.get("/account/:accountId", controller.getByAccount);
router.put("/:id/status", controller.updateStatus);
router.post("/deposit", (req, res) => controller.createDeposit(req, res));
router.post("/withdraw", (req, res) => controller.createWithdrawal(req, res));

export default router;
