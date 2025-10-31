import { pool } from "../../config/db";
import { SavingsAccount } from "./savingsAccounts.model";

export class SavingsAccountsRepository {
  async create(
    account: Omit<SavingsAccount, "account_id" | "created_at">
  ): Promise<SavingsAccount> {
    const currentBalance = account.current_balance ?? 0; // 👈 Default here

    const query = `
    INSERT INTO savings_accounts (user_id, account_number, current_balance, is_active)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
    const values = [
      account.user_id,
      account.account_number,
      currentBalance,
      account.is_active ?? true,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async findById(id: number): Promise<SavingsAccount | null> {
    const { rows } = await pool.query(
      "SELECT * FROM savings_accounts WHERE account_id = $1",
      [id]
    );
    return rows[0] || null;
  }

  async findByUserId(userId: number): Promise<SavingsAccount | null> {
    const { rows } = await pool.query(
      "SELECT * FROM savings_accounts WHERE user_id = $1",
      [userId]
    );
    return rows[0] || null;
  }

  async updateBalance(accountId: number, newBalance: number): Promise<void> {
    await pool.query(
      "UPDATE savings_accounts SET current_balance = $1 WHERE account_id = $2",
      [newBalance, accountId]
    );
  }

  async findAll(): Promise<SavingsAccount[]> {
    const { rows } = await pool.query(
      "SELECT a.account_id, u.first_name, u.last_name, a.account_number, a.current_balance, a.is_active, a.created_at FROM savings_accounts a JOIN users u ON a.user_id = u.user_id ORDER BY created_at DESC"
    );
    return rows;
  }

  async findTotalSavings(): Promise<SavingsAccount | null> {
    const { rows } = await pool.query(
      "SELECT SUM(current_balance) FROM savings_accounts"
    );
    return rows[0] || null;
  }
}
