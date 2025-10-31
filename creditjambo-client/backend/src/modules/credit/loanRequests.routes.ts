import express from "express";
import { LoanRequestsController } from "./loanRequests.controller";

const router = express.Router();
const controller = new LoanRequestsController();

// Routes
router.post("/", controller.create); // Create new loan request
router.get("/", controller.getAll); // Get all loan requests
router.get("/user/:userId", controller.getByUser); // Get all requests for a user
router.get("/approved", controller.getAllApproved); // Get all approved loan requests

export default router;
