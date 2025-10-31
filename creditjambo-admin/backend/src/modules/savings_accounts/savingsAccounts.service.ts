import { SavingsAccountsRepository } from "./savingsAccounts.repository";
import {
  CreateSavingsAccountDTO,
  UpdateSavingsAccountDTO,
} from "./savingsAccounts.dto";
import { pool } from "../../config/db";

const repo = new SavingsAccountsRepository();

export class SavingsAccountsService {
  async create(dto: CreateSavingsAccountDTO) {
  const existing = await repo.findByUserId(dto.user_id);
  if (existing) throw new Error("User already has a savings account");

  const current_balance = dto.current_balance ?? 0; // 👈 Default to 0
  return repo.create({
    user_id: dto.user_id,
    account_number: dto.account_number,
    current_balance,
    is_active: true,
  });
}

  async getAll() {
    return repo.findAll();
  }

  async getTotalSavings() {
    return repo.findTotalSavings();
  }

  async getById(id: number) {
    const account = await repo.findById(id);
    if (!account) throw new Error("Account not found");
    return account;
  }

  async getByUserId(UserId: number) {
    const account = await repo.findByUserId(UserId);
    if (!account) throw new Error("Account not found");
    return account;
  }

  async getAccountBalance(userId: number): Promise<number | null> {
    const query = `SELECT balance FROM savings_accounts WHERE user_id = $1 LIMIT 1`;
    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) return null;
    return Number(result.rows[0].balance);
  }
  async updateBalance(id: number, dto: UpdateSavingsAccountDTO) {
    const account = await repo.findById(id);
    if (!account) throw new Error("Account not found");
    if (dto.current_balance !== undefined) {
      await repo.updateBalance(id, dto.current_balance);
    }
    return repo.findById(id);
  }
}
