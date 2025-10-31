import express from "express";
import dotenv from "dotenv";
import usersRouter from "./modules/users/users.routes";
import authRouter from "./modules/users/auth.routes";
import savingsAccountsRouter from "./modules/savings_accounts/savingsAccounts.routes";
import transactionsRoutes from "./modules/transactions/transctions.routes";
import loanRequestsRoutes from "./modules/credit/loanRequests.routes";
import loansRoutes from "./modules/approvedCredit/loans.routes";
import repaymentsRoutes from "./modules/repayments/repayments.routes";

import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    // This setting allows ONLY your frontend URL to make requests
    // Replace 5173 with your actual frontend development port
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true, // Important for sending cookies/headers
  })
);

app.use("/api/auth", authRouter); // login/register
app.use("/api/users", usersRouter); // protected routes
app.use("/api/savings-accounts", savingsAccountsRouter);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/loan-requests", loanRequestsRoutes);
app.use("/api/loans", loansRoutes);
app.use("/api/repayments", repaymentsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
