import { pool } from "../../config/db";
import { Transaction } from "./transactions.model";
import {
  CreateTransactionDTO,
  UpdateTransactionStatusDTO,
} from "./transactions.dto";

export class TransactionsRepository {
  // Optional deposit helper
  async deposit(
    data: Omit<Transaction, "transaction_id" | "transaction_date" | "status">
  ): Promise<Transaction> {
    const client = await pool.connect();
    const generateReference = () =>
      `REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    let referenceNumber = generateReference();

    try {
      await client.query("BEGIN");

      const internal_account_id = data.account_id;
      const transaction_date = new Date();

      // 2️⃣ Insert transaction
      const insertQuery = `
        INSERT INTO transactions
            (account_id, type, amount, status, reference_number, transaction_date, source_destination_name, source_destination_account)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
        `;
      const insertValues = [
        internal_account_id,
        "Deposit",
        data.amount,
        "Completed",
        referenceNumber,
        transaction_date,
        data.source_destination_name,
        data.source_destination_account,
      ];

      const { rows } = await client.query(insertQuery, insertValues);
      const transaction = rows[0];

      // 3️⃣ Update savings account balance
      const accountQuery = `
        UPDATE savings_accounts
        SET current_balance = current_balance + $1
        WHERE account_id = $2
        RETURNING *;
        `;
      const accountValues = [data.amount, internal_account_id];
      const accountResult = await client.query(accountQuery, accountValues);

      if (accountResult.rowCount === 0) {
        // This case should be caught by the first query, but acts as a final safeguard
        throw new Error("Savings account not found after all checks.");
      }

      await client.query("COMMIT");
      return transaction;
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error creating deposit and updating balance:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  async withdraw(
    data: Omit<Transaction, "transaction_id" | "transaction_date" | "status">
  ): Promise<Transaction> {
    const client = await pool.connect();
    const generateReference = () =>
      `REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    let referenceNumber = generateReference();

    try {
      await client.query("BEGIN");

      const internal_account_id = data.account_id;
      const transaction_date = new Date();

      // 1️⃣ Check if account has enough balance
      const accountCheckQuery = `
      SELECT current_balance
      FROM savings_accounts
      WHERE account_id = $1
      FOR UPDATE;
    `;
      const accountCheckResult = await client.query(accountCheckQuery, [
        internal_account_id,
      ]);

      if (accountCheckResult.rowCount === 0) {
        throw new Error("Savings account not found.");
      }

      const currentBalance = Number(accountCheckResult.rows[0].current_balance);
      if (currentBalance < data.amount) {
        throw new Error("Insufficient balance for withdrawal.");
      }

      // 2️⃣ Insert transaction
      const insertQuery = `
      INSERT INTO transactions
        (account_id, type, amount, status, reference_number, transaction_date, source_destination_name, source_destination_account)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
      const insertValues = [
        internal_account_id,
        "Withdrawal",
        data.amount,
        "Completed",
        referenceNumber,
        transaction_date,
        data.source_destination_name,
        data.source_destination_account,
      ];

      const { rows } = await client.query(insertQuery, insertValues);
      const transaction = rows[0];

      // 3️⃣ Update savings account balance
      const accountUpdateQuery = `
      UPDATE savings_accounts
      SET current_balance = current_balance - $1
      WHERE account_id = $2
      RETURNING *;
    `;
      const accountUpdateResult = await client.query(accountUpdateQuery, [
        data.amount,
        internal_account_id,
      ]);

      if (accountUpdateResult.rowCount === 0) {
        throw new Error("Failed to update account balance.");
      }

      await client.query("COMMIT");
      return transaction;
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error creating withdrawal and updating balance:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  async findById(id: number): Promise<Transaction | null> {
    const { rows } = await pool.query(
      "SELECT * FROM transactions WHERE transaction_id = $1",
      [id]
    );
    return rows[0] || null;
  }

  async findAll(): Promise<Transaction[]> {
    const { rows } = await pool.query(
      "SELECT * FROM transactions ORDER BY transaction_date DESC"
    );
    return rows;
  }

  async findByAccountId(accountId: number): Promise<Transaction[]> {
    const { rows } = await pool.query(
      "SELECT * FROM transactions WHERE account_id = $1 ORDER BY transaction_date DESC",
      [accountId]
    );
    return rows;
  }

  async updateStatus(
    transactionId: number,
    status: "Pending" | "Completed" | "Failed" | "Reversed"
  ): Promise<void> {
    await pool.query(
      "UPDATE transactions SET status = $1 WHERE transaction_id = $2",
      [status, transactionId]
    );
  }
  async createRepaymentTransaction(account_id: number, amount: number) {
    const reference_number = `TXN-${Date.now()}-${Math.floor(
      Math.random() * 10000
    )}`;
    const query = `
      INSERT INTO transactions (
        account_id, type, amount, status, reference_number, transaction_date,
        source_destination_name, source_destination_account
      )
      VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7)
      RETURNING *;
    `;
    const values = [
      account_id,
      "Repayment",
      amount,
      "Completed",
      reference_number,
      "CreditJambo",
      "1000000000",
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }
}
