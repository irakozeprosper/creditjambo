import { RepaymentsRepository } from "./repayments.repository";
import { Repayment } from "./repayments.model";
import { TransactionsRepository } from "../transactions/transactions.repository";
import { SavingsAccountsRepository } from "../savings_accounts/savingsAccounts.repository";
import { LoansRepository } from "../approvedCredit/loans.repository";

const transactionsRepo = new TransactionsRepository();
const accountsRepo = new SavingsAccountsRepository();
const loansRepo = new LoansRepository();
const repo = new RepaymentsRepository();

export class RepaymentsService {
  // Create a new repayment
  async createRepayment({
    account_id,
    loan_id,
    amount,
  }: {
    account_id: number;
    loan_id: number;
    amount: number;
  }) {
    // 1️⃣ Fetch account & loan
    const account = await accountsRepo.findById(account_id);
    const loan = await loansRepo.findById(loan_id);

    if (!account || !loan) throw new Error("Account or loan not found");
    if (account.current_balance < amount) throw new Error("Insufficient funds");

    // 2️⃣ Deduct from savings account
    const newBalance = account.current_balance - amount;
    await accountsRepo.updateBalance(account_id, newBalance);

    // 3️⃣ Record repayment transaction
    const transaction = await transactionsRepo.createRepaymentTransaction(
      account_id,
      amount
    );

    // 4️⃣ Update loan amounts
    const newPaidAmount = loan.paid_amount + amount;
    const remaining = loan.total_repayable - newPaidAmount;
    const newStatus = remaining == 0 ? "Paid" : "Active";

    await loansRepo.updatePaidAmount(loan_id, newStatus, amount);

    return await repo.create(loan_id, amount, transaction.transaction_id);
  }

  // Get all repayments for a specific loan
  async getRepaymentsByLoan(loan_id: number): Promise<Repayment[]> {
    return await repo.findByLoanId(loan_id);
  }

  // Get all repayments in the system
  async getAllRepayments(): Promise<Repayment[]> {
    return await repo.findAll();
  }
}
