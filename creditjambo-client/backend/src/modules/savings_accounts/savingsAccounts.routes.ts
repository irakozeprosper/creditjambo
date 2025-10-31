import express from "express";
import { SavingsAccountsController } from "./savingsAccounts.controller";

const router = express.Router();
const controller = new SavingsAccountsController();

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.get("/account/:user_id", controller.getByUserId);
router.put("/:id/balance", controller.updateBalance);

export default router;
