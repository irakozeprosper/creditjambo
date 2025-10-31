import express from "express";
import { SavingsAccountsController } from "./savingsAccounts.controller";

const router = express.Router();
const controller = new SavingsAccountsController();

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/total-savings", controller.getTotalSavings);
router.get("/:id", controller.getById);
router.get("/account/:id", controller.getByUserId);
router.put("/:id/balance", controller.updateBalance);

export default router;
