import { TransactionsRepository } from "./transactions.repository";
import { SavingsAccountsRepository } from "../savings_accounts/savingsAccounts.repository";
import { CreateTransactionDTO } from "./transactions.dto";

const transactionsRepo = new TransactionsRepository();
const accountsRepo = new SavingsAccountsRepository();

export class TransactionsService {
  // Optional helper for direct deposit creation
  async createDeposit(dto: CreateTransactionDTO) {
    // Always treat deposit as type "Deposit" and status "Pending" by default
    const transactionData = {
      ...dto,
      type: "Deposit" as const,
    };

    const deposit = await transactionsRepo.deposit(transactionData);
    return deposit;
  }

  async createWithdrawal(dto: CreateTransactionDTO) {
    const transactionData = {
      ...dto,
      type: "Withdrawal" as const, // Always "Withdrawal"
    };
    const withdrawal = await transactionsRepo.withdraw(transactionData);
    return withdrawal;
  }

  async getAll() {
    return transactionsRepo.findAll();
  }

  async getAllTransactionsToday() {
    return transactionsRepo.findAllTransactionsToday();
  }

  async getById(id: number) {
    const transaction = await transactionsRepo.findById(id);
    if (!transaction) throw new Error("Transaction not found");
    return transaction;
  }

  async getByAccount(accountId: number) {
    return transactionsRepo.findByAccountId(accountId);
  }

  async updateStatus(
    id: number,
    status: "Pending" | "Completed" | "Failed" | "Reversed"
  ) {
    const transaction = await transactionsRepo.findById(id);
    if (!transaction) throw new Error("Transaction not found");

    await transactionsRepo.updateStatus(id, status);
    return transactionsRepo.findById(id);
  }
}
