import express from "express";
import { LoanRequestsController } from "./loanRequests.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = express.Router();
const controller = new LoanRequestsController();

// Routes
router.post("/", controller.create); // Create new loan request
router.get("/", controller.getAll); // Get all loan requests
router.get("/status/:status", controller.getByStatus);
router.get("/:id", controller.getById); // Get loan request by ID
router.get("/user/:userId", controller.getByUser); // Get all requests for a user
router.patch("/:id/status", authenticate, controller.updateStatus); // Update request status

export default router;
